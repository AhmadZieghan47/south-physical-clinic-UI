import type { LoginResponse, AuthUser } from "../types/auth";
import { storage } from "./storage";

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export function saveAuth(data: LoginResponse) {
  storage.set(TOKEN_KEY, data.token);
  storage.set(USER_KEY, data.user);
}

export function getToken(): string | null {
  return storage.get<string>(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  return storage.get<AuthUser>(USER_KEY);
}

export function clearAuth() {
  storage.remove(TOKEN_KEY);
  storage.remove(USER_KEY);
}

// --- Optional: tiny JWT helpers (no extra lib needed)
type JwtPayload = { exp?: number; iat?: number; [k: string]: unknown };

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isExpired(token: string, skewSec = 30): boolean {
  const payload = parseJwt(token);
  if (!payload?.exp) return false; // if no exp, treat as non-expiring
  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp - skewSec;
}
