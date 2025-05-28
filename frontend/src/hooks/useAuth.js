import { useSelector, useDispatch } from 'react-redux';
import {
  login,
  logout,
  setLoading,
  setError,
  clearError
} from '../redux/authSlice';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const { status, userData, token, isLoading, error } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const loginUser = async (credentials) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const response = await authService.login(credentials);
      dispatch(login(response.data));
      toast.success('Welcome back!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const response = await authService.register(userData);
      dispatch(login(response.data));
      toast.success('Account created successfully!');
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return {
    isAuthenticated: status,
    user: userData,
    token,
    isLoading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    clearError: () => dispatch(clearError())
  };
};
