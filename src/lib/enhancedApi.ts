// Enhanced API Client with Integrated Error Handling
// This file provides an enhanced API client that integrates with the new error handling system

import { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { getApi } from "../services/authService";
import {
  parseError,
  isNetworkError,
  isTimeoutError,
  logErrorWithContext,
} from "../utils/errorHandling";
import type { ApiErrorResponse } from "../types/errors";

// ============================================================================
// ENHANCED API CLIENT CLASS
// ============================================================================

export interface ApiRequestConfig extends AxiosRequestConfig {
  // Error handling options
  skipErrorHandling?: boolean;
  showErrorToast?: boolean;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, any>;
  };
  // Retry options
  retryable?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

export class EnhancedApiClient {
  private api: AxiosInstance;
  private defaultConfig: Partial<ApiRequestConfig>;

  constructor(
    baseApi?: AxiosInstance,
    defaultConfig: Partial<ApiRequestConfig> = {}
  ) {
    this.api = baseApi || getApi();
    this.defaultConfig = {
      timeout: 10000,
      retryable: true,
      maxRetries: 3,
      retryDelay: 1000,
      showErrorToast: true,
      ...defaultConfig,
    };
  }

  // ============================================================================
  // REQUEST METHODS
  // ============================================================================

  async get<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  async delete<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  // ============================================================================
  // CORE REQUEST METHOD
  // ============================================================================

  private async request<T = any>(
    config: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const {
      skipErrorHandling,
      context,
      retryable,
      maxRetries,
      retryDelay,
      ...axiosConfig
    } = finalConfig;

    let lastError: any = null;
    let attempt = 0;

    while (attempt <= (maxRetries || 0)) {
      try {
        const response = await this.api.request<T>(axiosConfig);

        // Log successful requests if context is provided
        if (context && import.meta.env.DEV) {
          console.log(
            `✅ API Success [${axiosConfig.method?.toUpperCase()}] ${
              axiosConfig.url
            }`,
            {
              context,
              status: response.status,
              data: response.data,
            }
          );
        }

        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
        };
      } catch (error) {
        lastError = error;
        attempt++;

        // Parse the error
        const apiError = parseError(error);

        // Log error with context
        if (context && apiError) {
          logErrorWithContext(apiError, context);
        }

        // Handle non-retryable errors
        if (!retryable || !this.shouldRetry(error, attempt, maxRetries || 0)) {
          if (skipErrorHandling) {
            throw error;
          }
          throw apiError || this.createNetworkError(error);
        }

        // Wait before retry
        if (attempt <= (maxRetries || 0)) {
          const delay = this.calculateRetryDelay(attempt, retryDelay || 1000);
          await this.sleep(delay);
        }
      }
    }

    // If we get here, all retries failed
    if (skipErrorHandling) {
      throw lastError;
    }
    throw parseError(lastError) || this.createNetworkError(lastError);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private shouldRetry(
    error: any,
    attempt: number,
    maxRetries: number
  ): boolean {
    if (attempt > maxRetries) return false;

    // Don't retry client errors (4xx) except for specific cases
    if (error.response?.status >= 400 && error.response?.status < 500) {
      // Retry on rate limiting (429) and some auth errors
      return error.response.status === 429 || error.response.status === 401;
    }

    // Retry on server errors (5xx) and network errors
    return (
      error.response?.status >= 500 ||
      isNetworkError(error) ||
      isTimeoutError(error)
    );
  }

  private calculateRetryDelay(attempt: number, baseDelay: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createNetworkError(error: any): ApiErrorResponse {
    return {
      error: {
        message: isNetworkError(error)
          ? "Network error occurred. Please check your connection."
          : isTimeoutError(error)
          ? "Request timed out. Please try again."
          : "An unexpected error occurred.",
        code: isNetworkError(error) ? "NETWORK_ERROR" : "UNKNOWN_ERROR",
        statusCode: error.response?.status || 0,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  // Upload file with progress tracking
  async uploadFile<T = any>(
    url: string,
    file: File,
    config?: ApiRequestConfig & {
      onUploadProgress?: (progressEvent: any) => void;
      fieldName?: string;
    }
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(config?.fieldName || "file", file);

    return this.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  }

  // Download file
  async downloadFile(url: string, config?: ApiRequestConfig): Promise<Blob> {
    const response = await this.get(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }

  // Batch requests
  async batch<T = any>(
    requests: Array<() => Promise<ApiResponse<T>>>
  ): Promise<ApiResponse<T>[]> {
    return Promise.all(requests.map((request) => request()));
  }

  // ============================================================================
  // CONFIGURATION METHODS
  // ============================================================================

  setDefaultConfig(config: Partial<ApiRequestConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  getDefaultConfig(): Partial<ApiRequestConfig> {
    return { ...this.defaultConfig };
  }

  // Get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

// Create a new enhanced API client instance
export function createEnhancedApi(
  baseApi?: AxiosInstance,
  defaultConfig?: Partial<ApiRequestConfig>
): EnhancedApiClient {
  return new EnhancedApiClient(baseApi, defaultConfig);
}

// Create a specialized API client for specific modules
export function createModuleApi(
  moduleName: string,
  defaultConfig?: Partial<ApiRequestConfig>
): EnhancedApiClient {
  return new EnhancedApiClient(getApi(), {
    context: { component: moduleName },
    ...defaultConfig,
  });
}

// ============================================================================
// DEFAULT INSTANCE
// ============================================================================

// Export a default enhanced API client instance
export const enhancedApi = createEnhancedApi();

// Export default for backward compatibility
export default enhancedApi;
