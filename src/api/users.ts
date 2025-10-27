import { getApi } from "../services/authService";

export type UserRole = "ADMIN" | "MANAGER" | "RECEPTION" | "THERAPIST";

export interface AppUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  whatsappNumber: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  data: AppUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UsersListParams {
  search?: string;
  role?: UserRole;
  page?: number;
  pageSize?: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: UserRole;
  whatsappNumber?: string | null;
  isActive?: boolean;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  username?: string;
  role?: UserRole;
  whatsappNumber?: string | null;
  isActive?: boolean;
}

export interface ResetPasswordData {
  newPassword: string;
}

export const usersApi = {
  /**
   * List users with optional filters and pagination
   */
  list: async (params: UsersListParams = {}): Promise<UsersListResponse> => {
    const api = getApi();
    const response = await api.get<UsersListResponse>("/app-users", { params });
    return response.data;
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: string): Promise<AppUser> => {
    const api = getApi();
    const response = await api.get<AppUser>(`/app-users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  create: async (data: CreateUserData): Promise<AppUser> => {
    const api = getApi();
    const response = await api.post<AppUser>("/app-users", data);
    return response.data;
  },

  /**
   * Update an existing user
   */
  update: async (id: string, data: UpdateUserData): Promise<AppUser> => {
    const api = getApi();
    const response = await api.patch<AppUser>(`/app-users/${id}`, data);
    return response.data;
  },

  /**
   * Reset user password
   */
  resetPassword: async (id: string, data: ResetPasswordData): Promise<{ message: string }> => {
    const api = getApi();
    const response = await api.post<{ message: string }>(`/app-users/${id}/reset-password`, data);
    return response.data;
  },

  /**
   * Deactivate a user (soft delete)
   */
  deactivate: async (id: string): Promise<void> => {
    const api = getApi();
    await api.delete(`/app-users/${id}`);
  },
};

