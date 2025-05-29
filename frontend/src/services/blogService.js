import api from './api';

export const blogService = {
  // Get all blogs with pagination and filters
  getAllBlogs: (params = {}) => api.get('/blogs', { params }),

  // Get single blog
  getBlogById: (id) => api.get(`/blogs/${id}`),

  // User's blogs
  getUserBlogs: () => api.get('/blogs/user'),

  // CRUD operations
  createBlog: (blogData) => api.post('/blogs/create-blog', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),

  // Increment views
  incrementViews: (id) => api.patch(`/blogs/${id}/views`)
};
