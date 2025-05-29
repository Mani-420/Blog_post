import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react'; // ✅ Move this to the top
import {
  setCurrentBlog,
  updateBlogSuccess,
  setUpdatingBlog,
  setBlogError,
  setBlogsLoading,
  clearCurrentBlog
} from '../redux/blogSlice';
import { blogService } from '../services/blogService';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBlog, isUpdating, isLoading, error } = useSelector(
    (state) => state.blogs
  );
  const { isAuthenticated, userData } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: ''
  });

  const [isFormReady, setIsFormReady] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch blog data when component mounts
  useEffect(() => {
    if (id) {
      fetchBlogData(id);
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [id]);

  // Pre-fill form when blog data is loaded
  useEffect(() => {
    if (currentBlog) {
      // Check if user owns this blog
      if (currentBlog.owner._id !== userData?._id) {
        alert('You can only edit your own blogs!');
        navigate('/dashboard');
        return;
      }

      // Pre-fill form with existing data
      setFormData({
        title: currentBlog.title || '',
        description: currentBlog.description || '',
        content: currentBlog.content || '',
        category: currentBlog.category || '',
        tags: currentBlog.tags ? currentBlog.tags.join(', ') : ''
      });
      setIsFormReady(true);
    }
  }, [currentBlog, userData, navigate]);

  const fetchBlogData = async (blogId) => {
    dispatch(setBlogsLoading(true));
    try {
      const response = await blogService.getBlogById(blogId);
      dispatch(setCurrentBlog(response.data.blog));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Blog not found';
      dispatch(setBlogError(errorMessage));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      dispatch(setBlogError('Title is required'));
      return;
    }

    // ✅ Fixed validation for TinyMCE
    if (!formData.content.trim() || formData.content === '<p></p>') {
      dispatch(setBlogError('Content is required'));
      return;
    }

    dispatch(setUpdatingBlog(true));
    dispatch(setBlogError(null));

    try {
      // Prepare data for backend
      const blogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content,
        category: formData.category.trim() || undefined,
        tags: formData.tags.trim()
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : undefined
      };

      const response = await blogService.updateBlog(id, blogData);
      dispatch(updateBlogSuccess(response.data.blog));

      // Show success message
      alert('Blog updated successfully!');

      // Redirect to blog detail page
      navigate(`/view-blog/${id}`); // ✅ Fixed route
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update blog';
      dispatch(setBlogError(errorMessage));
    } finally {
      dispatch(setUpdatingBlog(false));
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        'Are you sure you want to cancel? All changes will be lost.'
      )
    ) {
      navigate(`/view-blog/${id}`); // ✅ Fixed route
    }
  };

  // Loading state
  if (isLoading || !isFormReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading blog data...</div>
      </div>
    );
  }

  // Error state
  if (error && !currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog</h1>
          <p className="text-gray-600">Update your blog post</p>
          {currentBlog && (
            <p className="text-sm text-gray-500 mt-2">
              Originally created on{' '}
              {new Date(currentBlog.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your blog title..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your blog..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Technology, Travel, Food..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Separate tags with commas: react, javascript, web..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>
          </div>

          {/* Content - TinyMCE Editor */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={formData.content}
                onEditorChange={handleContentChange}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount'
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  placeholder: 'Write your amazing blog content here...',
                  branding: false,
                  promotion: false
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use the toolbar above to format your content with headers, bold
              text, lists, links, and more.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-12">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating Blog...
                </span>
              ) : (
                '✏️ Update Blog'
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1 sm:flex-none bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Update Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>📝 Note:</strong> Your changes will be saved and the "last
              updated" time will be updated. The original creation date will
              remain unchanged.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
