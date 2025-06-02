import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { shuffleArray } from '../utils/helpers.js';
import {
  setBlogsLoading,
  setBlogsSuccess,
  setBlogError
} from '../redux/blogSlice';
import { blogService } from '../services/blogService';
import BlogList from '../components/blog/BlogList';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Home = () => {
  const { blogs = [], isLoading, error } = useSelector((state) => state.blogs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (search = '') => {
    dispatch(setBlogsLoading(true));
    try {
      const params = {
        limit: 12,
        ...(search && { search })
      };

      const response = await blogService.getAllBlogs(params);
      dispatch(
        setBlogsSuccess({
          blogs: response.data.data?.blogs || [],
          pagination: response.data.data?.pagination || {}
        })
      );
    } catch (error) {
      dispatch(
        setBlogError(error.response?.data?.message || 'Failed to fetch blogs')
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to BlogSpace</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing stories, share your thoughts, and connect with
            writers from around the world.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-amber-50 max-w-md mx-auto mb-8 rounded-lg"
          >
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 px-6 py-3 rounded-r-lg transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Call to Action */}
          {isAuthenticated ? (
            <Link
              to="/blogs/create-blog"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              📝 Write Your Story
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of insightful articles, tutorials, and
              stories from our community of writers.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && <Loader size="lg" text="Loading amazing blogs..." />}

          {/* Error State */}
          {error && !isLoading && (
            <ErrorMessage
              message={error}
              onRetry={() => fetchBlogs(searchQuery)}
            />
          )}

          {/* Blogs List */}
          {!isLoading && !error && (
            <>
              {Array.isArray(blogs) && blogs.length > 0 ? (
                (() => {
                  const recentCount = 2;
                  const recentBlogs = blogs.slice(0, recentCount);
                  const otherBlogs = shuffleArray(blogs.slice(recentCount));
                  const mixedBlogs = [...recentBlogs, ...otherBlogs];
                  return <BlogList blogs={mixedBlogs} />;
                })()
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {searchQuery ? 'No blogs found' : 'No blogs yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? `No blogs match "${searchQuery}". Try a different search term.`
                      : 'Be the first to share your story!'}
                  </p>
                  {!searchQuery && !isAuthenticated && (
                    <Link
                      to="/register"
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Join Our Community
                    </Link>
                  )}
                  {!searchQuery && isAuthenticated && (
                    <Link
                      to="/create-blog"
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Write Your First Blog
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BlogSpace?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-bold mb-2">Easy Writing</h3>
              <p className="text-gray-600">
                Rich text editor makes writing and formatting your blogs
                effortless.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Global Community</h3>
              <p className="text-gray-600">
                Connect with readers and writers from around the world.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                Your blogs look great on desktop, tablet, and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
