import { useState, useEffect, useCallback } from 'react';
import { enumLabelsApi } from '../../../../api/enumLabels';
import type { EnumLabel } from '../../../../api/enumLabels';

interface EnumTypeInfo {
  type: string;
  count: number;
  color: string;
}

interface UseEnumTypesResult {
  enumTypes: EnumTypeInfo[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing enum types
 * Groups enum labels by type and provides count
 */
export const useEnumTypes = (): UseEnumTypesResult => {
  const [enumTypes, setEnumTypes] = useState<EnumTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnumTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all enum labels with reasonable page size
      const response = await enumLabelsApi.list({ pageSize: 100 });
      
      // API wrapper normalizes response to paginated format
      const labels = response.data || [];
      
      // Group by enumType and count
      const typeMap = new Map<string, number>();
      labels.forEach((label: EnumLabel) => {
        const count = typeMap.get(label.enumType) || 0;
        typeMap.set(label.enumType, count + 1);
      });

      // Convert to array with color coding
      const types: EnumTypeInfo[] = Array.from(typeMap.entries()).map(([type, count]) => ({
        type,
        count,
        color: getTypeColor(type)
      }));

      // Sort by type name
      types.sort((a, b) => a.type.localeCompare(b.type));

      setEnumTypes(types);
    } catch (err) {
      console.error('Error fetching enum types:', err);
      setError(err as Error);
      setEnumTypes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnumTypes();
  }, [fetchEnumTypes]);

  return {
    enumTypes,
    loading,
    error,
    refetch: fetchEnumTypes
  };
};

/**
 * Get color for enum type
 */
function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    SessionType: '#1E40AF',
    Location: '#059669',
    ApptStatus: '#EA580C',
    CancelReason: '#DC2626',
    Gender: '#7C3AED',
    Role: '#0891B2',
    PriceBasis: '#65A30D'
  };

  return colorMap[type] || '#6B7280';
}

