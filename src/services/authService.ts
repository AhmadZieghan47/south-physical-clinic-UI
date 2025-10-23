// Centralized Authentication Service
// This service handles all authentication-related functionality

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import type { LoginResponse, AuthUser } from "../types/auth";

// Storage keys with consistent prefix
const STORAGE_KEYS = {
  TOKEN: "auth:token",
  USER: "auth:user",
  REFRESH_TOKEN: "auth:refreshToken",
} as const;

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

// JWT Token utilities
export class JWTUtils {
  static parseToken(
    token: string
  ): { exp?: number; iat?: number; [key: string]: any } | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string, skewSeconds = 30): boolean {
    const payload = this.parseToken(token);
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp - skewSeconds;
  }

  static getTokenExpiration(token: string): Date | null {
    const payload = this.parseToken(token);
    if (!payload?.exp) return null;
    return new Date(payload.exp * 1000);
  }
}

// Storage utilities
export class StorageUtils {
  private static prefix = "app:";

  static get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  static set<T = any>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}

// Main Authentication Service
export class AuthService {
  private static instance: AuthService;
  private api: AxiosInstance;
  private token: string | null = null;
  private user: AuthUser | null = null;

  private constructor() {
    this.api = this.createApiInstance();
    this.loadStoredAuth();
    this.setupInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private createApiInstance(): AxiosInstance {
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
    // Request interceptor - automatically add Bearer token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && !JWTUtils.isTokenExpired(token)) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle auth errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.handleAuthError();
        }
        return Promise.reject(error);
      }
    );
  }

  private handleAuthError(): void {
    console.warn(
      "Authentication error - clearing auth and redirecting to login"
    );
    this.clearAuth();
    window.location.href = "/login";
  }

  private loadStoredAuth(): void {
    this.token = StorageUtils.get<string>(STORAGE_KEYS.TOKEN);
    this.user = StorageUtils.get<AuthUser>(STORAGE_KEYS.USER);
  }

  // Public API methods
  public async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      this.setAuth(token, user);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      // Call logout endpoint if it exists
      await this.api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout endpoint failed:", error);
    } finally {
      this.clearAuth();
    }
  }

  public async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = StorageUtils.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await this.api.post<LoginResponse>("/auth/refresh", {
        refreshToken,
      });

      const { token, user } = response.data;
      if (token && user) {
        this.setAuth(token, user);
      }

      return response.data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearAuth();
      throw error;
    }
  }

  public async getCurrentUser(): Promise<AuthUser> {
    try {
      const response = await this.api.get<AuthUser>("/auth/me");
      this.user = response.data;
      StorageUtils.set(STORAGE_KEYS.USER, this.user);
      return response.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      throw error;
    }
  }

  // Token management
  public getToken(): string | null {
    return this.token;
  }

  public getUser(): AuthUser | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!(this.token && !JWTUtils.isTokenExpired(this.token));
  }

  public setAuth(token: string, user: AuthUser): void {
    this.token = token;
    this.user = user;
    StorageUtils.set(STORAGE_KEYS.TOKEN, token);
    StorageUtils.set(STORAGE_KEYS.USER, user);
  }

  public clearAuth(): void {
    this.token = null;
    this.user = null;
    StorageUtils.remove(STORAGE_KEYS.TOKEN);
    StorageUtils.remove(STORAGE_KEYS.USER);
    StorageUtils.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // API instance for making authenticated requests
  public getApi(): AxiosInstance {
    return this.api;
  }

  // Utility methods
  public getTokenExpiration(): Date | null {
    if (!this.token) return null;
    return JWTUtils.getTokenExpiration(this.token);
  }

  public isTokenExpired(): boolean {
    if (!this.token) return true;
    return JWTUtils.isTokenExpired(this.token);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export convenience functions for backward compatibility
export const login = (email: string, password: string) =>
  authService.login(email, password);
export const logout = () => authService.logout();
export const refreshToken = () => authService.refreshToken();
export const getCurrentUser = () => authService.getCurrentUser();
export const getToken = () => authService.getToken();
export const getUser = () => authService.getUser();
export const isAuthenticated = () => authService.isAuthenticated();
export const clearAuth = () => authService.clearAuth();
export const getApi = () => authService.getApi();
