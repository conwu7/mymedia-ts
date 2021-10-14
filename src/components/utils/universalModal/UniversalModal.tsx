import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import style from './style.module.scss';
import { UniversalModalProps } from './types';

export default function UniversalModal({ isOpen, onClose, children, title }: UniversalModalProps): JSX.Element {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={style.modalContainer}>
        <Box className={style.modalHeader}>
          <header className={style.modalTitle}>{title}</header>
          <IconButton className={style.closeModalButtonWrapper} onClick={onClose}>
            <CancelPresentationIcon color="action" />
          </IconButton>
        </Box>
        <Box className={style.modalContentContainer}>{children}</Box>
      </Box>
    </Modal>
  );
}
