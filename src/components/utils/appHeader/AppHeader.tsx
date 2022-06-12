import { IconButton, Link, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SyntheticEvent, useState } from 'react';
import { BiMoviePlay, CgDetailsMore, ImBooks, ImExit, IoGameControllerSharp, IoMdPaper } from 'react-icons/all';
import { useLocation } from 'react-router-dom';
import { is2xxStatus, logout } from '../../../services/api';
import Loading from '../loading/Loading';
import style from './style.module.scss';

const pageTypes = {
  '/': 'Movies & Shows',
  '/books': 'Books',
  '/games': 'Video Games',
  '/shopping': 'Shopping',
};

export default function AppHeader(props: { useSticky?: boolean; unAuthenticated?: boolean }): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const currentPageDescription = pageTypes[location.pathname];

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
            {!props.unAuthenticated && currentPageDescription && (
              <Typography component="span" sx={{ flexGrow: 1 }}>
                {' | '}
                {currentPageDescription}
              </Typography>
            )}
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
      <Loading isLoading={isLoading} />
    </Box>
  );
}
