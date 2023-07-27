import { Fade, IconButton, SwipeableDrawer } from '@mui/material';
import Box from '@mui/material/Box';
import style from './style.module.scss';
import { UniversalModalProps } from './types';
import Modal from '@mui/material/Modal';
import * as REACT_MATERIAL_COLORS from '@mui/material/colors';
import { hexToRgbA } from '../../../services/colors';
import { MdOutlineClose } from 'react-icons/md';

export function UniversalDrawer(props: UniversalModalProps): JSX.Element {
  return (
    <SwipeableDrawer
      open={props.isOpen}
      onClose={props.onClose}
      onOpen={() => undefined}
      anchor="bottom"
      className={style.drawer}
      disableDiscovery={true}
      disableSwipeToOpen={true}
      variant="temporary"
    >
      <Box className={style.drawerContainer}>
        <Box
          className={style.modalHeader}
          style={{
            backgroundColor:
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              hexToRgbA(REACT_MATERIAL_COLORS[props.style?.contentContainerBackgroundColor]?.[50], 1) ?? 'whitesmoke',
          }}
        >
          <header className={style.modalTitle}>{props.title}</header>
          <IconButton className={style.closeModalButtonWrapper} onClick={props.onClose}>
            <MdOutlineClose />
          </IconButton>
        </Box>
        <Box
          className={style.modalContentContainer}
          style={{
            backgroundColor:
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              hexToRgbA(REACT_MATERIAL_COLORS[props.style?.contentContainerBackgroundColor]?.[50], 0.3) ?? 'white',
          }}
        >
          {props.children}
        </Box>
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
