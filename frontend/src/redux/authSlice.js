import { createSlice } from '@reduxjs/toolkit';

const userStr = localStorage.getItem('user');
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.isAuthenticated = false; // ✅ Use isAuthenticated
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;

      // ✅ Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // ✅ Use user not userData
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  }
});

export const { login, logout, setLoading, setError, clearError, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
