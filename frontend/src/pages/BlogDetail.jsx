import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/common/Spinner';
import {
  setCurrentBlog,
  setBlogsLoading,
  setBlogError,
  clearCurrentBlog
} from '../redux/blogSlice';
import { blogService } from '../services/blogService';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBlog, isLoading, error } = useSelector((state) => state.blogs);
  const { userData, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      fetchBlogDetail(id);
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [id]);

  const fetchBlogDetail = async (blogId) => {
    dispatch(setBlogsLoading(true));
    try {
      const response = await blogService.getBlogById(blogId);
      dispatch(setCurrentBlog(response.data.blog));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Blog not found';
      dispatch(setBlogError(errorMessage));
    }
  };

  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        toast.success('Blog deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete blog. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
        <div className="text-gray-600 mt-4">Loading blog details...</div>
      </div>
    );
  }

  if (error || !currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error ? `Error: ${error}` : 'Blog not found'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && userData?._id === currentBlog.owner._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentBlog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">By:</span>
              <span className="text-blue-600">
                {currentBlog.owner.fullName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Published:</span>
              <span>{formatDate(currentBlog.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Views:</span>
              <span>{currentBlog.views || 0}</span>
            </div>
          </div>

          {/* Description */}
          {currentBlog.description && (
            <div className="text-lg text-gray-700 mb-6 italic">
              {currentBlog.description}
            </div>
          )}

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-4 mb-6">
            {currentBlog.category && (
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  📂 {currentBlog.category}
                </span>
              </div>
            )}

            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons (if owner) */}
          {isOwner && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                ✏️ Edit Blog
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Delete Blog
              </button>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            {currentBlog.content ? (
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: currentBlog.content.replace(/\n/g, '<br>')
                }}
              />
            ) : (
              <p className="text-gray-500 italic">
                No content available for this blog.
              </p>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Go Back
          </button>
        </div>

        {/* Comments Section (Placeholder) */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold mb-4">Comments</h3>
          <div className="text-gray-500 text-center py-8">
            Comments feature coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
