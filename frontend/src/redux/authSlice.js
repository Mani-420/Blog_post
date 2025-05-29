import { createSlice } from '@reduxjs/toolkit';

// ✅ Fix initialState structure
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'), // ✅ Add this
  user: JSON.parse(localStorage.getItem('user')) || null, // ✅ Consistent naming
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // ✅ Your backend response structure is different
      console.log('Auth Slice - Login payload:', action.payload);

      state.isAuthenticated = true; // ✅ Use isAuthenticated instead of status
      state.user = action.payload.message.user; // ✅ User is in message.user
      state.token = action.payload.message.accessToken; // ✅ Token is in message.accessToken
      state.isLoading = false;
      state.error = null;

      // ✅ Store in localStorage
      localStorage.setItem('token', action.payload.message.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.message.user));
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
