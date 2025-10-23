// Error Display Component Examples and Usage Guide
// This file demonstrates how to use the error display components

import React, { useState } from "react";
import {
  SmartError,
  GeneralError,
  ErrorBoundary,
  ErrorToast,
  ErrorIcon,
} from "../components/ErrorDisplay";
import {
  useErrorHandling,
  useFormErrorHandling,
  useErrorToast,
} from "../hooks/useErrorHandling";
import type { ApiErrorResponse } from "../types/errors";
import ErrorDisplayTestSuite from "./ErrorDisplayTestSuite";

// ============================================================================
// MAIN ERROR DISPLAY EXAMPLES COMPONENT
// ============================================================================

const ErrorDisplayExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'examples' | 'tests'>('examples');

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0">
              Error Display Examples
              <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-2">
                Testing & Development
              </span>
            </h4>
            <p className="text-muted mb-0 mt-1">
              Interactive examples and automated tests for the new structured error handling system
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn ${activeTab === 'examples' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('examples')}
            >
              <i className="ti ti-eye me-1" />
              Examples
            </button>
            <button
              className={`btn ${activeTab === 'tests' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('tests')}
            >
              <i className="ti ti-test-pipe me-1" />
              Test Suite
            </button>
          </div>
        </div>

        {activeTab === 'examples' ? <ExamplesContent /> : <ErrorDisplayTestSuite />}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLES CONTENT COMPONENT
// ============================================================================

const ExamplesContent: React.FC = () => {
  return (
    <>

        <div className="row">
          <div className="col-12">
            <ErrorDisplayUsageGuide />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Basic Error Display</h5>
              </div>
              <div className="card-body">
                <BasicErrorExample />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Form Error Handling</h5>
              </div>
              <div className="card-body">
                <FormErrorExample />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">API Error Handling with Retry</h5>
              </div>
              <div className="card-body">
                <ApiErrorExample />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Error Toast Notifications</h5>
              </div>
              <div className="card-body">
                <ErrorToastExample />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Error Boundary</h5>
              </div>
              <div className="card-body">
                <ErrorBoundaryExample />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Error Icons</h5>
              </div>
              <div className="card-body">
                <ErrorIconExample />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

// ============================================================================
// EXAMPLE 1: BASIC ERROR DISPLAY
// ============================================================================

const BasicErrorExample: React.FC = () => {
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const simulateError = () => {
    const mockError: ApiErrorResponse = {
      error: {
        message: "ZOD_VALIDATION_ERROR: Validation failed",
        code: "ZOD_VALIDATION_ERROR",
        statusCode: 400,
        timestamp: new Date().toISOString(),
        details: {
          validationErrors: [
            {
              field: "personal.firstName",
              message: "First name is required",
              code: "too_small",
              received: "",
              expected: "string with at least 1 character",
            },
            {
              field: "personal.email",
              message: "Invalid email format",
              code: "invalid_string",
              received: "invalid-email",
              expected: "valid email address",
            },
          ],
        },
      },
    };
    setError(mockError);
  };

  const clearError = () => setError(null);

  return (
    <div>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={simulateError}>
          <i className="ti ti-alert-triangle me-1" />
          Simulate Validation Error
        </button>
        <button className="btn btn-secondary" onClick={clearError}>
          <i className="ti ti-x me-1" />
          Clear Error
        </button>
      </div>

      {error && (
        <SmartError
          error={error}
          onDismiss={clearError}
          showSuggestions={true}
          showRetryButton={false}
        />
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: FORM ERROR HANDLING
// ============================================================================

const FormErrorExample: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
  });

  const {
    fieldErrors,
    generalError,
    clearFieldError,
    clearAllErrors,
    handleFormError,
    hasErrors,
  } = useFormErrorHandling({
    context: {
      component: "FormErrorExample",
      action: "submit_form",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    try {
      // Simulate API call that might fail
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      alert("Form submitted successfully!");
    } catch (error) {
      handleFormError(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      clearFieldError(name);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-control ${
              fieldErrors.firstName ? "is-invalid" : ""
            }`}
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
          />
          {fieldErrors.firstName && (
            <div className="invalid-feedback">{fieldErrors.firstName}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
          />
          {fieldErrors.email && (
            <div className="invalid-feedback">{fieldErrors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
          {fieldErrors.phone && (
            <div className="invalid-feedback">{fieldErrors.phone}</div>
          )}
        </div>

        {generalError && (
          <GeneralError
            error={generalError}
            className="mb-3"
            onDismiss={clearAllErrors}
          />
        )}

        <button type="submit" className="btn btn-primary" disabled={hasErrors}>
          <i className="ti ti-send me-1" />
          Submit Form
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: API ERROR HANDLING WITH RETRY
// ============================================================================

const ApiErrorExample: React.FC = () => {
  const {
    error,
    isLoading,
    retryCount,
    executeWithErrorHandling,
    retry,
    clearError,
  } = useErrorHandling({
    autoRetry: true,
    maxRetries: 3,
    context: {
      component: "ApiErrorExample",
      action: "fetch_data",
    },
  });

  const fetchData = async () => {
    return await executeWithErrorHandling(async () => {
      // Simulate API call
      const response = await fetch("/api/patients");
      if (!response.ok) {
        throw await response.json();
      }
      return await response.json();
    });
  };

  return (
    <div>
      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={fetchData}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Loading...
            </>
          ) : (
            <>
              <i className="ti ti-download me-1" />
              Fetch Data
            </>
          )}
        </button>

        {error && (
          <button
            className="btn btn-outline-secondary me-2"
            onClick={clearError}
          >
            <i className="ti ti-x me-1" />
            Clear Error
          </button>
        )}

        {error && retryCount < 3 && (
          <button className="btn btn-outline-primary" onClick={retry}>
            <i className="ti ti-refresh me-1" />
            Retry ({retryCount}/3)
          </button>
        )}
      </div>

      {error && (
        <SmartError
          error={error}
          showRetryButton={true}
          onRetry={retry}
          onDismiss={clearError}
        />
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: ERROR TOAST NOTIFICATIONS
// ============================================================================

const ErrorToastExample: React.FC = () => {
  const { toasts, showError, dismissToast, dismissAll } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  const simulateError = (type: string) => {
    const mockErrors: Record<string, ApiErrorResponse> = {
      validation: {
        error: {
          message: "ZOD_VALIDATION_ERROR: Validation failed",
          code: "ZOD_VALIDATION_ERROR",
          statusCode: 400,
          timestamp: new Date().toISOString(),
        },
      },
      auth: {
        error: {
          message: "AUTH_ERROR: Token expired",
          code: "AUTH_ERROR",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      network: {
        error: {
          message: "Network error occurred",
          code: "NETWORK_ERROR",
          statusCode: 0,
          timestamp: new Date().toISOString(),
        },
      },
    };

    showError(mockErrors[type]);
  };

  return (
    <div>
      <div className="mb-3">
        <button
          className="btn btn-warning me-2 mb-2"
          onClick={() => simulateError("validation")}
        >
          <i className="ti ti-alert-triangle me-1" />
          Show Validation Error
        </button>
        <button
          className="btn btn-danger me-2 mb-2"
          onClick={() => simulateError("auth")}
        >
          <i className="ti ti-shield-x me-1" />
          Show Auth Error
        </button>
        <button
          className="btn btn-secondary me-2 mb-2"
          onClick={() => simulateError("network")}
        >
          <i className="ti ti-wifi-off me-1" />
          Show Network Error
        </button>
        <button className="btn btn-outline-secondary" onClick={dismissAll}>
          <i className="ti ti-x me-1" />
          Dismiss All
        </button>
      </div>

      {/* Toast Container */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1055 }}
      >
        {toasts.map((toast) => (
          <ErrorToast
            key={toast.id}
            error={toast.error}
            isVisible={true}
            onDismiss={() => dismissToast(toast.id)}
            autoHide={true}
            duration={5000}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: ERROR BOUNDARY USAGE
// ============================================================================

const BuggyComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Something went wrong in the component!");
  }

  return (
    <div>
      <h6 className="mb-3">Buggy Component</h6>
      <button className="btn btn-danger" onClick={() => setShouldThrow(true)}>
        <i className="ti ti-bug me-1" />
        Throw Error
      </button>
    </div>
  );
};

const ErrorBoundaryFallback: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <div className="alert alert-danger">
    <h6 className="alert-heading">
      <i className="ti ti-alert-triangle me-1" />
      Component Error
    </h6>
    <p>An error occurred in a component: {error.message}</p>
    <button className="btn btn-outline-danger" onClick={resetError}>
      <i className="ti ti-refresh me-1" />
      Try Again
    </button>
  </div>
);

const ErrorBoundaryExample: React.FC = () => {
  return (
    <div>
      <ErrorBoundary fallback={ErrorBoundaryFallback}>
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: CUSTOM ERROR ICONS
// ============================================================================

const ErrorIconExample: React.FC = () => {
  return (
    <div>
      <div className="d-flex flex-wrap gap-3">
        <div className="d-flex align-items-center p-2 border rounded">
          <ErrorIcon category="validation" severity="low" className="me-2" />
          <span className="fw-medium">Validation Error (Low)</span>
        </div>

        <div className="d-flex align-items-center p-2 border rounded">
          <ErrorIcon
            category="authentication"
            severity="high"
            className="me-2"
          />
          <span className="fw-medium">Auth Error (High)</span>
        </div>

        <div className="d-flex align-items-center p-2 border rounded">
          <ErrorIcon
            category="server_error"
            severity="critical"
            className="me-2"
          />
          <span className="fw-medium">Server Error (Critical)</span>
        </div>

        <div className="d-flex align-items-center p-2 border rounded">
          <ErrorIcon
            category="business_logic"
            severity="medium"
            className="me-2"
          />
          <span className="fw-medium">Business Logic Error (Medium)</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// USAGE GUIDE COMPONENT
// ============================================================================

const ErrorDisplayUsageGuide: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="ti ti-book me-2" />
          Error Display Components Usage Guide
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <h6 className="fw-semibold text-primary">1. SmartError Component</h6>
              <p className="text-muted mb-2">
                Automatically detects error type and displays appropriate component:
              </p>
              <pre className="bg-light p-3 rounded border">
{`<SmartError
  error={apiError}
  onDismiss={clearError}
  showSuggestions={true}
  showRetryButton={true}
  onRetry={handleRetry}
/>`}
              </pre>
            </div>

            <div className="mb-4">
              <h6 className="fw-semibold text-primary">2. ValidationError Component</h6>
              <p className="text-muted mb-2">Displays validation errors with field-specific messages:</p>
              <pre className="bg-light p-3 rounded border">
{`<ValidationError
  error={validationError}
  showFieldLabels={true}
  className="mb-3"
/>`}
              </pre>
            </div>

            <div className="mb-4">
              <h6 className="fw-semibold text-primary">3. useErrorHandling Hook</h6>
              <p className="text-muted mb-2">Provides comprehensive error handling functionality:</p>
              <pre className="bg-light p-3 rounded border">
{`const {
  error,
  isLoading,
  handleApiError,
  executeWithErrorHandling,
  retry,
  clearError
} = useErrorHandling({
  autoRetry: true,
  maxRetries: 3,
  context: { component: 'MyComponent' }
});`}
              </pre>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-4">
              <h6 className="fw-semibold text-primary">4. useFormErrorHandling Hook</h6>
              <p className="text-muted mb-2">Handles form-specific error states:</p>
              <pre className="bg-light p-3 rounded border">
{`const {
  fieldErrors,
  generalError,
  handleFormError,
  clearFieldError,
  clearAllErrors
} = useFormErrorHandling({
  onValidationError: (errors) => console.log(errors),
  context: { component: 'MyForm' }
});`}
              </pre>
            </div>

            <div className="mb-4">
              <h6 className="fw-semibold text-primary">5. Error Boundary</h6>
              <p className="text-muted mb-2">Catches JavaScript errors in component tree:</p>
              <pre className="bg-light p-3 rounded border">
{`<ErrorBoundary
  fallback={CustomFallbackComponent}
  onError={(error, errorInfo) => console.log(error, errorInfo)}
>
  <MyComponent />
</ErrorBoundary>`}
              </pre>
            </div>

            <div className="alert alert-info">
              <h6 className="alert-heading">
                <i className="ti ti-info-circle me-1" />
                Key Features
              </h6>
              <ul className="mb-0">
                <li>Automatic error type detection</li>
                <li>User-friendly error messages</li>
                <li>Retry functionality for recoverable errors</li>
                <li>Field-specific validation errors</li>
                <li>Toast notifications for non-intrusive errors</li>
                <li>Comprehensive error logging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplayExamples;
