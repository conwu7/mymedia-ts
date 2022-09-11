export interface AlertDialogProps {
  onClose: () => void;
  onAccept: () => void;
  isOpen: boolean;
  dialogTitle?: string;
  dialogContentText: string;
  dialogOkText?: string;
  dialogCloseText?: string;
}

export interface AlertBoxProps {
  onClose: () => void;
  isOpen: boolean;
  isFailedAlert?: boolean;
  dialogTitle?: string;
  dialogContentText: string;
  dialogCloseText?: string;
}
