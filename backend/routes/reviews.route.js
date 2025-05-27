import { Router } from 'express';
import {
  createOrUpdateReview,
  getReviewsByBlog,
  getUserReview,
  deleteReview
} from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/blog/:blogId').get(getReviewsByBlog);

// Protected routes
router.route('/').post(verifyJWT, createOrUpdateReview);
router.route('/user/:blogId').get(verifyJWT, getUserReview);
router.route('/:id').delete(verifyJWT, deleteReview);

export default router;