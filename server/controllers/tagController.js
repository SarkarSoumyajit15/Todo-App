// const Tag = require('../models/Tag');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

import Tag from '../models/Tag.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';


// Get all tags
const getAllTags = catchAsync(async (req, res, next) => {
  const tags = await Tag.find();
  
  res.status(200).json({
    status: 'success',
    results: tags.length,
    data: {
      tags
    }
  });
});

// Create a new tag
const createTag = catchAsync(async (req, res, next) => {
  // Add current user as creator
  req.body.createdBy = req.user._id;
  
  const newTag = await Tag.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      tag: newTag
    }
  });
});

// Update a tag
const updateTag = catchAsync(async (req, res, next) => {
  const tag = await Tag.findById(req.params.id);
  
  if (!tag) {
    return next(new AppError('No tag found with that ID', 404));
  }
  
  // Only the creator can update the tag
  if (tag.createdBy && !tag.createdBy.equals(req.user._id)) {
    return next(new AppError('You do not have permission to update this tag', 403));
  }
  
  const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      tag: updatedTag
    }
  });
});

// Delete a tag
const deleteTag = catchAsync(async (req, res, next) => {
  const tag = await Tag.findById(req.params.id);
  
  if (!tag) {
    return next(new AppError('No tag found with that ID', 404));
  }
  
  // Only the creator can delete the tag
  if (tag.createdBy && !tag.createdBy.equals(req.user._id)) {
    return next(new AppError('You do not have permission to delete this tag', 403));
  }
  
  await Tag.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export{
    getAllTags,
    createTag,
    updateTag,
    deleteTag
}