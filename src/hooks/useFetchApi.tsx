import { useEffect, useState } from 'react';
import { ApiResponse } from '../services/types';

export default function useFetchApi<DataType, FuncArguments = unknown>(
  asyncFunc: ({ signal }: { signal?: AbortSignal }, asyncFuncArgs: FuncArguments) => Promise<ApiResponse>,
  funcArguments: FuncArguments,
): { isLoading: boolean; error: string | null; data: DataType } {
  const [isLoading, setIsLoading] = useState(true);
  const [isFunctionPending, setIsFunctionPending] = useState(false);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFunctionPending || data) return;
    setIsFunctionPending(true);
    const controller = new AbortController();
    setIsLoading(true);
    setTimeout(() => {
      asyncFunc({ signal: controller.signal }, funcArguments)
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
    }, 500);
    // return () => clearTimeout(fetchTimeout);
    // return () => {
    //   controller.abort();
    // };
  }, [isFunctionPending, data]);

  return {
    isLoading,
    data: data as DataType,
    error,
  };
}
