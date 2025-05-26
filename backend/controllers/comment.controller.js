import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from '../models/comment.model.js';
import { Blogs } from '../models/blog.model.js';

// Create a comment (Protected route)
const createComment = asyncHandler(async (req, res) => {
  const { content, blogId, parentCommentId } = req.body;

  if (!content) {
    throw new ApiError('Comment content is required', 400);
  }

  // Check if blog exists
  const blog = await Blogs.findById(blogId);
  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  // If it's a reply, check if parent comment exists
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new ApiError('Parent comment not found', 404);
    }
  }

  const comment = await Comment.create({
    content,
    author: req.user._id,
    blog: blogId,
    parentComment: parentCommentId || null
  });

  await comment.populate('author', '-password -refreshToken');

  return res.status(201).json(
    new ApiResponse(201, { comment }, 'Comment created successfully')
  );
});

// Get all comments for a blog
const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Check if blog exists
  const blog = await Blogs.findById(blogId);
  if (!blog) {
    throw new ApiError('Blog not found', 404);
  }

  // Get only parent comments (not replies)
  const comments = await Comment.find({ 
    blog: blogId, 
    parentComment: null 
  })
    .populate('author', '-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('author', '-password -refreshToken')
        .sort({ createdAt: 1 });
      
      return {
        ...comment.toObject(),
        replies
      };
    })
  );

  const total = await Comment.countDocuments({ 
    blog: blogId, 
    parentComment: null 
  });

  return res.status(200).json(
    new ApiResponse(200, {
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Comments fetched successfully')
  );
});

// Update comment (Protected route - only author can update)
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError('Comment content is required', 400);
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }

  // Check if user owns the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Unauthorized: You cannot edit this comment', 403);
  }

  comment.content = content;
  await comment.save();

  await comment.populate('author', '-password -refreshToken');

  return res.status(200).json(
    new ApiResponse(200, { comment }, 'Comment updated successfully')
  );
});

// Delete comment (Protected route - only author can delete)
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }

  // Check if user owns the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Unauthorized: You cannot delete this comment', 403);
  }

  // Delete all replies to this comment
  await Comment.deleteMany({ parentComment: id });
  
  // Delete the comment itself
  await Comment.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, 'Comment deleted successfully')
  );
});

// Like/Unlike comment (Protected route)
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }

  const userId = req.user._id;
  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    // Unlike the comment
    comment.likes = comment.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
  } else {
    // Like the comment
    comment.likes.push(userId);
  }

  await comment.save();

  return res.status(200).json(
    new ApiResponse(200, { 
      isLiked: !isLiked,
      likesCount: comment.likes.length 
    }, `Comment ${isLiked ? 'unliked' : 'liked'} successfully`)
  );
});

export {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  toggleCommentLike
};