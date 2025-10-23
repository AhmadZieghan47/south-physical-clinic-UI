// Error Handling Utilities
// This file provides utility functions for handling API errors in the frontend

import type { ApiErrorResponse } from "../types/errors";
import { ErrorCategory, ErrorSeverity } from "../types/errors";

// ============================================================================
// ERROR PARSING AND VALIDATION
// ============================================================================

/**
 * Parse error from various sources (Axios, fetch, etc.)
 */
export function parseError(error: any): ApiErrorResponse | null {
  // Handle Axios errors
  if (error.response?.data?.error) {
    return error.response.data;
  }

  // Handle fetch errors
  if (error.error?.error) {
    return error.error;
  }

  // Handle direct API error responses
  if (error.error) {
    return error;
  }

  return null;
}

/**
 * Check if error is a structured API error
 */
export function isApiError(error: any): error is ApiErrorResponse {
  return (
    error?.error &&
    typeof error.error.message === "string" &&
    typeof error.error.code === "string" &&
    typeof error.error.statusCode === "number" &&
    typeof error.error.timestamp === "string"
  );
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return !error.response && error.request;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return (
    error.code === "ECONNABORTED" ||
    error.message?.includes("timeout") ||
    error.name === "TimeoutError"
  );
}

/**
 * Check if error is a CORS error
 */
export function isCorsError(error: any): boolean {
  return (
    error.message?.includes("CORS") ||
    error.message?.includes("cross-origin") ||
    error.code === "ERR_NETWORK"
  );
}

// ============================================================================
// ERROR CATEGORIZATION
// ============================================================================

/**
 * Categorize error based on error code
 */
export function categorizeError(errorCode: string): ErrorCategory {
  const categoryMap: Record<string, ErrorCategory> = {
    ZOD_VALIDATION_ERROR: ErrorCategory.VALIDATION,
    VALIDATION_ERROR: ErrorCategory.VALIDATION,
    AUTH_ERROR: ErrorCategory.AUTHENTICATION,
    FORBIDDEN_ERROR: ErrorCategory.AUTHORIZATION,
    NOT_FOUND_ERROR: ErrorCategory.NOT_FOUND,
    CONFLICT_ERROR: ErrorCategory.CONFLICT,
    BUSINESS_LOGIC_ERROR: ErrorCategory.BUSINESS_LOGIC,
    DATABASE_ERROR: ErrorCategory.SERVER_ERROR,
    EXTERNAL_SERVICE_ERROR: ErrorCategory.SERVER_ERROR,
    FILE_ERROR: ErrorCategory.FILE_ERROR,
    RATE_LIMIT_ERROR: ErrorCategory.RATE_LIMIT,
  };

  return categoryMap[errorCode] || ErrorCategory.SERVER_ERROR;
}

/**
 * Get error severity based on error code and status
 */
export function getErrorSeverity(
  errorCode: string,
  statusCode: number
): ErrorSeverity {
  // Critical errors
  if (statusCode >= 500) return ErrorSeverity.CRITICAL;

  // High severity errors
  if (["AUTH_ERROR", "FORBIDDEN_ERROR"].includes(errorCode)) {
    return ErrorSeverity.HIGH;
  }

  // Medium severity errors
  if (
    ["CONFLICT_ERROR", "BUSINESS_LOGIC_ERROR", "RATE_LIMIT_ERROR"].includes(
      errorCode
    )
  ) {
    return ErrorSeverity.MEDIUM;
  }

  // Low severity errors
  if (
    ["ZOD_VALIDATION_ERROR", "VALIDATION_ERROR", "NOT_FOUND_ERROR"].includes(
      errorCode
    )
  ) {
    return ErrorSeverity.LOW;
  }

  return ErrorSeverity.MEDIUM;
}

// ============================================================================
// USER-FRIENDLY MESSAGES
// ============================================================================

/**
 * Generate user-friendly error message
 */
export function getUserFriendlyMessage(error: ApiErrorResponse): string {
  const { code, message } = error.error;

  switch (code) {
    case "ZOD_VALIDATION_ERROR":
      return "Please check your input and try again.";

    case "VALIDATION_ERROR":
      return "The provided data is invalid. Please check your input.";

    case "AUTH_ERROR":
      return "Your session has expired. Please log in again.";

    case "FORBIDDEN_ERROR":
      return "You do not have permission to perform this action.";

    case "NOT_FOUND_ERROR":
      return "The requested item could not be found.";

    case "CONFLICT_ERROR":
      return "This action conflicts with existing data. Please try a different approach.";

    case "BUSINESS_LOGIC_ERROR":
      // Remove the prefix and return the business message
      return message.replace("BUSINESS_LOGIC_ERROR: ", "");

    case "DATABASE_ERROR":
      return "A database error occurred. Please try again later.";

    case "EXTERNAL_SERVICE_ERROR":
      return "An external service is temporarily unavailable. Please try again later.";

    case "FILE_ERROR":
      return "There was a problem with the file. Please check the file and try again.";

    case "RATE_LIMIT_ERROR":
      return "Too many requests. Please wait a moment and try again.";

    default:
      return "An unexpected error occurred. Please try again.";
  }
}

/**
 * Get detailed error message for developers
 */
export function getDetailedErrorMessage(error: ApiErrorResponse): string {
  const { message, code, statusCode, timestamp, details } = error.error;

  let detailedMessage = `${code} (${statusCode}): ${message}`;

  if (details) {
    detailedMessage += `\nDetails: ${JSON.stringify(details, null, 2)}`;
  }

  detailedMessage += `\nTimestamp: ${timestamp}`;

  return detailedMessage;
}

// ============================================================================
// ERROR RECOVERY
// ============================================================================

/**
 * Get error recovery suggestions
 */
export function getErrorRecoverySuggestions(error: ApiErrorResponse): string[] {
  const { code } = error.error;

  switch (code) {
    case "ZOD_VALIDATION_ERROR":
      return [
        "Check all required fields are filled",
        "Verify email format is correct",
        "Ensure phone number is valid",
        "Check date formats are correct",
      ];

    case "VALIDATION_ERROR":
      return [
        "Verify all input data is correct",
        "Check for special characters in fields",
        "Ensure numeric values are valid",
      ];

    case "AUTH_ERROR":
      return [
        "Log in again to refresh your session",
        "Check if your account is still active",
        "Clear browser cache and cookies",
      ];

    case "FORBIDDEN_ERROR":
      return [
        "Contact your administrator for access",
        "Check if you have the correct role",
        "Verify you are logged in with the right account",
      ];

    case "NOT_FOUND_ERROR":
      return [
        "Check if the item still exists",
        "Refresh the page to get latest data",
        "Navigate back to the main list",
      ];

    case "CONFLICT_ERROR":
      return [
        "Try using a different value",
        "Check if the item already exists",
        "Refresh the page and try again",
      ];

    case "BUSINESS_LOGIC_ERROR":
      return [
        "Review the business rules",
        "Check if all prerequisites are met",
        "Contact support if you need assistance",
      ];

    case "RATE_LIMIT_ERROR":
      return [
        "Wait a few minutes before trying again",
        "Reduce the frequency of your requests",
        "Try again during off-peak hours",
      ];

    case "FILE_ERROR":
      return [
        "Check file size and format",
        "Ensure file is not corrupted",
        "Try uploading a different file",
      ];

    default:
      return [
        "Try refreshing the page",
        "Check your internet connection",
        "Contact support if the problem persists",
      ];
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiErrorResponse): boolean {
  const { code, statusCode } = error.error;

  // Retryable errors
  const retryableCodes = [
    "DATABASE_ERROR",
    "EXTERNAL_SERVICE_ERROR",
    "RATE_LIMIT_ERROR",
  ];

  const retryableStatusCodes = [500, 502, 503, 504, 429];

  return (
    retryableCodes.includes(code) || retryableStatusCodes.includes(statusCode)
  );
}

/**
 * Get retry delay in milliseconds
 */
export function getRetryDelay(
  error: ApiErrorResponse,
  attempt: number
): number {
  const { code } = error.error;

  // Base delays by error type
  const baseDelays: Record<string, number> = {
    RATE_LIMIT_ERROR: 60000, // 1 minute
    DATABASE_ERROR: 2000, // 2 seconds
    EXTERNAL_SERVICE_ERROR: 5000, // 5 seconds
  };

  const baseDelay = baseDelays[code] || 2000;

  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 1000; // Add up to 1 second of jitter

  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
}

// ============================================================================
// VALIDATION ERROR HANDLING
// ============================================================================

/**
 * Format validation errors for display
 */
export function formatValidationErrors(error: ApiErrorResponse): Array<{
  field: string;
  message: string;
  fieldLabel?: string;
}> {
  const { details } = error.error;

  if (!details?.validationErrors) {
    return [];
  }

  return details.validationErrors.map((validationError: any) => ({
    field: validationError.field,
    message: validationError.message,
    fieldLabel: getFieldLabel(validationError.field),
  }));
}

/**
 * Get user-friendly field labels
 */
function getFieldLabel(fieldPath: string): string {
  const fieldLabels: Record<string, string> = {
    // Personal information
    "personal.firstName": "First Name",
    "personal.lastName": "Last Name",
    "personal.email": "Email Address",
    "personal.phone": "Phone Number",
    "personal.dob": "Date of Birth",
    "personal.gender": "Gender",
    "personal.bloodGroup": "Blood Group",
    "personal.nationalId": "National ID",
    "personal.address": "Address",

    // Medical information
    "medical.medicalHistory": "Medical History",
    "medical.orthopedicImplants": "Orthopedic Implants",
    "medical.extraCare": "Extra Care",
    "medical.hasInsurance": "Has Insurance",
    "medical.allergies": "Allergies",
    "medical.medications": "Current Medications",

    // Insurance information
    "insurance.insurerId": "Insurer",
    "insurance.insurerName": "Insurer Name",
    "insurance.coveragePercent": "Coverage Percentage",
    "insurance.approvalNumber": "Approval Number",
    "insurance.insurerCompany": "Insurance Company",
    "insurance.expiryDate": "Expiry Date",
    "insurance.referralAuth": "Referral Authorization",

    // Appointment information
    "appointment.startsAt": "Start Time",
    "appointment.endsAt": "End Time",
    "appointment.sessionType": "Session Type",
    "appointment.location": "Location",
    "appointment.noteEn": "Note (English)",
    "appointment.noteAr": "Note (Arabic)",

    // Payment information
    "payment.amountJd": "Amount (JOD)",
    "payment.method": "Payment Method",
    "payment.paidAt": "Payment Date",

    // Treatment plan information
    "plan.planType": "Plan Type",
    "plan.packageCode": "Package Code",
    "plan.totalSessions": "Total Sessions",
    "plan.remainingSessions": "Remaining Sessions",
    "plan.targetFreqPerWeek": "Target Frequency per Week",

    // File information
    "file.fileName": "File Name",
    "file.fileSize": "File Size",
    "file.mimeType": "File Type",

    // Common fields
    id: "ID",
    name: "Name",
    description: "Description",
    status: "Status",
    createdAt: "Created Date",
    updatedAt: "Updated Date",
  };

  return fieldLabels[fieldPath] || fieldPath;
}

// ============================================================================
// ERROR ACTIONS
// ============================================================================

/**
 * Check if error should trigger automatic logout
 */
export function shouldTriggerLogout(error: ApiErrorResponse): boolean {
  const { code, statusCode } = error.error;

  return (
    code === "AUTH_ERROR" ||
    statusCode === 401 ||
    (code === "FORBIDDEN_ERROR" && statusCode === 403)
  );
}

/**
 * Check if error should be logged to console
 */
export function shouldLogError(error: ApiErrorResponse): boolean {
  const { code, statusCode } = error.error;

  // Log all server errors and unexpected errors
  if (statusCode >= 500) return true;

  // Log authentication/authorization errors
  if (["AUTH_ERROR", "FORBIDDEN_ERROR"].includes(code)) return true;

  // Log business logic errors for debugging
  if (code === "BUSINESS_LOGIC_ERROR") return true;

  return false;
}

/**
 * Create error summary for logging
 */
export function createErrorSummary(
  error: ApiErrorResponse,
  context?: string
): {
  message: string;
  code: string;
  statusCode: number;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context?: string;
  timestamp: string;
  retryable: boolean;
} {
  return {
    message: error.error.message,
    code: error.error.code,
    statusCode: error.error.statusCode,
    category: categorizeError(error.error.code),
    severity: getErrorSeverity(error.error.code, error.error.statusCode),
    context,
    timestamp: error.error.timestamp,
    retryable: isRetryableError(error),
  };
}

// ============================================================================
// ERROR LOGGING
// ============================================================================

/**
 * Log error with appropriate level
 */
export function logError(error: ApiErrorResponse, context?: string): void {
  const summary = createErrorSummary(error, context);

  if (shouldLogError(error)) {
    console.error("API Error:", {
      ...summary,
      details: error.error.details,
      stack: error.error.stack,
    });
  } else {
    console.warn("API Error:", summary);
  }
}

/**
 * Log error with user context
 */
export function logErrorWithContext(
  error: ApiErrorResponse,
  context: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, any>;
  }
): void {
  const summary = createErrorSummary(error, context.component);

  const logData = {
    ...summary,
    userContext: {
      userId: context.userId,
      action: context.action,
      component: context.component,
      ...context.additionalData,
    },
    details: error.error.details,
    stack: error.error.stack,
  };

  if (shouldLogError(error)) {
    console.error("API Error with Context:", logData);
  } else {
    console.warn("API Error with Context:", logData);
  }
}

// ============================================================================
// ERROR TRANSFORMATION
// ============================================================================

/**
 * Transform error to a format suitable for UI display
 */
export function transformErrorForUI(error: ApiErrorResponse): {
  title: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  suggestions: string[];
  validationErrors?: Array<{
    field: string;
    message: string;
    fieldLabel?: string;
  }>;
  retryable: boolean;
  retryDelay?: number;
} {
  const category = categorizeError(error.error.code);
  const severity = getErrorSeverity(error.error.code, error.error.statusCode);

  return {
    title: getErrorTitle(error.error.code),
    message: getUserFriendlyMessage(error),
    category,
    severity,
    suggestions: getErrorRecoverySuggestions(error),
    validationErrors: formatValidationErrors(error),
    retryable: isRetryableError(error),
    retryDelay: isRetryableError(error) ? getRetryDelay(error, 1) : undefined,
  };
}

/**
 * Get error title based on error code
 */
function getErrorTitle(errorCode: string): string {
  const titleMap: Record<string, string> = {
    ZOD_VALIDATION_ERROR: "Validation Error",
    VALIDATION_ERROR: "Invalid Data",
    AUTH_ERROR: "Authentication Required",
    FORBIDDEN_ERROR: "Access Denied",
    NOT_FOUND_ERROR: "Not Found",
    CONFLICT_ERROR: "Conflict",
    BUSINESS_LOGIC_ERROR: "Business Rule Violation",
    DATABASE_ERROR: "Database Error",
    EXTERNAL_SERVICE_ERROR: "Service Unavailable",
    FILE_ERROR: "File Error",
    RATE_LIMIT_ERROR: "Rate Limit Exceeded",
  };

  return titleMap[errorCode] || "Error";
}
