import { useEffect, useState } from 'react';
import { ApiResponse } from '../services/types';
import { is2xxStatus } from '../services/api';

export default function useFetchApi<DataType, FuncArguments = unknown>(
  useTimeout: boolean,
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
    setTimeout(
      () => {
        asyncFunc({ signal: controller.signal }, funcArguments)
          .then((response) => {
            if (!is2xxStatus(response.status)) {
              setError(response.err);
              return;
            }
            setData(response.result);
          })
          .catch(() => undefined)
          .finally(() => {
            setIsLoading(false);
          });
      },
      useTimeout ? 300 : 0,
    );
  }, [isFunctionPending, data]);

  return {
    isLoading,
    data: data as DataType,
    error,
  };
}
