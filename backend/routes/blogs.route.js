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
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/').get(getAllBlogs);
router.route('/user').get(verifyJWT, getUserBlogs); // Protected route
router.post(
  '/create-blog',
  verifyJWT, // authentication middleware
  upload.single('image'), // multer middleware for image upload
  createBlog // controller
);
router.route('/author/:authorId').get(getBlogsByAuthor);

router.route('/:id').get(getBlog);
router.route('/edit-blog/:id').put(verifyJWT, updateBlog); // Protected route
router.route('/:id').delete(verifyJWT, deleteBlog); // Protected route

export default router;
