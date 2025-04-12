// const express = require('express');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');

import express from 'express';
import { protect } from '../controllers/authController.js';
import { getAllUsers, getMe, getUser } from '../controllers/userController.js';


const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);
router.get('/', getAllUsers);
router.get('/:id', getUser);

export default router;