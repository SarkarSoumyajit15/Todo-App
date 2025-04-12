

import express from 'express';
import { addNote, createTodo, deleteTodo, getAllTodos, getTodo, updateTodo } from '../controllers/todoController.js';
import { protect } from '../controllers/authController.js';



const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .get(getAllTodos)
  .post(createTodo);

router
  .route('/:id')
  .get(getTodo)
  .patch(updateTodo)
  .delete(deleteTodo);

router
  .route('/:id/notes')
  .post(addNote);

export default router;