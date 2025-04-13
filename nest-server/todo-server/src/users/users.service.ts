import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-__v').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id)
      .populate({
        path: 'todos',
        select: '-__v',
        populate: [
          { path: 'tags', select: 'name color textColor' },
          { path: 'mentions', select: 'name username avatar' }
        ]
      })
      .populate({
        path: 'assigned_todos',
        select: '-__v',
        populate: [
          { path: 'tags', select: 'name color textColor' },
          { path: 'createdBy', select: 'name username avatar' },
          { path: 'mentions', select: 'name username avatar' }
        ]
      })
      .exec();
      
    if (!user) {
      throw new NotFoundException('No user found with that ID');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    
    if (!user) {
      throw new NotFoundException('No user found with that ID');
    }
    
    return user;
  }

  async remove(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!user) {
      throw new NotFoundException('No user found with that ID');
    }
    
    return user;
  }

  // Add these methods to your existing UsersService class
  
  async findManyByUsernameOrId(identifiers: string[]): Promise<UserDocument[]> {
    return this.userModel.find({
      $or: [
        { _id: { $in: identifiers.filter(id => Types.ObjectId.isValid(id)) } },
        { username: { $in: identifiers } }
      ]
    }).exec();
  }
  
  async addTodoToUsers(userIds: string[], todoId: string): Promise<void> {
    await this.userModel.updateMany(
      { _id: { $in: userIds } },
      { $addToSet: { assigned_todos: todoId } }
    ).exec();
  }
  
  async removeTodoFromUsers(userIds: string[], todoId: string): Promise<void> {
    await this.userModel.updateMany(
      { _id: { $in: userIds } },
      { $pull: { assigned_todos: todoId } }
    ).exec();
  }
}
