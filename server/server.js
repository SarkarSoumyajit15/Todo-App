// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const connectDB = require('./utils/DB.js');

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './utils/DB.js';
import app from './app.js';



// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
// const app = require('./app');

// Connect to MongoDB

connectDB();
// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});