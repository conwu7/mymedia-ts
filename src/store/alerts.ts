export interface Alerts {
  isOpen: boolean;
  isFailedAlert?: boolean;
  dialogTitle?: string;
  dialogContentText: string;
  dialogCloseText?: string;
}

const initialState: Alerts = {
  isOpen: false,
  isFailedAlert: false,
  dialogContentText: '',
};

export interface AlertsReducerActions {
  type: 'useAlert' | 'close';
  data?: Alerts;
}

const alertsReducer = (state: Alerts = initialState, action: AlertsReducerActions): Alerts => {
  if (action.type === 'useAlert' && action.data) {
    return action.data;
  } else {
    return {
      ...state,
      isOpen: false,
    };
  }
};

export default alertsReducer;
