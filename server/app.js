// const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
// const AppError = require('./utils/appError');

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import AppError from './utils/appError.js';


import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;