import { ApiConfig } from './apiConfig';
import { AuthHelperTokenManager } from './tokenManager';

// Create API instance with custom token manager
const apiConfig = ApiConfig.getInstance(new AuthHelperTokenManager());
export default apiConfig.getApi();

// Export types for better TypeScript support
export type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from './apiConfig';
