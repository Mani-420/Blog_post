import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Review } from '../models/review.model.js';
import { Blogs } from '../models/blog.model.js';
import mongoose from 'mongoose';

// Create or update a review (Protected route)
const createOrUpdateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { blogId } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError('Rating must be between 1 and 5', 400);
  }

  // Check if blog exists
  const blog = await Blogs.findById(blogId);
  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  // Check if user already reviewed this blog
  const existingReview = await Review.findOne({
    author: req.user._id,
    blog: blogId
  });

  let review;

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment || existingReview.comment;
    review = await existingReview.save();

    await review.populate('author', '-password -refreshToken');

    return res
      .status(200)
      .json(new ApiResponse(200, { review }, 'Review updated successfully'));
  } else {
    // Create new review
    review = await Review.create({
      rating,
      comment: comment || '',
      author: req.user._id,
      blog: blogId
    });

    await review.populate('author', '-password -refreshToken');

    return res
      .status(201)
      .json(new ApiResponse(201, { review }, 'Review created successfully'));
  }
});

// Get all reviews for a blog
const getReviewsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Check if blog exists
  const blog = await Blogs.findById(blogId);
  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  const reviews = await Review.find({ blog: blogId })
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ blog: blogId });

  // Calculate average rating
  const avgRatingResult = await Review.aggregate([
    { $match: { blog: new mongoose.Types.ObjectId(blogId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  const averageRating =
    avgRatingResult.length > 0
      ? Math.round(avgRatingResult[0].avgRating * 10) / 10
      : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        averageRating,
        totalReviews: total,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      'Reviews fetched successfully'
    )
  );
});

// Get user's review for a specific blog
const getUserReview = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const review = await Review.findOne({
    author: req.user._id,
    blog: blogId
  }).populate('author', '-password -refreshToken');

  if (!review) {
    return res
      .status(200)
      .json(new ApiResponse(200, { review: null }, 'No review found'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { review }, 'User review fetched successfully'));
});

// Delete review (Protected route - only author can delete)
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId).populate(
    'author',
    '-password -refreshToken'
  );
  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Check if user owns the review
  if (review.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Unauthorized: You cannot delete this review', 403);
  }

  await Review.findByIdAndDelete(reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Review deleted successfully'));
});

export { createOrUpdateReview, getReviewsByBlog, getUserReview, deleteReview };
