// Enhanced API Index
// This file provides a centralized export of all enhanced API functions

// Core API client
export {
  enhancedApi,
  createEnhancedApi,
  createModuleApi,
  type ApiRequestConfig,
  type ApiResponse,
} from "../lib/enhancedApi";

// Import for internal use
import { createModuleApi, enhancedApi } from "../lib/enhancedApi";

// Enhanced API modules
export * from "./enhancedPatients";
export * from "./enhancedAppointments";
export * from "./payments";
export * from "./expenses";
export * from "./expenseCategories";
export * from "./overbookingQueue";

// Re-export original APIs for backward compatibility
export { api } from "../lib/api";
export { getApi } from "../services/authService";

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

// Create specialized API clients for common use cases
export const createPatientsApi = () => createModuleApi("PatientsModule");
export const createAppointmentsApi = () =>
  createModuleApi("AppointmentsModule");
export const createDoctorsApi = () => createModuleApi("DoctorsModule");
export const createPaymentsApi = () => createModuleApi("PaymentsModule");
export const createInsurersApi = () => createModuleApi("InsurersModule");

// ============================================================================
// API CLIENT FACTORY
// ============================================================================

export interface ApiClientConfig {
  module: string;
  retryable?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

export function createApiClient(config: ApiClientConfig) {
  return createModuleApi(config.module, {
    retryable: config.retryable ?? true,
    maxRetries: config.maxRetries ?? 3,
    retryDelay: config.retryDelay ?? 1000,
    timeout: config.timeout ?? 10000,
  });
}

// ============================================================================
// COMMON API PATTERNS
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ExportOptions {
  format: "csv" | "excel" | "pdf";
  filters?: Record<string, any>;
}

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

export function isNotFoundError(error: any): boolean {
  return error?.error?.code === "NOT_FOUND_ERROR";
}

export function isValidationError(error: any): boolean {
  return error?.error?.code === "ZOD_VALIDATION_ERROR";
}

export function isConflictError(error: any): boolean {
  return error?.error?.code === "CONFLICT_ERROR";
}

export function isAuthError(error: any): boolean {
  return (
    error?.error?.code === "AUTH_ERROR" ||
    error?.error?.code === "FORBIDDEN_ERROR"
  );
}

export function isBusinessLogicError(error: any): boolean {
  return error?.error?.code === "BUSINESS_LOGIC_ERROR";
}

export function isNetworkError(error: any): boolean {
  return error?.error?.code === "NETWORK_ERROR" || !error?.error;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default enhancedApi;
