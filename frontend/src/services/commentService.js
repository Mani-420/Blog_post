import api from './api';

export const commentService = {
  // Get comments for a blog post
  getComments: (blogId) => api.get(`/comments/blog/${blogId}`),

  // Add a new comment to a blog post
  addComment: (blogId, commentData) => api.post(`/comments/`, commentData),

  // Update an existing comment
  updateComment: (commentId, commentData) =>
    api.put(`/comments/${commentId}`, commentData),

  // Delete a comment
  deleteComment: (blogId, commentId) => api.delete(`/comments/${commentId}`)
};
