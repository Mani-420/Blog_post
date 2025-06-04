import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import {
  createBlogSuccess,
  setCreatingBlog,
  setBlogError
} from '../redux/blogSlice';
import { blogService } from '../services/blogService';

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const { isCreating, error } = useSelector((state) => state.blogs);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    image: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

    if (!formData.content.trim() || formData.content === '<p></p>') {
      dispatch(setBlogError('Content is required'));
      return;
    }

    dispatch(setCreatingBlog(true));
    dispatch(setBlogError(null));

    try {
      // Prepare data for backend

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('tags', formData.tags.trim());
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await blogService.createBlog(formDataToSend);
      dispatch(createBlogSuccess(response.data.blog));

      toast.success('Blog created successfully');
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        tags: '',
        image: null
      });
      navigate('/dashboard');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create blog';
      dispatch(setBlogError(errorMessage));
      toast.error('Failed to Create Blog. Please Try Again', errorMessage);
    } finally {
      dispatch(setCreatingBlog(false));
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        'Are you sure you want to cancel? All changes will be lost.'
      )
    ) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Blog
          </h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
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

          {/* AI Content Generation Button */}

          {/* Image Upload */}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>
            <label
              htmlFor="image-upload"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
            >
              {formData.image ? 'Change Image' : 'Upload Image'}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData((prev) => ({
                  ...prev,
                  image: file
                }));
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {formData.image && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formData.image.name}
              </div>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 rounded border border-gray-200 object-cover"
                />
              </div>
            )}
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
              disabled={isCreating}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isCreating ? (
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
                  Creating Blog...
                </span>
              ) : (
                '📝 Create Blog'
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isCreating}
              className="flex-1 sm:flex-none bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Preview Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>💡 Tip:</strong> You can use the rich text editor to
              format your content with headers, bold text, lists, links, and
              more. Your blog will be saved exactly as you see it here.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
