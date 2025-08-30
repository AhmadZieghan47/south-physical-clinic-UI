import axios from "axios";

import { clearAuth, getToken, isExpired } from "./authHelper";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Optional: early guard against expired tokens
    if (isExpired(token)) {
      clearAuth();
      // You can also redirect to /login here if you keep a router singleton
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAuth();
      // Optionally trigger a redirect to /login
    }
    return Promise.reject(err);
  }
);
