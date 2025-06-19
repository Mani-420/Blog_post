import { Router } from 'express';

import {
  createDonationSession,
  handleStripeWebhook,
  getDonationsByAuthor,
  getDonationsByBlog,
  getUserDonations
} from '../controllers/donate.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Create Stripe donation session
router.route('/').post(verifyJWT, createDonationSession);

// Stripe webhook (use express.raw middleware in server.js for this route)
router.route('/webhook').post(handleStripeWebhook);

// Get all donations for an author
router.route('/author/:authorId').get(verifyJWT, getDonationsByAuthor);

// Get all donations for a blog
router.route('/blog/:blogId').get(verifyJWT, getDonationsByBlog);

// Get all donations by a donor
router.route('/donor/:donorId').get(verifyJWT, getUserDonations);

export default router;
