import { useState, useEffect, useCallback } from "react";
import { usersApi } from "../../../../api/users";
import type { AppUser, UsersListParams } from "../../../../api/users";

interface UseUsersResult {
  users: AppUser[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing users data
 * Handles loading states, error handling, and automatic refetching
 */
export const useUsers = (filters: UsersListParams): UseUsersResult => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.list(filters);
      setUsers(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.role, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    total,
    refetch: fetchUsers,
  };
};


