import { AlertsReducerActions } from '../store/alerts';
import { Dispatch } from 'redux';

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

export interface AlertFactoryOptions {
  isFailedAlert?: boolean;
  dialogTitle?: string;
  dialogContentText: string;
  dialogCloseText?: string;
}

export function alertFactory(options: AlertFactoryOptions, dispatch: Dispatch): () => void {
  const failedAlertTitle = options.dialogTitle ?? 'Action Failed';
  return () => {
    const dispatchAction: AlertsReducerActions = {
      type: 'useAlert',
      data: {
        isOpen: true,
        ...options,
        dialogTitle: options.isFailedAlert ? failedAlertTitle : options.dialogTitle,
      },
    };
    dispatch(dispatchAction);
  };
}
