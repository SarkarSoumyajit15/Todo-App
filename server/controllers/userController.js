import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';


// Get all users
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Get current user
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
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
    });
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Get user by ID
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-__v')
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
    });
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export { getAllUsers, getMe, getUser };