import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import { SyntheticEvent, useEffect, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { IoMdCreate } from 'react-icons/io';
import { MdFilterList, MdReadMore, MdRoomPreferences } from 'react-icons/md';
import { RiMovie2Line, RiSearchLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import useFetchApi from '../../hooks/useFetchApi';
import { getLists, getUserMedia } from '../../services/api';
import { ListCategory } from '../../services/types';
import { List } from '../../store/lists';
import { UserMovie, UserTvShow } from '../../store/userMedia';
import { User } from '../app/types';
import AppHeader from '../utils/appHeader/AppHeader';
import Loading from '../utils/loading/Loading';
import UniversalModal from '../utils/universalModal/UniversalModal';
import { NewListForm } from './listsPage/forms/forms';
import ListsPage from './listsPage/ListsPage';
import style from './style.module.scss';
import { BottomNavigationProps, NavigationTab } from './types';

export default function MediaApp({ user }: { user: User }): JSX.Element {
  const [currentNavTab, setCurrentNavTab] = useState<NavigationTab>('towatch');
  const { isLoading, error, data } = useFetchApi<List, ListCategory>(true, getLists, 'towatch');
  const {
    isLoading: isLoadingTv,
    error: errorTv,
    data: dataTv,
  } = useFetchApi<List, ListCategory>(true, getLists, 'towatchtv');
  const {
    isLoading: isLoadingUserMedia,
    error: errorUserMedia,
    data: dataUserMedia,
  } = useFetchApi<UserMovie[], ListCategory>(true, getUserMedia, 'towatch');
  const {
    isLoading: isLoadingUserMediaTv,
    error: errorUserMediaTv,
    data: dataUserMediaTv,
  } = useFetchApi<UserTvShow[], ListCategory>(true, getUserMedia, 'towatchtv');

  const dispatch: Dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'storeUserPreferences',
      data: user,
    });
  }, [user]);

  // store movies
  useEffect(() => {
    if (isLoading || error) return;
    dispatch({
      type: 'storeList',
      listType: 'towatch',
      data: data || [],
    });
  }, [isLoading, data]);

  // store tv shows
  useEffect(() => {
    if (isLoadingTv || errorTv) return;
    dispatch({
      type: 'storeList',
      listType: 'towatchtv',
      data: dataTv || [],
    });
  }, [isLoadingTv, dataTv]);

  // store user movies
  useEffect(() => {
    if (isLoadingUserMedia || errorUserMedia) return;
    dispatch({
      type: 'storeUserMedia',
      listType: 'towatch',
      data: dataUserMedia || [],
    });
  }, [isLoadingUserMedia, errorUserMedia, dataUserMedia]);

  // store user tv shows
  useEffect(() => {
    if (isLoadingUserMediaTv || errorUserMediaTv) return;
    dispatch({
      type: 'storeUserMedia',
      listType: 'towatchtv',
      data: dataUserMediaTv || [],
    });
  }, [isLoadingUserMediaTv, errorUserMediaTv, dataUserMediaTv]);

  const handleNavTabChange = (event: SyntheticEvent, newTab: NavigationTab): void => {
    setCurrentNavTab(newTab);
  };

  if (isLoading || isLoadingTv || isLoadingUserMedia || isLoadingUserMediaTv) {
    return <Loading isLoading={true} />;
  }

  return (
    <div className={style.mediaApp}>
      <AppHeader />
      <ListsPage listCategory={'towatch'} hidden={currentNavTab !== 'towatch'} />
      <ListsPage listCategory={'towatchtv'} hidden={currentNavTab !== 'towatchtv'} />
      <MediaAppActions listCategory={currentNavTab} />
      <BottomNavigationTabs handleChange={handleNavTabChange} currentTab={currentNavTab} />
    </div>
  );
}

function MediaAppActions({ listCategory }: { listCategory: ListCategory | NavigationTab }): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);

  const handleOpenMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseMenu = (): void => setAnchorEl(null);
  const handleOpenCreateList = (): void => {
    handleCloseMenu();
    setIsCreatingList(true);
  };
  const handleCloseCreateList = (): void => setIsCreatingList(false);
  return (
    <>
      <Fab aria-label="edit" size="large" className={style.mediaAppFloatingButton} onClick={handleOpenMenu}>
        <MdReadMore />
      </Fab>
      <Menu
        id="mediaAppActionMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'mediaAppActionMenu',
        }}
        className={style.mediaAppActionMenu}
      >
        <MenuItem onClick={handleOpenCreateList} divider>
          <ListItemIcon>
            <IoMdCreate />
          </ListItemIcon>
          <ListItemText>Create List</ListItemText>
        </MenuItem>
        <MenuItem onClick={undefined} divider>
          <ListItemIcon>
            <MdFilterList />
          </ListItemIcon>
          <ListItemText>Filters</ListItemText>
        </MenuItem>
        <MenuItem onClick={undefined}>
          <ListItemIcon>
            <MdRoomPreferences />
          </ListItemIcon>
          <ListItemText>Preferences</ListItemText>
        </MenuItem>
      </Menu>
      <UniversalModal isOpen={isCreatingList} onClose={handleCloseCreateList} title="New List">
        <NewListForm onClose={handleCloseCreateList} listCategory={listCategory as ListCategory} />
      </UniversalModal>
    </>
  );
}

function BottomNavigationTabs({ handleChange, currentTab }: BottomNavigationProps): JSX.Element {
  const [defaultHeight, setDefaultHeight] = useState<number | null>(null);
  const [raiseComponent, setRaiseComponent] = useState(false);
  // function to raise component if safari/chrome mobile toolbars are hidden.
  useEffect(() => {
    if (defaultHeight === null) setDefaultHeight(window.innerHeight);
    const checkRaise = () => setRaiseComponent(window.innerHeight > Number(defaultHeight));
    window.addEventListener('resize', checkRaise);
    return () => window.removeEventListener('resize', checkRaise);
  }, [defaultHeight]);

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
      className={`${style.raiseOnFullscreen} ${raiseComponent ? style.raise : ''}`}
    >
      <Box className={style.bottomNavContainer}>
        <BottomNavigation showLabels value={currentTab} onChange={handleChange}>
          <BottomNavigationAction label="Movies" value="towatch" icon={<BiCameraMovie />} />
          <BottomNavigationAction label="Tv Shows" value="towatchtv" icon={<RiMovie2Line />} />
          <BottomNavigationAction label="Search" value="search" icon={<RiSearchLine />} />
        </BottomNavigation>
      </Box>
    </Paper>
  );
}
