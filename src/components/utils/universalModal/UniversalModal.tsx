import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { IconButton } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import style from './style.module.scss';
import { UniversalModalProps } from './types';

export default function UniversalModal({ isOpen, onClose, children, title }: UniversalModalProps): JSX.Element {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box className={style.modalContainer}>
          <Box className={style.modalHeader}>
            <header className={style.modalTitle}>{title}</header>
            <IconButton className={style.closeModalButtonWrapper} onClick={onClose}>
              <CancelPresentationIcon color="action" />
            </IconButton>
          </Box>
          <Box className={style.modalContentContainer}>{children}</Box>
        </Box>
      </Fade>
    </Modal>
  );
}
