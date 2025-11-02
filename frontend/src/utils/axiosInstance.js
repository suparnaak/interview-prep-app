import axios from 'axios';
import store from '../app/store';
import { logout } from '../features/authSlice';

const baseURL = import.meta.env.VITE_API_BASE_URL || ''; 

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error?.config;

    if (
      error?.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      try {
        store.dispatch(logout());
      } catch (e) {
        console.error('Failed to dispatch logout:', e);
      }
      window.location.href = '/login'; 
    }

    return Promise.reject(error);
  }
);


export default api;
