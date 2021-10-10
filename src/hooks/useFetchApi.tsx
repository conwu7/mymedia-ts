import { useEffect, useState } from 'react';
import { ApiResponse } from '../services/types';

type AsyncValues = {
  isLoading: boolean;
  error: string | null;
  data: unknown;
};

export default function useFetchApi(
  asyncFunc: ({ signal }: { signal: AbortSignal }) => Promise<ApiResponse>,
): AsyncValues {
  const [isLoading, setIsLoading] = useState(false);
  const [isFunctionPending, setIsFunctionPending] = useState(false);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFunctionPending || data) return;
    setIsFunctionPending(true);
    const controller = new AbortController();
    setIsLoading(true);
    setTimeout(() => {
      asyncFunc({ signal: controller.signal })
        .then((response) => {
          if (response.status !== 200) {
            console.log('HERE');
            setError(response.err);
            return;
          }
          setData(response.result);
        })
        .catch(() => undefined)
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
    // return () => clearTimeout(fetchTimeout);
    // return () => {
    //   controller.abort();
    // };
  }, [isFunctionPending, data]);

  return {
    isLoading,
    data,
    error,
  };
}
