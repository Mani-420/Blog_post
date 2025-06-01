import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-500 mb-4 animate-bounce">
            404
          </div>
          <div className="text-6xl mb-6">📝🔍</div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Oops! The blog post or page you're looking for seems to have
            disappeared into the digital void.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you may have typed the wrong
            URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              🏠 Go to Home
            </Link>

            <button
              onClick={goBack}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              ← Go Back
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/blogs/create-blog"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              ✍️ Create a Blog
            </Link>

            <Link
              to="/dashboard"
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              📊 Dashboard
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Latest Blogs
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign Up
            </Link>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              My Dashboard
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-700 text-sm">
            <strong>💡 Pro tip:</strong> While you're here, why not check out
            our latest blog posts or create your own?
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
