import { useState, useEffect, useCallback } from 'react';
import { diagnosesApi } from '../../../../api/diagnoses';
import type { Diagnosis, DiagnosesListParams } from '../../../../api/diagnoses';
import type { DiagnosesFilters } from '../../../../types/diagnosis';

interface UseDiagnosesResult {
  diagnoses: Diagnosis[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing diagnoses data
 * Handles loading states, error handling, and automatic refetching
 */
export const useDiagnoses = (filters: DiagnosesFilters): UseDiagnosesResult => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchDiagnoses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert DiagnosesFilters to DiagnosesListParams (null to undefined)
      const params: DiagnosesListParams = {
        search: filters.search || undefined,
        category: filters.category || undefined,
        isActive: filters.isActive === null ? undefined : filters.isActive,
        page: filters.page,
        pageSize: filters.pageSize
      };
      const response = await diagnosesApi.list(params);
      setDiagnoses(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('Error fetching diagnoses:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.category, filters.isActive, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchDiagnoses();
  }, [fetchDiagnoses]);

  return {
    diagnoses,
    loading,
    error,
    total,
    refetch: fetchDiagnoses
  };
};

