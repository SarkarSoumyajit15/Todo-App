import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private usersService: UsersService
  ) {}

  async findAll(
    user: UserDocument,
    userId?: string,
    priority?: string | string[],
    tags?: string | string[],
    status?: string
  ): Promise<TodoDocument[]> {
    let currentUser = user;

    // If userId is provided and different from current user, find that user
    if (userId && user._id.toString() !== userId) {
      const foundUser = await this.usersService.findOne(userId);
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      currentUser = foundUser;
    }

    // Build filter object
    const filter: any = {
      $or: [
        { createdBy: currentUser._id },
        { mentions: currentUser._id }
      ]
    };

    // Handle priority filters
    if (priority) {
      filter.priority = Array.isArray(priority) ? { $in: priority } : priority;
    }

    // Handle tag filters
    if (tags) {
      filter.tags = Array.isArray(tags) ? { $in: tags } : tags;
    }

    // Handle status filter
    if (status) {
      filter.status = status;
    }

    // Find todos with filters
    return this.todoModel.find(filter)
      .populate('tags')
      .populate('mentions', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  // For the findById methods, add null checks
  async findOne(id: string, user: UserDocument): Promise<TodoDocument> {
    const todo = await this.todoModel.findById(id)
      .populate('createdBy', 'name username avatar')
      .populate('mentions', 'name username avatar')
      .populate('tags', 'name color textColor')
      .populate('notes.createdBy', 'name username avatar')
      .exec();
  
    if (!todo) {
      throw new NotFoundException('No todo found with that ID');
    }

    // Check if user has permission to access this todo
    const isCreator = todo.createdBy._id.toString() === user._id.toString();
    const isMentioned = todo.mentions.some(
      mentionedUser => mentionedUser._id.toString() === user._id.toString()
    );

    if (!isCreator && !isMentioned) {
      throw new ForbiddenException('You do not have permission to access this todo');
    }

    return todo as TodoDocument;
  }

  // Also fix the create method
  async create(createTodoDto: CreateTodoDto, user: UserDocument): Promise<TodoDocument> {
    // Add current user as creator
    const todoData = {
      ...createTodoDto,
      createdBy: user._id
    };

    // Process mentions if any
    if (createTodoDto.mentions && createTodoDto.mentions.length > 0) {
      // Find users by usernames or IDs
      const mentionedUsers = await this.usersService.findManyByUsernameOrId(
        createTodoDto.mentions.map(m => typeof m === 'string' ? m.replace('@', '') : m)
      );

      todoData.mentions = mentionedUsers.map(user => user._id.toString());
    }

    const newTodo = await this.todoModel.create(todoData);

    // Update assigned_todos for mentioned users if mentions exist
    if (todoData.mentions && todoData.mentions.length > 0) {
      await this.usersService.addTodoToUsers(todoData.mentions, newTodo.id);
    }

    // Populate the new todo with related data
    const populatedTodo = await this.todoModel.findById(newTodo.id)
      .populate('createdBy', 'name username avatar')
      .populate('mentions', 'name username avatar')
      .populate('tags', 'name color textColor')
      .exec();
      
    if (!populatedTodo) {
      throw new NotFoundException('Failed to retrieve created todo');
    }
    
    return populatedTodo as TodoDocument;
  }

  // And fix the addNote method
  async addNote(id: string, addNoteDto: AddNoteDto, user: UserDocument): Promise<TodoDocument> {
    const todo = await this.todoModel.findById(id)
      .populate('createdBy', 'name username avatar')
      .populate('mentions', 'name username avatar')
      .populate('tags', 'name color textColor')
      .populate('notes.createdBy', 'name username avatar')
      .exec();
      
    if (!todo) {
      throw new NotFoundException('Failed to retrieve updated todo');
    }
    
    return todo as TodoDocument;
  }

  // For the ObjectId vs string array issue in the update method
  async update(id: string, updateTodoDto: UpdateTodoDto, user: UserDocument): Promise<TodoDocument> {
    // Find the todo first to check permissions
    const todo = await this.todoModel.findById(id).exec();
  
    if (!todo) {
      throw new NotFoundException('No todo found with that ID');
    }
  
    // Only the creator can update the todo
    if (todo.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to update this todo');
    }
  
    // Process mentions if any
    if (updateTodoDto.mentions && updateTodoDto.mentions.length > 0) {
      // Find users by usernames or IDs
      const mentionedUsers = await this.usersService.findManyByUsernameOrId(
        updateTodoDto.mentions
      );
  
      const mentionedIds = mentionedUsers.map(user => user._id.toString());
      
      // Convert ObjectIds to strings for the DTO
      const mentionIds = mentionedUsers.map(user => user._id);
      updateTodoDto.mentions = mentionIds as unknown as string[];
  
      // Update assigned_todos for mentioned users
      await this.usersService.addTodoToUsers(mentionIds as unknown as string[], id);
  
      // Remove from assigned_todos for users no longer mentioned
      const removedUsers = todo.mentions.filter(
        mentionId => !mentionedIds.includes(mentionId.toString())
      );
  
      if (removedUsers.length > 0) {
        await this.usersService.removeTodoFromUsers(
          removedUsers.map(id => id.toString()), 
          id
        );
      }
    }
  
    // Update the todo
    const updatedTodo = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, {
      new: true,
      runValidators: true
    })
    .populate('createdBy', 'name username avatar')
    .populate('mentions', 'name username avatar')
    .populate('tags', 'name color textColor')
    .exec();
  
    if (!updatedTodo) {
      throw new NotFoundException('Failed to update todo');
    }
  
    return updatedTodo;
  }

  async remove(id: string, user: UserDocument): Promise<void> {
    const todo = await this.todoModel.findById(id).exec();

    if (!todo) {
      throw new NotFoundException('No todo found with that ID');
    }

    // Only the creator can delete the todo
    if (todo.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to delete this todo');
    }

    // Remove from assigned_todos for all mentioned users
    if (todo.mentions && todo.mentions.length > 0) {
      await this.usersService.removeTodoFromUsers(
        todo.mentions.map(id => id.toString()), 
        id
      );
    }

    await this.todoModel.findByIdAndDelete(id).exec();
  }

  // async addNote(id: string, addNoteDto: AddNoteDto, user: UserDocument): Promise<TodoDocument> {
  //   const todo = await this.todoModel.findById(id).exec();

  //   if (!todo) {
  //     throw new NotFoundException('No todo found with that ID');
  //   }

  //   // Check if user has access to this todo
  //   const isCreator = todo.createdBy.toString() === user.id;
  //   const isMentioned = todo.mentions.some(
  //     userId => userId.toString() === user.id
  //   );

  //   if (!isCreator && !isMentioned) {
  //     throw new ForbiddenException('You do not have permission to add notes to this todo');
  //   }

  //   const note = {
  //     content: addNoteDto.content,
  //     createdBy: user.id,
  //     date: new Date()
  //   };

  //   todo.notes.push(note);
  //   await todo.save();

  //   return this.todoModel.findById(id)
  //     .populate('createdBy', 'name username avatar')
  //     .populate('mentions', 'name username avatar')
  //     .populate('tags', 'name color textColor')
  //     .populate('notes.createdBy', 'name username avatar')
  //     .exec();
  // }
}
