import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { commentService } from '../../services/commentService';

const CommentsSection = ({ blogId }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    const res = await commentService.getComments(blogId);
    setComments(res.data.data.comments || []);
    setLoading(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await commentService.addComment(blogId, { content: newComment });
    setNewComment('');
    fetchComments();
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      )}
      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c._id} className="mb-2 border-b pb-2">
              <div className="font-semibold">
                {c.author?.username || 'User'}
              </div>
              <div>{c.content}</div>
              <div className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentsSection;
