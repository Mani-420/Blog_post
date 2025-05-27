import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Blogs } from '../models/blog.model.js';
import { Comment } from '../models/comment.model.js';
import { Review } from '../models/review.model.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user's blogs
  const userBlogs = await Blogs.find({ author: userId });
  const blogIds = userBlogs.map((blog) => blog._id);

  // Total posts
  const totalPosts = userBlogs.length;

  // Total views
  const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);

  // Total comments on user's blogs
  const totalComments = await Comment.countDocuments({
    blog: { $in: blogIds }
  });

  // Total reviews on user's blogs
  const totalReviews = await Review.countDocuments({
    blog: { $in: blogIds }
  });

  // Average rating
  const avgRatingResult = await Review.aggregate([
    { $match: { blog: { $in: blogIds } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  const averageRating =
    avgRatingResult.length > 0
      ? Math.round(avgRatingResult[0].avgRating * 10) / 10
      : 0;

  // Recent activity (last 5 blogs)
  const recentBlogs = await Blogs.find({ author: userId })
    .populate('author', 'username')
    .sort({ createdAt: -1 })
    .limit(5);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          totalPosts,
          totalViews,
          totalComments,
          totalReviews,
          averageRating
        },
        recentBlogs
      },
      'Dashboard stats fetched successfully'
    )
  );
});

export { getDashboardStats };
