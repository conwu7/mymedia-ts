import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import style from './style.module.scss';
import { LoadingProps } from './types';

export default function Loading({ isLoading }: LoadingProps): JSX.Element {
  return (
    <Modal open={isLoading}>
      <Box className={style.loadingContainer}>
        <CircularProgress color="secondary" size={80} />
      </Box>
    </Modal>
  );
}
