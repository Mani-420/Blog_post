import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Review from '../components/Reviews/Review';
import {
  setCurrentBlog,
  setBlogsLoading,
  setBlogError,
  clearCurrentBlog
} from '../redux/blogSlice';
import { blogService } from '../services/blogService';

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBlog, isLoading, error } = useSelector((state) => state.blogs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      fetchBlogDetail(id);
    }
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [id]);

  const fetchBlogDetail = async (blogId) => {
    dispatch(setBlogsLoading(true));
    try {
      const response = await blogService.getBlogById(blogId);
      dispatch(setCurrentBlog(response.data.data?.blog));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Blog not found';
      dispatch(setBlogError(errorMessage));
    }
  };

  const handleEdit = () => {
    navigate(`/blogs/edit-blog/${id}`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this blog? This action cannot be undone.'
      )
    ) {
      try {
        await blogService.deleteBlog(id);
        toast.success('Blog deleted successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete blog. Please try again.', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Go Home
            </button>
            <button
              onClick={() => fetchBlogDetail(id)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blog not found
  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog not found
          </h2>
          <p className="text-gray-600 mb-6">
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 inline-block"
          >
            Browse All Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?._id === currentBlog.author?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Blog Header */}
        <header className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {currentBlog.title}
          </h1>
          {/* Image */}
          {currentBlog.image && (
            <div className="mb-6">
              <img
                src={`http://localhost:8080${currentBlog.image}`}
                alt={currentBlog.title}
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </div>
          )}

          <div className="mb-6 flex justify-center">
            <Link
              to={`/donate/${currentBlog._id}`}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200 border border-yellow-300 justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              Support Author
            </Link>
          </div>

          {/* Author & Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {currentBlog.author?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {currentBlog.author?.username ||
                    currentBlog.author?.fullName ||
                    'Unknown'}
                </p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>

            <div className="flex items-center">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <div>
                <p className="text-sm font-medium">
                  {formatDate(currentBlog.createdAt)}
                </p>
                <p className="text-xs">
                  at {formatTime(currentBlog.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <span>{currentBlog.views || 0} views</span>
            </div>

            {currentBlog.updatedAt !== currentBlog.createdAt && (
              <div className="flex items-center text-orange-600">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                <span className="text-sm">
                  Updated {formatDate(currentBlog.updatedAt)}
                </span>
              </div>
            )}
          </div>
          {/* Description */}
          {currentBlog.description && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-lg text-gray-700 italic">
                {currentBlog.description}
              </p>
            </div>
          )}
          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-4 mb-6">
            {currentBlog.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  ></path>
                </svg>
                {currentBlog.category}
              </span>
            )}

            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Action Buttons (if owner) */}
          {isOwner && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Edit Blog
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Delete Blog
              </button>
            </div>
          )}
        </header>

        {/* Blog Content */}
        <main className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {currentBlog.content ? (
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: currentBlog.content.replace(/\n/g, '<br>')
                }}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg">No content available for this blog.</p>
              </div>
            )}
          </div>
        </main>

        {/* Comments and Reviews */}
        <Review blogId={id} />

        {/* Related Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center justify-center bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition-colors"
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5v6m8-6v6m-8-6V3a2 2 0 012-2h4a2 2 0 012 2v2"
                ></path>
              </svg>
              Browse More Blogs
            </Link>

            {isAuthenticated ? (
              <Link
                to="/blogs/create-blog"
                className="flex items-center justify-center bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors"
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
                Create Your Blog
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors"
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                Login to Write
              </Link>
            )}

            <Link
              to="/dashboard"
              className="flex items-center justify-center bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition-colors"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              My Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
