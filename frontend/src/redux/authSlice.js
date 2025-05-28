// Auth Slice

import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the auth slice
const initialState = {
  status: false,
  userData: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.user;
      state.token = action.payload.accessToken;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.accessToken);
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('token');
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
      state.userData = { ...state.userData, ...action.payload };
    }
  }
});

export const { login, logout, setLoading, setError, clearError, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
