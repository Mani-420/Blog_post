import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          {blog.category && (
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
          )}
          <span className="text-sm text-gray-500">
            {formatDate(blog.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/view-blog/${blog._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {blog.title}
          </Link>
        </h3>

        {/* Description/Content Preview */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.description || truncateContent(blog.content)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              {blog.author?.fullName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.author?.fullName || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500">{blog.views || 0} views</p>
            </div>
          </div>

          <Link
            to={`/view-blog/${blog._id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
