import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    views: {
      type: Number,
      default: 0
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual for comments count
blogSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
  count: true
});

// Virtual for reviews count
blogSchema.virtual('reviewsCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'blog',
  count: true
});

blogSchema.set('toJSON', { virtuals: true });

export const Blogs = mongoose.model('Blogs', blogSchema);
