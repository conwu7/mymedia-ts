import { IconButton, SwipeableDrawer } from '@mui/material';
import Box from '@mui/material/Box';
import { MdOutlineClose } from 'react-icons/all';
import style from './style.module.scss';
import { UniversalModalProps } from './types';

export default function UniversalModal({ isOpen, onClose, children, title }: UniversalModalProps): JSX.Element {
  return (
    <SwipeableDrawer open={isOpen} onClose={onClose} onOpen={() => undefined} anchor="bottom" className={style.drawer}>
      <Box className={style.modalContainer}>
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
