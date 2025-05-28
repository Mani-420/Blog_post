import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUserBlogsSuccess,
  setBlogsLoading,
  setBlogError
} from '../redux/blogSlice';
import { blogService } from '../services/blogService';

const Dashboard = () => {
  const { userBlogs, isLoading } = useSelector((state) => state.blogs);
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    dispatch(setBlogsLoading(true));
    try {
      const response = await blogService.getUserBlogs();
      dispatch(setUserBlogsSuccess(response.data));
    } catch (error) {
      dispatch(setBlogError(error.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {userData?.fullName}!
      </h1>

      <div className="mb-6">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Create New Blog
        </button>
      </div>

      {isLoading ? (
        <div>Loading your blogs...</div>
      ) : (
        <div className="grid gap-6">
          {userBlogs.map((blog) => (
            <div key={blog._id} className="border p-6 rounded-lg">
              <h3 className="text-xl font-bold">{blog.title}</h3>
              <p className="text-gray-600">{blog.description}</p>
              <div className="mt-4 space-x-4">
                <button className="text-blue-500">Edit</button>
                <button className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
