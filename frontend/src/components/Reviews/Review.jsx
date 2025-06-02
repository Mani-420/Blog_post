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
    await reviewService.addOrUpdateReview(blogId, { rating, text });
    setRating(0);
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
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      {averageRating && (
        <div className="mb-2">
          Average Rating: <span className="font-bold">{averageRating} / 5</span>
        </div>
      )}
      {isAuthenticated && (
        <form onSubmit={handleAddReview} className="mb-4 flex flex-col gap-2">
          <div>
            <label>Rating: </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
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
            className="p-2 border rounded"
            placeholder="Write a review..."
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      )}
      {loading ? (
        <div>Loading reviews...</div>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r._id} className="mb-2 border-b pb-2">
              <div className="font-semibold">
                {r.author?.username || 'User'}
              </div>
              <div>Rating: {r.rating} / 5</div>
              <div>{r.text}</div>
              <div className="text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsSection;
