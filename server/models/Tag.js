// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tag must have a name'],
    trim: true,
    unique: true
  },
  color: {
    type: String,
    default: '#e0e0e0'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;