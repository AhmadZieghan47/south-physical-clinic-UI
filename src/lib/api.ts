// Simplified API Configuration
// This file provides a clean API instance that uses the centralized auth service

import { getApi } from '../services/authService';

// Export the authenticated API instance
export const api = getApi();

// Export default for backward compatibility
export default api;