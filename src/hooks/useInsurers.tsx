import { useState, useEffect } from 'react';
import { getInsurers } from '../api/insurers';
import type { Insurer } from '../types/typedefs';

export function useInsurers() {
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInsurers();
        setInsurers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch insurers');
        console.error('Error fetching insurers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurers();
  }, []);

  return { insurers, loading, error };
}
