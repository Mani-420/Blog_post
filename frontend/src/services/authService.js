import api from './api';

export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getCurrentUser: () => api.get('/users/me'),
  logout: () => api.post('/users/logout')
};
