import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      maxlength: 300,
      minlength: 1,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    }
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
// This model defines a Review schema with fields for comment, rating, user reference, and timestamps.
