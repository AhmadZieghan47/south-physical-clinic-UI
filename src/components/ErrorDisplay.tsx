// Error Display Components
// This file contains reusable React components for displaying different types of errors

import React from "react";
import type {
  ApiErrorResponse,
  ErrorCategory,
  ErrorSeverity,
} from "../types/errors";
import {
  transformErrorForUI,
  getUserFriendlyMessage,
  getErrorRecoverySuggestions,
  formatValidationErrors,
  shouldTriggerLogout,
  isRetryableError,
} from "../utils/errorHandling";

// ============================================================================
// ERROR ICON COMPONENT
// ============================================================================

interface ErrorIconProps {
  category: ErrorCategory;
  severity: ErrorSeverity;
  className?: string;
}

const ErrorIcon: React.FC<ErrorIconProps> = ({
  severity,
  className = "",
}) => {
  const getIconClass = () => {
    switch (severity) {
      case "critical":
        return "ti ti-alert-triangle text-danger";
      case "high":
        return "ti ti-alert-circle text-warning";
      case "medium":
        return "ti ti-info-circle text-info";
      case "low":
        return "ti ti-alert-circle text-secondary";
      default:
        return "ti ti-alert-circle text-secondary";
    }
  };

  return <i className={`${getIconClass()} ${className}`} />;
};

// ============================================================================
// VALIDATION ERROR COMPONENT
// ============================================================================

interface ValidationErrorProps {
  error: ApiErrorResponse;
  className?: string;
  showFieldLabels?: boolean;
}

const ValidationError: React.FC<ValidationErrorProps> = ({
  error,
  className = "",
  showFieldLabels = true,
}) => {
  const validationErrors = formatValidationErrors(error);
  const userMessage = getUserFriendlyMessage(error);

  if (validationErrors.length === 0) {
    return (
      <div className={`alert alert-danger ${className}`} role="alert">
        <div className="d-flex align-items-center">
          <ErrorIcon category="validation" severity="low" className="me-2" />
          <span>{userMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex align-items-center mb-2">
        <ErrorIcon category="validation" severity="low" className="me-2" />
        <strong>Please fix the following errors:</strong>
      </div>
      <ul className="mb-0">
        {validationErrors.map((validationError, index) => (
          <li key={index} className="mb-1">
            {showFieldLabels && validationError.fieldLabel && (
              <strong>{validationError.fieldLabel}: </strong>
            )}
            {validationError.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// GENERAL ERROR COMPONENT
// ============================================================================

interface GeneralErrorProps {
  error: ApiErrorResponse;
  className?: string;
  showSuggestions?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const GeneralError: React.FC<GeneralErrorProps> = ({
  error,
  className = "",
  showSuggestions = true,
  showRetryButton = true,
  onRetry,
  onDismiss,
}) => {
  const errorInfo = transformErrorForUI(error);
  const suggestions = getErrorRecoverySuggestions(error);
  const canRetry = isRetryableError(error) && showRetryButton;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior - reload the page
      window.location.reload();
    }
  };

  return (
    <div
      className={`alert alert-${getAlertClass(
        errorInfo.severity
      )} ${className}`}
      role="alert"
    >
      <div className="d-flex align-items-start">
        <ErrorIcon
          category={errorInfo.category}
          severity={errorInfo.severity}
          className="me-2 mt-1"
        />
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="alert-heading mb-1">{errorInfo.title}</h6>
              <p className="mb-2">{errorInfo.message}</p>
            </div>
            {onDismiss && (
              <button
                type="button"
                className="btn-close"
                onClick={onDismiss}
                aria-label="Dismiss error"
              />
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="mb-2">
              <small className="text-muted">Suggestions:</small>
              <ul className="mb-0 mt-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="small">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {canRetry && (
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleRetry}
              >
                <i className="ti ti-refresh me-1" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AUTHENTICATION ERROR COMPONENT
// ============================================================================

interface AuthErrorProps {
  error: ApiErrorResponse;
  className?: string;
  onLogin?: () => void;
}

const AuthError: React.FC<AuthErrorProps> = ({
  error,
  className = "",
  onLogin,
}) => {
  const userMessage = getUserFriendlyMessage(error);
  const shouldLogout = shouldTriggerLogout(error);

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      // Default behavior - redirect to login
      window.location.href = "/login";
    }
  };

  React.useEffect(() => {
    if (shouldLogout) {
      // Auto-redirect to login after a short delay
      const timer = setTimeout(() => {
        handleLogin();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldLogout]);

  return (
    <div className={`alert alert-warning ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <ErrorIcon category="authentication" severity="high" className="me-2" />
        <div className="flex-grow-1">
          <strong>Authentication Required</strong>
          <p className="mb-2">{userMessage}</p>
          {shouldLogout && (
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">
                Redirecting to login page in 3 seconds...
              </small>
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={handleLogin}
              >
                <i className="ti ti-login me-1" />
                Login Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// NETWORK ERROR COMPONENT
// ============================================================================

interface NetworkErrorProps {
  error: any;
  className?: string;
  onRetry?: () => void;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
  error,
  className = "",
  onRetry,
}) => {
  const isTimeout =
    error.code === "ECONNABORTED" || error.message?.includes("timeout");
  const isCors =
    error.message?.includes("CORS") || error.code === "ERR_NETWORK";

  const getErrorMessage = () => {
    if (isTimeout) {
      return "The request timed out. Please check your connection and try again.";
    }
    if (isCors) {
      return "Network error occurred. Please check your connection.";
    }
    return "Network error occurred. Please check your internet connection and try again.";
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <i className="ti ti-wifi-off text-danger me-2" />
        <div className="flex-grow-1">
          <strong>Network Error</strong>
          <p className="mb-2">{getErrorMessage()}</p>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleRetry}
            >
              <i className="ti ti-refresh me-1" />
              Retry
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => window.location.reload()}
            >
              <i className="ti ti-refresh me-1" />
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
          />
        );
      }

      return (
        <div className="alert alert-danger m-3" role="alert">
          <div className="d-flex align-items-center">
            <i className="ti ti-alert-triangle text-danger me-2" />
            <div className="flex-grow-1">
              <h6 className="alert-heading">Something went wrong</h6>
              <p className="mb-2">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={this.resetError}
                >
                  <i className="ti ti-refresh me-1" />
                  Try Again
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => window.location.reload()}
                >
                  <i className="ti ti-refresh me-1" />
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// ERROR TOAST COMPONENT
// ============================================================================

interface ErrorToastProps {
  error: ApiErrorResponse;
  isVisible: boolean;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  error,
  isVisible,
  onDismiss,
  autoHide = true,
  duration = 5000,
}) => {
  const errorInfo = transformErrorForUI(error);

  React.useEffect(() => {
    if (isVisible && autoHide) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1055 }}
    >
      <div
        className="toast show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <ErrorIcon
            category={errorInfo.category}
            severity={errorInfo.severity}
            className="me-2"
          />
          <strong className="me-auto">{errorInfo.title}</strong>
          <button
            type="button"
            className="btn-close"
            onClick={onDismiss}
            aria-label="Close"
          />
        </div>
        <div className="toast-body">{errorInfo.message}</div>
      </div>
    </div>
  );
};

// ============================================================================
// SMART ERROR COMPONENT (AUTO-DETECTS ERROR TYPE)
// ============================================================================

interface SmartErrorProps {
  error: ApiErrorResponse | any;
  className?: string;
  showSuggestions?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  onLogin?: () => void;
}

const SmartError: React.FC<SmartErrorProps> = (props) => {
  const { error, ...restProps } = props;

  // Check if it's a network error (not an API error)
  if (!error?.error) {
    return <NetworkError error={error} {...restProps} />;
  }

  const apiError = error as ApiErrorResponse;
  const category = transformErrorForUI(apiError).category;

  switch (category) {
    case "validation":
      return <ValidationError error={apiError} {...restProps} />;

    case "authentication":
      return <AuthError error={apiError} {...restProps} />;

    default:
      return <GeneralError error={apiError} {...restProps} />;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getAlertClass(severity: ErrorSeverity): string {
  switch (severity) {
    case "critical":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "info";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ErrorIcon,
  ValidationError,
  GeneralError,
  AuthError,
  NetworkError,
  ErrorBoundary,
  ErrorToast,
  SmartError,
};
