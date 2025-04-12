
import express from 'express';
import { createTag, deleteTag, getAllTags, updateTag } from '../controllers/tagController.js';

import { protect } from '../controllers/authController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .get(getAllTags)
  .post(createTag);

router
  .route('/:id')
  .patch(updateTag)
  .delete(deleteTag);

  export default router;