import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  { timeStamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
// This model defines a Review schema with fields for comment, rating, user reference, and timestamps.