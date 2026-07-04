import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenHelper';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        removeToken();
        localStorage.clear();
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Access Forbidden (403)');
      } else if (status === 500) {
        console.error('Internal Server Error (500)');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
