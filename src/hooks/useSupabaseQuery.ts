import { useState, useEffect } from 'react';

// This hook can fetch any data type (T) using a provided async function.
export function useSupabaseQuery<T>({
  queryKey,
  queryFn,
}: {
  // A key that, when changed, triggers a refetch (e.g., seasonId).
  queryKey: string | undefined | null;
  // The async function that fetches the data.
  queryFn: (key: string) => Promise<T>;
}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Do not fetch if the key (e.g., seasonId) is not available.
    if (!queryKey) {
      setIsLoading(false);
      setData(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await queryFn(queryKey);
        setData(result);
      } catch (err) {
        console.error("Query failed:", err);
        setError(err as Error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [queryKey, queryFn]); // Re-run effect if queryKey or queryFn changes.

  return { data, isLoading, error };
}