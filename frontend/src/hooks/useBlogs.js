import { useSelector, useDispatch } from 'react-redux';
import {
  // Loading actions
  setBlogsLoading,

  // Success actions
  setBlogsSuccess,
  setUserBlogsSuccess,
  setCurrentBlog,
  createBlogSuccess,
  updateBlogSuccess,
  deleteBlogSuccess,

  // UI actions
  clearCurrentBlog,
  incrementViews,
  setSearchQuery,
  setSelectedCategory,
  setSelectedTag,
  clearFilters,
  setCurrentPage,

  // Error actions
  setBlogError,
  clearBlogError,

  // Loading states
  setCreatingBlog,
  setUpdatingBlog,
  setDeletingBlog
} from '../redux/blogSlice';

import { blogService } from '../services/blogService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useBlogs = () => {
  // 📊 Get all blog state from Redux
  const blogState = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Destructure for easier access
  const {
    blogs,
    userBlogs,
    currentBlog,
    pagination,
    searchQuery,
    selectedCategory,
    selectedTag,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error
  } = blogState;

  // 🔍 FETCH ALL BLOGS (Home page, search results)
  const fetchBlogs = async (params = {}) => {
    dispatch(setBlogsLoading(true));
    dispatch(clearBlogError());

    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        category: selectedCategory,
        tag: selectedTag,
        ...params // Override with custom params
      };

      const response = await blogService.getAllBlogs(queryParams);
      dispatch(setBlogsSuccess(response.data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch blogs';
      dispatch(setBlogError(errorMessage));
      toast.error(errorMessage);
    }
  };

  // 👤 FETCH USER'S BLOGS (Dashboard)
  const fetchUserBlogs = async () => {
    dispatch(setBlogsLoading(true));
    dispatch(clearBlogError());

    try {
      const response = await blogService.getUserBlogs();
      dispatch(setUserBlogsSuccess(response.data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch your blogs';
      dispatch(setBlogError(errorMessage));
      toast.error(errorMessage);
    }
  };

  // 📖 FETCH SINGLE BLOG (Blog detail page)
  const fetchBlogById = async (id) => {
    dispatch(setBlogsLoading(true));
    dispatch(clearBlogError());

    try {
      const response = await blogService.getBlogById(id);
      dispatch(setCurrentBlog(response.data.blog));

      // Increment view count
      await blogService.incrementViews(id);
      dispatch(incrementViews());
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Blog not found';
      dispatch(setBlogError(errorMessage));
      toast.error(errorMessage);
    }
  };

  // ✏️ CREATE NEW BLOG
  const createBlog = async (blogData) => {
    dispatch(setCreatingBlog(true));
    dispatch(clearBlogError());

    try {
      const response = await blogService.createBlog(blogData);
      dispatch(createBlogSuccess(response.data.blog));
      toast.success('Blog created successfully!');
      navigate('/dashboard'); // Redirect to dashboard
      return response.data.blog;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create blog';
      dispatch(setBlogError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setCreatingBlog(false));
    }
  };

  // 📝 UPDATE EXISTING BLOG
  const updateBlog = async (id, blogData) => {
    dispatch(setUpdatingBlog(true));
    dispatch(clearBlogError());

    try {
      const response = await blogService.updateBlog(id, blogData);
      dispatch(updateBlogSuccess(response.data.blog));
      toast.success('Blog updated successfully!');
      navigate(`/blog/${id}`); // Redirect to blog detail
      return response.data.blog;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update blog';
      dispatch(setBlogError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setUpdatingBlog(false));
    }
  };

  // 🗑️ DELETE BLOG
  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    dispatch(setDeletingBlog(true));
    dispatch(clearBlogError());

    try {
      await blogService.deleteBlog(id);
      dispatch(deleteBlogSuccess(id));
      toast.success('Blog deleted successfully!');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete blog';
      dispatch(setBlogError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setDeletingBlog(false));
    }
  };

  // 🔍 SEARCH & FILTER FUNCTIONS
  const searchBlogs = (query) => {
    dispatch(setSearchQuery(query));
    // Auto-fetch with new search
    fetchBlogs({ search: query, page: 1 });
  };

  const filterByCategory = (category) => {
    dispatch(setSelectedCategory(category));
    fetchBlogs({ category, page: 1 });
  };

  const filterByTag = (tag) => {
    dispatch(setSelectedTag(tag));
    fetchBlogs({ tag, page: 1 });
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    fetchBlogs({ page: 1 });
  };

  // 📄 PAGINATION
  const goToPage = (page) => {
    dispatch(setCurrentPage(page));
    fetchBlogs({ page });
  };

  // 🧹 UTILITY FUNCTIONS
  const clearCurrentBlogData = () => {
    dispatch(clearCurrentBlog());
  };

  const clearErrors = () => {
    dispatch(clearBlogError());
  };

  // 📤 RETURN ALL DATA AND FUNCTIONS
  return {
    // 📊 State data
    blogs,
    userBlogs,
    currentBlog,
    pagination,
    searchQuery,
    selectedCategory,
    selectedTag,

    // 🔄 Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,

    // 🔍 Fetch functions
    fetchBlogs,
    fetchUserBlogs,
    fetchBlogById,

    // ✏️ CRUD functions
    createBlog,
    updateBlog,
    deleteBlog,

    // 🔍 Search & Filter
    searchBlogs,
    filterByCategory,
    filterByTag,
    clearAllFilters,

    // 📄 Pagination
    goToPage,

    // 🧹 Utility
    clearCurrentBlogData,
    clearErrors
  };
};
