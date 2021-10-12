import Grid from '@mui/material/Grid';
import style from './style.module.scss';
import { ErrorFieldContainerProps } from './types';

export default function ErrorFieldContainer({ showError, errorMessage }: ErrorFieldContainerProps): JSX.Element | null {
  if (!showError || !errorMessage) return null;
  return (
    <Grid item className={style.errorContainer}>
      <span>{errorMessage}</span>
    </Grid>
  );
}
