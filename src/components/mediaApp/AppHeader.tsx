import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import style from './style.module.scss';

export default function AppHeader(): JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }} className={style.appHeaderContainer}>
      <AppBar position="fixed" className={style.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" className={style.homePageLink}>
              My Media Lists
            </Link>
          </Typography>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
