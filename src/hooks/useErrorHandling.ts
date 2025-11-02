// Error Handling Hooks
// This file contains React hooks for managing error states and handling API errors

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  ApiErrorResponse,
  ErrorCategory,
  ErrorSeverity,
} from "../types/errors";
import {
  parseError,
  isNetworkError,
  isTimeoutError,
  categorizeError,
  getErrorSeverity,
  getUserFriendlyMessage,
  getErrorRecoverySuggestions,
  formatValidationErrors,
  isRetryableError,
  getRetryDelay,
  shouldTriggerLogout,
  logErrorWithContext,
} from "../utils/errorHandling";

// ============================================================================
// USE ERROR HANDLING HOOK
// ============================================================================

interface UseErrorHandlingOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onLogout?: () => void;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, any>;
  };
}

interface UseErrorHandlingReturn {
  error: ApiErrorResponse | null;
  isLoading: boolean;
  retryCount: number;
  lastErrorTime: number | null;
  setError: (error: ApiErrorResponse | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  retry: () => void;
  reset: () => void;
  shouldRetry: boolean;
  retryDelay: number;
  errorCategory: ErrorCategory | null;
  errorSeverity: ErrorSeverity | null;
  userFriendlyMessage: string | null;
  recoverySuggestions: string[];
  validationErrors: Array<{
    field: string;
    message: string;
    fieldLabel?: string;
  }>;
  handleApiError: (error: any) => void;
  executeWithErrorHandling: <T>(
    asyncFn: () => Promise<T>,
    options?: { showLoading?: boolean; retryable?: boolean }
  ) => Promise<T | null>;
}

export function useErrorHandling(
  options: UseErrorHandlingOptions = {}
): UseErrorHandlingReturn {
  const {
    autoRetry = false,
    maxRetries = 3,
    retryDelay: baseRetryDelay = 2000,
    onLogout,
    context,
  } = options;

  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState<number | null>(null);

  const retryTimeoutRef = useRef<number | null>(null);
  const retryAttemptsRef = useRef(0);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setLastErrorTime(null);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const reset = useCallback(() => {
    clearError();
    setIsLoading(false);
    retryAttemptsRef.current = 0;
  }, [clearError]);

  const handleApiError = useCallback(
    (error: any) => {
      const apiError = parseError(error);

      if (apiError) {
        setError(apiError);
        setLastErrorTime(Date.now());

        // Log error with context
        if (context) {
          logErrorWithContext(apiError, context);
        }

        // Handle authentication errors
        if (shouldTriggerLogout(apiError) && onLogout) {
          onLogout();
        }

        // Auto-retry logic
        if (
          autoRetry &&
          isRetryableError(apiError) &&
          retryAttemptsRef.current < maxRetries
        ) {
          const delay = getRetryDelay(apiError, retryAttemptsRef.current + 1);
          retryAttemptsRef.current++;

          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(retryAttemptsRef.current);
            // The retry will be handled by the calling code
          }, delay);
        }
      } else {
        // Handle non-API errors (network, timeout, etc.)
        const networkError: ApiErrorResponse = {
          error: {
            message: isNetworkError(error)
              ? "Network error occurred. Please check your connection."
              : isTimeoutError(error)
              ? "Request timed out. Please try again."
              : "An unexpected error occurred.",
            code: isNetworkError(error) ? "NETWORK_ERROR" : "UNKNOWN_ERROR",
            statusCode: isNetworkError(error) ? 0 : 500,
            timestamp: new Date().toISOString(),
          },
        };

        setError(networkError);
        setLastErrorTime(Date.now());
      }
    },
    [autoRetry, maxRetries, onLogout] // Remove context from dependencies
  );

  const retry = useCallback(() => {
    if (error && isRetryableError(error)) {
      retryAttemptsRef.current++;
      setRetryCount(retryAttemptsRef.current);
      clearError();
    }
  }, [error, clearError]);

  const executeWithErrorHandling = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options: { showLoading?: boolean; retryable?: boolean } = {}
    ): Promise<T | null> => {
      const { showLoading = true, retryable = true } = options;

      try {
        if (showLoading) {
          setIsLoading(true);
        }

        clearError();
        const result = await asyncFn();

        if (showLoading) {
          setIsLoading(false);
        }

        return result;
      } catch (error) {
        if (showLoading) {
          setIsLoading(false);
        }

        if (retryable) {
          handleApiError(error);
        }

        return null;
      }
    },
    [clearError, handleApiError]
  );

  // Computed values
  const errorCategory = error ? categorizeError(error.error.code) : null;
  const errorSeverity = error
    ? getErrorSeverity(error.error.code, error.error.statusCode)
    : null;
  const userFriendlyMessage = error ? getUserFriendlyMessage(error) : null;
  const recoverySuggestions = error ? getErrorRecoverySuggestions(error) : [];
  const validationErrors = error ? formatValidationErrors(error) : [];
  const shouldRetry = error
    ? isRetryableError(error) && retryAttemptsRef.current < maxRetries
    : false;
  const retryDelay = error
    ? getRetryDelay(error, retryAttemptsRef.current + 1)
    : baseRetryDelay;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    error,
    isLoading,
    retryCount,
    lastErrorTime,
    setError,
    clearError,
    setLoading,
    retry,
    reset,
    shouldRetry,
    retryDelay,
    errorCategory,
    errorSeverity,
    userFriendlyMessage,
    recoverySuggestions,
    validationErrors,
    handleApiError,
    executeWithErrorHandling,
  };
}

// ============================================================================
// USE API HOOK
// ============================================================================

interface UseApiOptions extends UseErrorHandlingOptions {
  immediate?: boolean;
}

interface UseApiReturn<T> extends UseErrorHandlingReturn {
  data: T | null;
  setData: (data: T | null) => void;
  refetch: () => Promise<T | null>;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, ...errorHandlingOptions } = options;

  const errorHandling = useErrorHandling(errorHandlingOptions);
  const [data, setData] = useState<T | null>(null);

  const refetch = useCallback(async (): Promise<T | null> => {
    return await errorHandling.executeWithErrorHandling(async () => {
      const result = await apiFunction();
      setData(result);
      return result;
    });
  }, [apiFunction, errorHandling]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return {
    ...errorHandling,
    data,
    setData,
    refetch,
  };
}

// ============================================================================
// USE FORM ERROR HANDLING HOOK
// ============================================================================

interface UseFormErrorHandlingOptions {
  onValidationError?: (
    errors: Array<{ field: string; message: string; fieldLabel?: string }>
  ) => void;
  onGeneralError?: (error: ApiErrorResponse) => void;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, any>;
  };
}

interface UseFormErrorHandlingReturn {
  fieldErrors: Record<string, string>;
  generalError: ApiErrorResponse | null;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
  handleFormError: (error: any) => void;
  hasErrors: boolean;
  hasFieldErrors: boolean;
  hasGeneralError: boolean;
}

export function useFormErrorHandling(
  options: UseFormErrorHandlingOptions = {}
): UseFormErrorHandlingReturn {
  const { onValidationError, onGeneralError, context } = options;

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<ApiErrorResponse | null>(
    null
  );

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  const handleFormError = useCallback(
    (error: any) => {
      const apiError = parseError(error);

      if (apiError) {
        // Log error with context
        if (context) {
          logErrorWithContext(apiError, context);
        }

        const validationErrors = formatValidationErrors(apiError);

        if (validationErrors.length > 0) {
          // Handle validation errors
          const fieldErrorMap: Record<string, string> = {};
          validationErrors.forEach(({ field, message }) => {
            fieldErrorMap[field] = message;
          });

          setFieldErrors(fieldErrorMap);
          setGeneralError(null);

          if (onValidationError) {
            onValidationError(validationErrors);
          }
        } else {
          // Handle general errors
          setFieldErrors({});
          setGeneralError(apiError);

          if (onGeneralError) {
            onGeneralError(apiError);
          }
        }
      } else {
        // Handle non-API errors
        const networkError: ApiErrorResponse = {
          error: {
            message: "An unexpected error occurred. Please try again.",
            code: "UNKNOWN_ERROR",
            statusCode: 500,
            timestamp: new Date().toISOString(),
          },
        };

        setFieldErrors({});
        setGeneralError(networkError);

        if (onGeneralError) {
          onGeneralError(networkError);
        }
      }
    },
    [onValidationError, onGeneralError, context]
  );

  const hasErrors =
    Object.keys(fieldErrors).length > 0 || generalError !== null;
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const hasGeneralError = generalError !== null;

  return {
    fieldErrors,
    generalError,
    clearFieldError,
    clearAllErrors,
    handleFormError,
    hasErrors,
    hasFieldErrors,
    hasGeneralError,
  };
}

// ============================================================================
// USE ERROR TOAST HOOK
// ============================================================================

interface UseErrorToastOptions {
  autoHide?: boolean;
  duration?: number;
  maxToasts?: number;
}

interface UseErrorToastReturn {
  toasts: Array<{
    id: string;
    error: ApiErrorResponse;
    timestamp: number;
  }>;
  showError: (error: ApiErrorResponse) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

export function useErrorToast(
  options: UseErrorToastOptions = {}
): UseErrorToastReturn {
  const { autoHide = true, duration = 5000, maxToasts = 3 } = options;

  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      error: ApiErrorResponse;
      timestamp: number;
    }>
  >([]);

  const showError = useCallback(
    (error: ApiErrorResponse) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast = {
        id,
        error,
        timestamp: Date.now(),
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Keep only the most recent toasts
        return updated.slice(-maxToasts);
      });

      // Auto-hide after duration
      if (autoHide) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [autoHide, duration, maxToasts]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showError,
    dismissToast,
    dismissAll,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

// All exports are done inline above
