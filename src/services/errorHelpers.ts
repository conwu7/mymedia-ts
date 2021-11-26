// eslint-disable-next-line
type Callback = (...args: any[]) => void;

export function handleApiErrors(
  err: string,
  setError?: Callback,
  setLoading?: Callback,
  otherCallback?: Callback,
): void {
  if (!err) return;

  if (setError) setError(err);

  if (setLoading) setLoading(false);

  if (otherCallback) otherCallback();
}

export function alertFactory(message?: string): () => void {
  return () => window.alert(message || 'Failed');
}
