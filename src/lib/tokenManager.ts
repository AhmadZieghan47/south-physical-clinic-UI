import { clearAuth, getToken, isExpired } from "./authHelper";
import type { TokenManager } from "./apiConfig";

// Custom token manager that integrates with existing authHelper
export class AuthHelperTokenManager implements TokenManager {
  getToken(): string | null {
    return getToken();
  }

  clearAuth(): void {
    clearAuth();
  }

  isExpired(token: string): boolean {
    return isExpired(token);
  }
}
