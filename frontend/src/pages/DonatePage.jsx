import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DonatePage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) < 1) {
      alert('Please enter a valid amount (minimum $1)');
      return;
    }
    setLoading(true);
    try {
      // Call your backend to create a Stripe Checkout session
      const res = await axios.post('http://localhost:8080/api/donate', {
        amount: Number(amount),
        blogId
      });
      if (res.data && res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe Checkout
      } else {
        alert('Failed to initiate payment.');
      }
    } catch (err) {
      alert('Payment error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleDonate}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Support the Author
        </h2>
        <label className="block mb-2 text-gray-700 font-medium">
          Donation Amount (USD)
        </label>
        <input
          type="number"
          min="1"
          step="1"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (e.g., 5)"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Redirecting...' : 'Donate with Stripe'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default DonatePage;
