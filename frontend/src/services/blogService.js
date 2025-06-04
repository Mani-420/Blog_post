import api from './api';

export const blogService = {
  // Get all blogs with pagination and filters
  getAllBlogs: (params = {}) => api.get('/blogs', { params }),

  // Get single blog
  getBlogById: (id) => api.get(`/blogs/${id}`),

  // User's blogs
  getUserBlogs: () => api.get('/blogs/user'),

  // CRUD operations
  createBlog: (blogData) =>
    api.post('/blogs/create-blog', blogData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  updateBlog: (id, blogData) =>
    api.put(`/blogs/edit-blog/${id}`, blogData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  deleteBlog: (id) => api.delete(`/blogs/${id}`)
};
