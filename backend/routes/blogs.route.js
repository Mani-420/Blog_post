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
router.route('/user').get(verifyJWT, getUserBlogs); // Protected route
router.route('/create-blog').post(verifyJWT, createBlog); // Protected route
router.route('/author/:authorId').get(getBlogsByAuthor);

router.route('/:id').get(getBlog);
router.route('/edit-blog/:id').put(verifyJWT, updateBlog); // Protected route
router.route('/:id').delete(verifyJWT, deleteBlog); // Protected route

export default router;
