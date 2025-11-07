import { useState, useEffect, useCallback } from 'react';
import { enumLabelsApi } from '../../../../api/enumLabels';
import type { EnumLabel, EnumLabelsListParams } from '../../../../api/enumLabels';
import type { EnumLabelFilters } from '../../../../types/enumLabel';

interface UseEnumLabelsResult {
  enumLabels: EnumLabel[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing enum labels data
 * Handles loading states, error handling, and automatic refetching
 */
export const useEnumLabels = (filters: EnumLabelFilters): UseEnumLabelsResult => {
  const [enumLabels, setEnumLabels] = useState<EnumLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchEnumLabels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert EnumLabelFilters to EnumLabelsListParams
      const params: EnumLabelsListParams = {
        enumType: filters.enumType || undefined,
        search: filters.search || undefined,
        page: filters.page,
        pageSize: filters.pageSize
      };
      const response = await enumLabelsApi.list(params);
      
      // API wrapper normalizes response to paginated format
      setEnumLabels(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching enum labels:', err);
      setError(err as Error);
      setEnumLabels([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters.enumType, filters.search, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchEnumLabels();
  }, [fetchEnumLabels]);

  return {
    enumLabels,
    loading,
    error,
    total,
    refetch: fetchEnumLabels
  };
};

