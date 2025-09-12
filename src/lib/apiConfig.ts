// Centralized API Configuration
// This file can be shared across multiple repositories

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// Environment configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

// Token management interface - implement this in each repository
interface TokenManager {
  getToken(): string | null;
  clearAuth(): void;
  isExpired?(token: string): boolean;
}

// Default token manager using localStorage/sessionStorage
class DefaultTokenManager implements TokenManager {
  private tokenKey = "accessToken";

  getToken(): string | null {
    return (
      localStorage.getItem(this.tokenKey) ||
      sessionStorage.getItem(this.tokenKey)
    );
  }

  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return false;
    }
  }
}

// API Configuration class
export class ApiConfig {
  private static instance: ApiConfig;
  private api: AxiosInstance;
  private tokenManager: TokenManager;

  private constructor(tokenManager?: TokenManager) {
    this.tokenManager = tokenManager || new DefaultTokenManager();
    this.api = this.createAxiosInstance();
    this.setupInterceptors();
  }

  public static getInstance(tokenManager?: TokenManager): ApiConfig {
    if (!ApiConfig.instance) {
      ApiConfig.instance = new ApiConfig(tokenManager);
    }
    return ApiConfig.instance;
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.tokenManager.getToken();

        if (token) {
          // Check if token is expired
          if (
            this.tokenManager.isExpired &&
            this.tokenManager.isExpired(token)
          ) {
            this.tokenManager.clearAuth();
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired"));
          }

          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.tokenManager.clearAuth();
          window.location.href = "/login";
        }

        if (!error.response) {
          console.error("Network error:", error.message);
        }

        if (error.response?.status && error.response.status >= 500) {
          console.error(
            "Server error:",
            error.response.status,
            error.response.data
          );
        }

        return Promise.reject(error);
      }
    );
  }

  public getApi(): AxiosInstance {
    return this.api;
  }

  public updateTokenManager(tokenManager: TokenManager): void {
    this.tokenManager = tokenManager;
  }
}

// Export the configured API instance
export const api = ApiConfig.getInstance().getApi();

// Export types
export type { AxiosError, InternalAxiosRequestConfig, AxiosResponse, TokenManager };

// Export default for backward compatibility
export default api;
