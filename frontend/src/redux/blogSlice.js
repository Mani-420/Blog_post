import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogs: [], // ✅ Initialize as empty array, not undefined
  currentBlog: null,
  userBlogs: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  searchQuery: '',
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setUserBlogs: (state, action) => {
      state.userBlogs = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure array
      state.isLoading = false;
      state.error = null;
    },

    // ===== BLOG LIST ACTIONS =====
    setBlogsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setBlogsSuccess: (state, action) => {
      state.blogs = action.payload.blogs;
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.error = null;
    },

    setUserBlogsSuccess: (state, action) => {
      state.userBlogs = action.payload.blogs;
      state.isLoading = false;
      state.error = null;
    },

    // ===== SINGLE BLOG ACTIONS =====
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },

    // Increment views when user visits blog
    incrementViews: (state) => {
      if (state.currentBlog) {
        state.currentBlog.views += 1;
      }
    },

    // ===== CREATE BLOG ACTIONS =====
    setCreatingBlog: (state, action) => {
      state.isCreating = action.payload;
    },

    createBlogSuccess: (state, action) => {
      state.userBlogs.unshift(action.payload); // Add to beginning
      state.isCreating = false;
      state.error = null;
    },

    // ===== UPDATE BLOG ACTIONS =====
    setUpdatingBlog: (state, action) => {
      state.isUpdating = action.payload;
    },

    updateBlogSuccess: (state, action) => {
      const updatedBlog = action.payload;

      // Update in userBlogs
      const userBlogIndex = state.userBlogs.findIndex(
        (blog) => blog._id === updatedBlog._id
      );
      if (userBlogIndex !== -1) {
        state.userBlogs[userBlogIndex] = updatedBlog;
      }

      // Update in general blogs list
      const blogIndex = state.blogs.findIndex(
        (blog) => blog._id === updatedBlog._id
      );
      if (blogIndex !== -1) {
        state.blogs[blogIndex] = updatedBlog;
      }

      // Update current blog if it's the same
      if (state.currentBlog && state.currentBlog._id === updatedBlog._id) {
        state.currentBlog = updatedBlog;
      }

      state.isUpdating = false;
      state.error = null;
    },

    // ===== DELETE BLOG ACTIONS =====
    setDeletingBlog: (state, action) => {
      state.isDeleting = action.payload;
    },

    deleteBlogSuccess: (state, action) => {
      const blogId = action.payload;

      // Remove from userBlogs
      state.userBlogs = state.userBlogs.filter((blog) => blog._id !== blogId);

      // Remove from general blogs
      state.blogs = state.blogs.filter((blog) => blog._id !== blogId);

      // Clear current blog if it's the deleted one
      if (state.currentBlog && state.currentBlog._id === blogId) {
        state.currentBlog = null;
      }

      state.isDeleting = false;
      state.error = null;
    },

    // ===== SEARCH & FILTER ACTIONS =====
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1; // Reset to first page
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.pagination.page = 1;
    },

    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload;
      state.pagination.page = 1;
    },

    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.selectedTag = '';
      state.pagination.page = 1;
    },

    // ===== PAGINATION ACTIONS =====
    setCurrentPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    // ===== ERROR HANDLING =====
    setBlogError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
    },

    clearBlogError: (state) => {
      state.error = null;
    }
  }
});

export const {
  // Loading
  setBlogsLoading,

  // Blog lists
  setBlogsSuccess,
  setUserBlogsSuccess,

  // Single blog
  setCurrentBlog,
  clearCurrentBlog,
  incrementViews,

  // Create
  setCreatingBlog,
  createBlogSuccess,

  // Update
  setUpdatingBlog,
  updateBlogSuccess,

  // Delete
  setDeletingBlog,
  deleteBlogSuccess,

  // Search & Filter
  setSearchQuery,
  setSelectedCategory,
  setSelectedTag,
  clearFilters,

  // Pagination
  setCurrentPage,

  // Error handling
  setBlogError,
  clearBlogError,

  setUserBlogs
} = blogSlice.actions;

export default blogSlice.reducer;
