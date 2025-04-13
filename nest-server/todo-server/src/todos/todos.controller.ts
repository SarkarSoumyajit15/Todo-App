import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('api/todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getAllTodos(
    @Request() req,
    @Query('userId') userId?: string,
    @Query('priority') priority?: string | string[],
    @Query('tags') tags?: string | string[],
    @Query('status') status?: string
  ) {
    const todos = await this.todosService.findAll(req.user, userId, priority, tags, status);
    return {
      status: 'success',
      results: todos.length,
      data: {
        todos
      }
    };
  }

  @Get(':id')
  async getTodo(@Param('id') id: string, @Request() req) {
    const todo = await this.todosService.findOne(id, req.user);
    return {
      status: 'success',
      data: {
        todo
      }
    };
  }

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    const todo = await this.todosService.create(createTodoDto, req.user);
    return {
      status: 'success',
      data: {
        todo
      }
    };
  }

  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req
  ) {
    const todo = await this.todosService.update(id, updateTodoDto, req.user);
    return {
      status: 'success',
      data: {
        todo
      }
    };
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @Request() req) {
    await this.todosService.remove(id, req.user);
    return {
      status: 'success',
      data: null
    };
  }

  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() addNoteDto: AddNoteDto,
    @Request() req
  ) {
    const todo = await this.todosService.addNote(id, addNoteDto, req.user);
    return {
      status: 'success',
      data: {
        todo
      }
    };
  }
}
