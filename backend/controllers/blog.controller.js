import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Blogs } from '../models/blog.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Review } from '../models/review.model.js';

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, image, tags, category, description } = req.body;

  if (!title || !content) {
    throw new ApiError('Title and content are required', 400);
  }

  const blog = await Blogs.create({
    title,
    content,
    image: image || 'No image provided',
    author: req.user._id,
    tags: tags || [],
    category: category || 'General',
    description: description || 'No description provided',
    views: 0,
    commentsCount: 0,
    reviewsCount: 0
  });

  if (!blog) {
    throw new ApiError('Something went wrong while creating blog !!!', 500);
  }

  const populatedBlog = await blog.populate(
    'author',
    '-password -refreshToken'
  );
  return res
    .status(201)
    .json(
      new ApiResponse(201, { blog: populatedBlog }, 'Blog created successfully')
    );
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search;

  let query = {};

  // If searching, fetch all blogs and filter by author username/fullName
  let blogs = await Blogs.find(query)
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 });

  if (search) {
    blogs = blogs.filter(
      (blog) =>
        blog.author?.username?.toLowerCase().includes(search.toLowerCase()) ||
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination after filtering
  const total = blogs.length;
  blogs = blogs.slice(skip, skip + limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      'Blogs fetched successfully'
    )
  );
});

const getUserBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await Blogs.find({ author: req.user._id })
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const blogsWithCounts = await Promise.all(
    blogs.map(async (blog) => {
      const reviewsCount = await Review.countDocuments({ blog: blog._id });
      return { ...blog.toObject(), reviewsCount };
    })
  );

  const total = await Blogs.countDocuments({ author: req.user._id });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs: blogsWithCounts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      'User blogs fetched successfully'
    )
  );
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blogs.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', '-password -refreshToken');

  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { blog }, 'Blog fetched successfully'));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, image, tags, category, description } = req.body;

  if (!title || !content) {
    throw new ApiError('Title and content are required', 400);
  }

  const blog = await Blogs.findById(id);

  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Unauthorized: You cannot edit this blog', 403);
  }

  blog.title = title;
  blog.content = content;
  blog.image = image || blog.image;
  blog.tags = tags || blog.tags;
  blog.category = category || blog.category;
  blog.description = description || blog.description;

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { blog }, 'Blog updated successfully'));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blogs.findById(id);

  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Unauthorized: You cannot delete this blog', 403);
  }

  await Blogs.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Blog deleted successfully'));
});

const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const blogs = await Blogs.find({ author: authorId })
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new ApiError('No blogs found for this author', 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { blogs }, 'Blogs by author fetched successfully')
    );
});

export {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor,
  getUserBlogs
};
