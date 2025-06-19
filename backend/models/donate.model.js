import mongoose, { Schema } from 'mongoose';

const donationSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    },

    amount: {
      type: Number,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Donation = mongoose.model('Donation', donationSchema);
