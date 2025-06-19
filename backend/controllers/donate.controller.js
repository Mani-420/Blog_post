import { asyncHandler } from '../utils/asyncHandler.js';
import { Donation } from '../models/Donation.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createDonationSession = asyncHandler(async (req, res) => {
  const { amount, blogId, authorId, donorId } = req.body;

  // Stripe expects amount in cents
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Blog Donation',
            description: `Support for blog ${blogId}`
          },
          unit_amount: Math.round(Number(amount) * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: process.env.CLIENT_URL + '/donate-success',
    cancel_url: process.env.CLIENT_URL + '/donate-cancel',
    metadata: {
      blogId,
      authorId,
      donorId: donorId || '', // Optional, for logged-in users
      amount
    }
  });

  res.json({ url: session.url });
});

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { blogId, authorId, donorId, amount } = session.metadata;

    // Create donation record
    await Donation.create({
      donor: donorId || undefined,
      blog: blogId,
      author: authorId,
      amount: Number(amount)
    });
  }

  res.status(200).json({ received: true });
});

// 3. Get all donations for an author
export const getDonationsByAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const donations = await Donation.find({ author: authorId }).populate(
    'blog donor'
  );
  res.json(donations);
});

// 4. Get all donations for a blog
export const getDonationsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const donations = await Donation.find({ blog: blogId }).populate('donor');
  res.json(donations);
});

// 5. Get all donations by a user (donor)
export const getUserDonations = asyncHandler(async (req, res) => {
  const { donorId } = req.params;
  const donations = await Donation.find({ donor: donorId }).populate('blog');
  res.json(donations);
});
