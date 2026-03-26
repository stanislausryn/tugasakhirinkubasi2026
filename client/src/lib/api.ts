import axios from 'axios';

const isServer = typeof window === 'undefined';

const getBaseUrl = () => {
  if (isServer) {
    // Docker internal network (Next.js server-side)
    return process.env.INTERNAL_API_URL || 'http://server:3001/api';
  }
  // Browser external network (Client-side)
  // Fallback to relative URL if completely missing (proxy mode) or localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  },
);

export default api;
