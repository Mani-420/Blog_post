import { Router } from 'express';
import {
  createOrUpdateReview,
  getReviewsByBlog,
  getUserReview,
  deleteReview
} from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/blog/:blogId').get(getReviewsByBlog);

router.route('/').post(verifyJWT, createOrUpdateReview); // Protected route
router.route('/user/:blogId').get(verifyJWT, getUserReview); // Protected route
router.route('/:id').delete(verifyJWT, deleteReview); // Protected route

export default router;
