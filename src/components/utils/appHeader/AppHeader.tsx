import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Link, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SyntheticEvent, useState } from 'react';
import { BiMoviePlay, ImBooks, ImExit, IoGameControllerSharp, IoMdPaper } from 'react-icons/all';
import { logout } from '../../../services/api';
import style from './style.module.scss';

export default function AppHeader(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenDrawer = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseDrawer = (): void => setAnchorEl(null);
  const handleLogout = async () => {
    if (!window.confirm('Are you sure?')) return;
    const { status } = await logout();
    if (status === 200) return window.location.reload();
    alert('There was issue with that request');
  };
  return (
    <Box sx={{ flexGrow: 1 }} className={style.appHeaderContainer}>
      <AppBar position="fixed" className={style.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" className={style.homePageLink}>
              My Media Lists
            </Link>
          </Typography>
          <IconButton color="inherit" onClick={handleOpenDrawer}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        id="appHeaderActionMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseDrawer}
        MenuListProps={{
          'aria-labelledby': 'appHeaderActionMenu',
        }}
      >
        <MenuItem onClick={undefined} divider>
          <ListItemIcon>
            <BiMoviePlay />
          </ListItemIcon>
          <ListItemText>
            <Link href="#">Movies & Shows</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={undefined} divider>
          <ListItemIcon>
            <ImBooks />
          </ListItemIcon>
          <ListItemText>
            <Link href="#">Books</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={undefined} divider>
          <ListItemIcon>
            <IoGameControllerSharp />
          </ListItemIcon>
          <ListItemText>
            <Link href="#">Video Games</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={undefined} divider>
          <ListItemIcon>
            <IoMdPaper />
          </ListItemIcon>
          <ListItemText>
            <Link href="#">Shopping</Link>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout} className={style.logoutMenuItem}>
          <ListItemIcon>
            <ImExit />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
