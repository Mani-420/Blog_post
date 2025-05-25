import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Blogs } from '../models/blog.model.js';

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, image, tags } = req.body;

  const blog = await Blogs.create({
    title,
    content,
    image: image || 'No image provided',
    author: req.user._id,
    tags: tags || []
  });

  if (!blog) {
    throw new ApiError('Something went wrong while creating blog !!!', 500);
  }

  await blog.populate('author', '-password -refreshToken');
  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: { blog }
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blogs.find({})
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new ApiError('No blogs found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Blogs fetched successfully',
    data: { blogs }
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blogs.findById(id)
    .populate('author', '-password -refreshToken')
    .populate('commentsCount')
    .populate('reviewsCount');

  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  // Increment views count
  blog.views += 1;
  await blog.save();

  res.status(200).json({
    success: true,
    message: 'Blog fetched successfully',
    data: { blog }
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, image, tags } = req.body;

  if (!title || !content) {
    throw new ApiError('Title and content are required', 400);
  }

  const blog = await Blogs.findByIdAndUpdate(id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  if (blog.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: You cannot edit this note'
    });
  }

  blog.title = title;
  blog.content = content;
  blog.image = image || blog.image; // Keep existing image if not provided
  blog.tags = tags || blog.tags; // Update tags if provided

  await blog.save();

  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: { blog }
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blogs.findByIdAndDelete(id);

  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: You cannot delete this blog'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully',
    data: {}
  });
});

const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const blogs = await Blogs.find({ author: authorId })
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new ApiError('No blogs found for this author', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Blogs by author fetched successfully',
    data: { blogs }
  });
});

export {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor
};
