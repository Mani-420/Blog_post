import BlogCard from './BlogCard';

const BlogList = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
        <p className="text-gray-600">Be the first to share your story!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
