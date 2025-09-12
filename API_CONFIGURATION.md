# Cross-Repository Axios Configuration

This configuration provides a centralized, reusable axios setup that can be shared across multiple repositories.

## Files Overview

- **`src/lib/apiConfig.ts`** - Main configuration class with singleton pattern
- **`src/lib/tokenManager.ts`** - Custom token manager implementation
- **`src/lib/api.ts`** - Main API instance export
- **`src/lib/authHelper.ts`** - Existing authentication helper functions

## Features

✅ **Centralized Configuration** - Single source of truth for API settings  
✅ **Token Management** - Automatic token attachment and expiration handling  
✅ **Error Handling** - Global error interceptors for auth and network errors  
✅ **TypeScript Support** - Full type definitions included  
✅ **Cross-Repository Ready** - Easy to copy and adapt to other projects  
✅ **Customizable** - Token manager can be swapped for different auth strategies

## Usage

### Basic Usage

```typescript
import api from "./lib/api";

// All requests automatically include auth token
const response = await api.get("/patients");
const data = await api.post("/patients", patientData);
```

### Custom Token Manager

```typescript
import { ApiConfig } from "./lib/apiConfig";

class CustomTokenManager implements TokenManager {
  getToken(): string | null {
    // Your custom token retrieval logic
    return customGetToken();
  }

  clearAuth(): void {
    // Your custom auth clearing logic
    customClearAuth();
  }

  isExpired?(token: string): boolean {
    // Your custom expiration check
    return customIsExpired(token);
  }
}

const apiConfig = ApiConfig.getInstance(new CustomTokenManager());
export const api = apiConfig.getApi();
```

## Environment Variables

Set the following environment variable in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Migration from Old Configurations

The following files have been consolidated:

- ❌ `src/api/axiosClient.ts` (deleted)
- ❌ `src/lib/authApi.ts` (deleted)
- ❌ `src/core/net/api.ts` (deleted)
- ✅ `src/lib/api.ts` (new centralized)

All imports have been updated to use the new centralized configuration.

## Cross-Repository Setup

To use this configuration in another repository:

1. Copy the following files:

   - `src/lib/apiConfig.ts`
   - `src/lib/tokenManager.ts` (adapt to your auth system)
   - `src/lib/api.ts`

2. Adapt the token manager to your authentication system
3. Update environment variables
4. Import and use: `import api from './lib/api'`

## Error Handling

The configuration automatically handles:

- **401/403 errors** - Clears auth and redirects to login
- **Network errors** - Logs to console
- **Server errors (5xx)** - Logs to console
- **Token expiration** - Clears auth and redirects to login

## Configuration Options

The `ApiConfig` class supports:

- Custom base URL
- Custom headers
- Request/response interceptors
- Timeout settings
- Credentials handling
- Custom token managers
