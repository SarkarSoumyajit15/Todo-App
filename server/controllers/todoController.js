// const Todo = require('../models/Todo');
// const User = require('../models/User');
// const Tag = require('../models/Tag');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

import Todo from '../models/Todo.js';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';


// Get all todos for the current user (created by them or where they're mentioned)
const getAllTodos = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({
    $or: [
      { createdBy: req.user._id },
      { mentions: req.user._id }
    ]
  })
  .populate('createdBy', 'name username avatar')
  .populate('mentions', 'name username avatar')
  .populate('tags', 'name color textColor');
  
  res.status(200).json({
    status: 'success',
    results: todos.length,
    data: {
      todos
    }
  });
});

// Get a single todo
const getTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id)
    .populate('createdBy', 'name username avatar')
    .populate('mentions', 'name username avatar')
    .populate('tags', 'name color textColor')
    .populate('notes.createdBy', 'name username avatar');
  
  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }
  
  // Check if user has access to this todo
  if (!todo.createdBy._id.equals(req.user._id) && 
      !todo.mentions.some(user => user._id.equals(req.user._id))) {
    return next(new AppError('You do not have permission to access this todo', 403));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      todo
    }
  });
});

// Create a new todo
const createTodo = catchAsync(async (req, res, next) => {
  // Add current user as creator
  req.body.createdBy = req.user._id;
  
  // Process mentions if any
  if (req.body.mentions && req.body.mentions.length > 0) {
    // Find users by usernames or IDs
    const mentionedUsers = await User.find({
      $or: [
        { _id: { $in: req.body.mentions } },
        { username: { $in: req.body.mentions.map(m => m.replace('@', '')) } }
      ]
    });
    
    req.body.mentions = mentionedUsers.map(user => user._id);
    
    // Update assigned_todos for mentioned users
    await User.updateMany(
      { _id: { $in: req.body.mentions } },
      { $addToSet: { assigned_todos: req.body._id } }
    );
  }
  
  const newTodo = await Todo.create(req.body);
  
  // Populate the new todo with related data
  const todo = await Todo.findById(newTodo._id)
    .populate('createdBy', 'name username avatar')
    .populate('mentions', 'name username avatar')
    .populate('tags', 'name color textColor');
  
  res.status(201).json({
    status: 'success',
    data: {
      todo
    }
  });
});

// Update a todo
const updateTodo = catchAsync(async (req, res, next) => {
  // Find the todo first to check permissions
  const todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }
  
  // Only the creator can update the todo
  if (!todo.createdBy.equals(req.user._id)) {
    return next(new AppError('You do not have permission to update this todo', 403));
  }
  
  // Process mentions if any
  if (req.body.mentions && req.body.mentions.length > 0) {
    // Find users by usernames or IDs
    const mentionedUsers = await User.find({
      $or: [
        { _id: { $in: req.body.mentions } },
        { username: { $in: req.body.mentions.map(m => m.replace('@', '')) } }
      ]
    });
    
    req.body.mentions = mentionedUsers.map(user => user._id);
    
    // Update assigned_todos for mentioned users
    await User.updateMany(
      { _id: { $in: req.body.mentions } },
      { $addToSet: { assigned_todos: req.params.id } }
    );
    
    // Remove from assigned_todos for users no longer mentioned
    const removedUsers = todo.mentions.filter(
      id => !req.body.mentions.includes(id.toString())
    );
    
    if (removedUsers.length > 0) {
      await User.updateMany(
        { _id: { $in: removedUsers } },
        { $pull: { assigned_todos: req.params.id } }
      );
    }
  }
  
  // Update the todo
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  .populate('createdBy', 'name username avatar')
  .populate('mentions', 'name username avatar')
  .populate('tags', 'name color textColor');
  
  res.status(200).json({
    status: 'success',
    data: {
      todo: updatedTodo
    }
  });
});

// Delete a todo
const deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }
  
  // Only the creator can delete the todo
  if (!todo.createdBy.equals(req.user._id)) {
    return next(new AppError('You do not have permission to delete this todo', 403));
  }
  
  // Remove from assigned_todos for all mentioned users
  if (todo.mentions && todo.mentions.length > 0) {
    await User.updateMany(
      { _id: { $in: todo.mentions } },
      { $pull: { assigned_todos: req.params.id } }
    );
  }
  
  await Todo.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Add a note to a todo
const addNote = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return next(new AppError('No todo found with that ID', 404));
  }
  
  // Check if user has access to this todo
  if (!todo.createdBy.equals(req.user._id) && 
      !todo.mentions.some(userId => userId.equals(req.user._id))) {
    return next(new AppError('You do not have permission to add notes to this todo', 403));
  }
  
  const note = {
    content: req.body.content,
    createdBy: req.user._id,
    date: new Date()
  };
  
  todo.notes.push(note);
  await todo.save();
  
  const updatedTodo = await Todo.findById(req.params.id)
    .populate('createdBy', 'name username avatar')
    .populate('mentions', 'name username avatar')
    .populate('tags', 'name color textColor')
    .populate('notes.createdBy', 'name username avatar');
  
  res.status(200).json({
    status: 'success',
    data: {
      todo: updatedTodo
    }
  });
});

export {
    getAllTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    addNote
}