import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor
} from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/').get(getAllBlogs);
router.route('/:id').get(getBlog);
router.route('/author/:authorId').get(getBlogsByAuthor);

// Protected routes
router.route('/').post(verifyJWT, createBlog);
router.route('/:id').put(verifyJWT, updateBlog);
router.route('/:id').delete(verifyJWT, deleteBlog);

export default router;