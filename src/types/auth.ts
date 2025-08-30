// src/types/auth.ts
export type Role = "ADMIN" | "MANAGER" | "RECEPTION" | "THERAPIST" | string;

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: Role;
}

export interface LoginResponse {
  token: string; // JWT
  user: AuthUser;
}
