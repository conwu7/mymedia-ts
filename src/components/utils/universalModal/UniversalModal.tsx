import { Fade, IconButton, SwipeableDrawer } from '@mui/material';
import Box from '@mui/material/Box';
import { MdOutlineClose } from 'react-icons/all';
import style from './style.module.scss';
import { UniversalModalProps } from './types';
import Modal from '@mui/material/Modal';

export function UniversalDrawer({ isOpen, onClose, children, title }: UniversalModalProps): JSX.Element {
  return (
    <SwipeableDrawer
      open={isOpen}
      onClose={onClose}
      onOpen={() => undefined}
      anchor="bottom"
      className={style.drawer}
      disableDiscovery={true}
      disableSwipeToOpen={true}
      variant="temporary"
    >
      <Box className={style.drawerContainer}>
        <Box className={style.modalHeader}>
          <header className={style.modalTitle}>{title}</header>
          <IconButton className={style.closeModalButtonWrapper} onClick={onClose}>
            <MdOutlineClose />
          </IconButton>
        </Box>
        <Box className={style.modalContentContainer}>{children}</Box>
      </Box>
    </SwipeableDrawer>
  );
}

export function UniversalModal({ isOpen, onClose, children, title }: UniversalModalProps): JSX.Element {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      // keepMounted
      // // closeAfterTransition
      // BackdropProps={{
      //   timeout: 200,
      // }}
    >
      <Fade in={isOpen}>
        <Box className={style.modalContainer}>
          <Box className={style.modalHeader}>
            <header className={style.modalTitle}>{title}</header>
            <IconButton className={style.closeModalButtonWrapper} onClick={onClose}>
              <MdOutlineClose />
            </IconButton>
          </Box>
          <Box className={style.modalContentContainer}>{children}</Box>
        </Box>
      </Fade>
    </Modal>
  );
}
