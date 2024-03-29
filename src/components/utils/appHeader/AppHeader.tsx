import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SyntheticEvent, useState } from 'react';
import { is2xxStatus, logout } from '../../../services/api';
import Loading from '../loading/Loading';
import style from './style.module.scss';
import { CgDetailsMore } from 'react-icons/cg';
import { IoMdExit } from 'react-icons/io';

export default function AppHeader(props: { useSticky?: boolean; unAuthenticated?: boolean }): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDrawer = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseDrawer = (): void => setAnchorEl(null);
  const handleLogout = async () => {
    setIsLoading(true);
    const { status } = await logout();
    if (is2xxStatus(status)) return window.location.reload();
    alert('There was issue with that request. Try refreshing the page.');
    setIsLoading(false);
  };
  return (
    <Box id="appHeaderContainer" sx={{ flexGrow: 1 }} className={`appHeaderContainer ${style.appHeaderContainer}`}>
      <AppBar position={props.useSticky ? 'sticky' : 'fixed'} className={style.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button href="/" className={style.homePageLink}>
              MY LISTS
            </Button>
          </Typography>
          {!props.unAuthenticated && (
            <IconButton color="inherit" onClick={handleOpenDrawer}>
              <CgDetailsMore className={style.menuIcon} />
            </IconButton>
          )}
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
        <MenuItem onClick={handleLogout} className={style.logoutMenuItem}>
          <ListItemIcon>
            <IoMdExit />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      <Loading isLoading={isLoading} />
    </Box>
  );
}
