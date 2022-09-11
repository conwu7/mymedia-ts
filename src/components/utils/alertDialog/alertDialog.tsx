import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AlertBoxProps, AlertDialogProps } from './types';
import ErrorIcon from '@mui/icons-material/Error';
import style from './style.module.scss';

export default function AlertDialog(props: AlertDialogProps): JSX.Element {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.dialogContentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.dialogCloseText ?? 'Close'}</Button>
        <Button onClick={props.onAccept} autoFocus>
          {props.dialogOkText ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function AlertBox(props: AlertBoxProps): JSX.Element {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
      <DialogContent className={style.dialogContentContainer}>
        {props.isFailedAlert && <ErrorIcon className={style.errorIcon} />}
        <DialogContentText id="alert-dialog-description">{props.dialogContentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.dialogCloseText ?? 'Close'}</Button>
      </DialogActions>
    </Dialog>
  );
}
