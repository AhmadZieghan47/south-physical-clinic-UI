import axios, { AxiosError } from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request interceptor: attach token from secure storage if you’re not using cookies
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token'); // prefer HttpOnly cookies when possible
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If the backend returns 401/403, redirect to login or refresh token
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Optionally log the error or show a toast here
    return Promise.reject(error);
  }
);

export default api;
