import { Router } from 'express';
import {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/blog/:blogId').get(getCommentsByBlog);

// Protected routes
router.route('/').post(verifyJWT, createComment); // Protected route
router.route('/:id').put(verifyJWT, updateComment); // Protected route
router.route('/:id').delete(verifyJWT, deleteComment); // Protected route

export default router;
