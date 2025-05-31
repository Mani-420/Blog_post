import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import {
  setUserBlogs,
  setBlogsLoading,
  setBlogError
} from '../redux/blogSlice';
import LoadingSpinner from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    userBlogs = [],
    isLoading,
    error
  } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    dispatch(setBlogsLoading(true));
    try {
      const response = await blogService.getUserBlogs();

      const rawBlogs = response.data.data?.blogs || response.data.blogs || [];
      const validBlogs = rawBlogs.filter(
        (blog) => blog && blog._id && typeof blog === 'object'
      );

      dispatch(setUserBlogs(validBlogs));
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      dispatch(
        setBlogError(error.response?.data?.message || 'Failed to fetch blogs')
      );
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(blogId);
        // Refresh the list
        fetchUserBlogs();
        toast.success('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error(error.response?.data?.message || 'Failed to delete blog');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username || 'User'}!
              </h1>
              <p className="text-gray-600">
                Manage your blog posts and create new content
              </p>
            </div>
            <Link
              to="/create-blog"
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Create New Blog
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(userBlogs) ? userBlogs.length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(userBlogs)
                    ? userBlogs
                        .filter((blog) => blog && typeof blog === 'object') // ✅ Filter valid blogs
                        .reduce((total, blog) => total + (blog?.views || 0), 0)
                    : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Comments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(userBlogs)
                    ? userBlogs
                        .filter((blog) => blog && typeof blog === 'object')
                        .reduce(
                          (total, blog) => total + (blog?.commentsCount || 0),
                          0
                        )
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blogs Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Blog Posts</h2>
          </div>

          <div className="p-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" text="Loading your blogs..." />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorMessage message={error} onRetry={fetchUserBlogs} />
            )}

            {/* Blogs List */}
            {!isLoading && !error && (
              <>
                {/* ✅ Safe check for array and length */}
                {Array.isArray(userBlogs) && userBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {userBlogs
                      .filter((blog) => blog && blog._id) // ✅ Filter out undefined/null blogs
                      .map((blog) => (
                        <div
                          key={blog._id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {blog?.title || 'Untitled'}{' '}
                                {/* ✅ Add fallback */}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {blog?.content?.substring(0, 150) ||
                                  'No content'}
                                ... {/* ✅ Add fallback */}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    ></path>
                                  </svg>
                                  {blog?.views || 0} views
                                </span>
                                <span className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    ></path>
                                  </svg>
                                  {blog?.commentsCount || 0} comments
                                </span>
                                <span>
                                  Created:{' '}
                                  {blog?.createdAt
                                    ? new Date(
                                        blog.createdAt
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0 md:ml-6 flex space-x-3">
                              <Link
                                to={`/blogs/${blog._id}`}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                View
                              </Link>
                              <Link
                                to={`/blogs/edit-blog/${blog._id}`}
                                className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteBlog(blog._id)}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No blogs yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start sharing your thoughts with the world!
                    </p>
                    <Link
                      to="/create-blog"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Write Your First Blog
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
