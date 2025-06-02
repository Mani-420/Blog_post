import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { reviewService } from '../../services/reviewService.js';

const ReviewsSection = ({ blogId }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [blogId]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await reviewService.getReviews(blogId);
    setReviews(res.data.data.reviews || []);
    setLoading(false);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!rating) return;
    await reviewService.addOrUpdateReview(blogId, { rating, comment: text });
    setRating(1);
    setText('');
    fetchReviews();
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="mt-10 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        Reviews
        {averageRating && (
          <span className="ml-2 text-yellow-500 font-bold text-lg flex items-center">
            ★ {averageRating}{' '}
            <span className="text-gray-500 text-base ml-1">/ 5</span>
          </span>
        )}
      </h3>

      {isAuthenticated && (
        <form
          onSubmit={handleAddReview}
          className="mb-6 bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={0}>Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-2 border rounded resize-none"
            placeholder="Write your review..."
            rows={3}
          />
          <button
            type="submit"
            className="self-end bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
          >
            Submit Review
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-400 py-6">No reviews yet.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">
                  {r.author?.username || 'User'}
                </span>
                <span className="text-yellow-500 text-sm">★ {r.rating}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-gray-700">{r.comment}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReviewsSection;
