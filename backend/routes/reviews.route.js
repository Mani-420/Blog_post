import { Router } from 'express';
import {
  createOrUpdateReview,
  getReviewsByBlog,
  getUserReview,
  deleteReview
} from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

router.route('/').get(getReviewsByBlog);

router.route('/').post(verifyJWT, createOrUpdateReview); // Protected route
router.route('/user').get(verifyJWT, getUserReview); // Protected route
router.route('/:reviewId').delete(verifyJWT, deleteReview); // Protected route

export default router;
