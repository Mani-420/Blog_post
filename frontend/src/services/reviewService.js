import api from './api';

export const reviewService = {
  // Get all reviews for a blog post
  getReviews: (blogId) => api.get(`/blogs/${blogId}/reviews/`),

  // Create or update a review for a blog post
  addOrUpdateReview: (blogId, reviewData) =>
    api.post(`/blogs/${blogId}/reviews/`, reviewData),

  // Get the current user's review for a blog post
  getUserReview: (blogId) => api.get(`/blogs/${blogId}/reviews/user`),

  // Delete a review by its ID
  deleteReview: (blogId, reviewId) =>
    api.delete(`/blogs/${blogId}/reviews/${reviewId}`)
};
