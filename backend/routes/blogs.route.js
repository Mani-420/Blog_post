import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor,
  getUserBlogs
} from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').get(getAllBlogs);
router.route('/user').get(verifyJWT, getUserBlogs); // ✅ ADD THIS LINE
router.route('/:id').get(getBlog);
router.route('/author/:authorId').get(getBlogsByAuthor);

router.route('/create-blog').post(verifyJWT, createBlog);
router.route('/:id').put(verifyJWT, updateBlog);
router.route('/:id').delete(verifyJWT, deleteBlog);

export default router;
