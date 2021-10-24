import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import { SyntheticEvent, useEffect, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { GrLinkTop } from 'react-icons/gr';
import { IoMdCreate } from 'react-icons/io';
import { MdFilterList, MdReadMore, MdRoomPreferences } from 'react-icons/md';
import { RiMovie2Line, RiSearchLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import useFetchApi from '../../hooks/useFetchApi';
import { getAllCompletedLists, getLists, getUserMedia } from '../../services/api';
import { ListCategory } from '../../services/types';
import { CompletedLists, List } from '../../store/lists';
import { UserMovie, UserTvShow } from '../../store/userMedia';
import { User } from '../app/types';
import AppHeader from '../utils/appHeader/AppHeader';
import { NewListForm, PreferencesForm } from '../utils/forms/forms';
import Loading from '../utils/loading/Loading';
import UniversalModal from '../utils/universalModal/UniversalModal';
import ListsPage from './listsPage/ListsPage';
import SearchPage from './searchPage/SearchPage';
import style from './style.module.scss';
import { BottomNavigationProps, NavigationTab } from './types';

export default function MediaApp({ user }: { user: User }): JSX.Element {
  const defaultPage = user.defaultMediaPage === 'tvShows' ? 'towatchtv' : 'towatch';
  const [currentNavTab, setCurrentNavTab] = useState<NavigationTab>(defaultPage);
  const { isLoading, error, data } = useFetchApi<List, ListCategory>(false, getLists, 'towatch');
  const {
    isLoading: isLoadingTv,
    error: errorTv,
    data: dataTv,
  } = useFetchApi<List, ListCategory>(false, getLists, 'towatchtv');
  const {
    isLoading: isLoadingUserMedia,
    error: errorUserMedia,
    data: dataUserMedia,
  } = useFetchApi<UserMovie[], ListCategory>(false, getUserMedia, 'towatch');
  const {
    isLoading: isLoadingUserMediaTv,
    error: errorUserMediaTv,
    data: dataUserMediaTv,
  } = useFetchApi<UserTvShow[], ListCategory>(false, getUserMedia, 'towatchtv');
  const {
    isLoading: isLoadingCompleted,
    error: errorCompleted,
    data: dataCompleted,
  } = useFetchApi<CompletedLists>(false, getAllCompletedLists, undefined);

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

  // store completedLists
  useEffect(() => {
    if (isLoadingCompleted || errorCompleted) return;
    dispatch({
      type: 'storeList',
      listType: 'completed',
      data: dataCompleted.completedLists?._id ? [dataCompleted.completedLists] : [],
    });
    dispatch({
      type: 'storeList',
      listType: 'completedtv',
      data: dataCompleted.completedListsTv?._id ? [dataCompleted.completedListsTv] : [],
    });
  }, [isLoadingCompleted, dataCompleted]);

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
    if (currentNavTab === 'search' && newTab === 'search') {
      document.getElementById('searchString')?.focus();
    }
    setCurrentNavTab(newTab);
  };

  if (isLoading || isLoadingTv || isLoadingUserMedia || isLoadingUserMediaTv) {
    return <Loading isLoading={true} />;
  }

  return (
    <div className={`mediaApp ${style.mediaApp}`}>
      <AppHeader />
      <ListsPage listCategory={'towatch'} hidden={currentNavTab !== 'towatch'} />
      <ListsPage listCategory={'towatchtv'} hidden={currentNavTab !== 'towatchtv'} />
      <SearchPage hidden={currentNavTab !== 'search'} />
      {currentNavTab !== 'search' && <MediaAppActions listCategory={currentNavTab} />}
      <BottomNavigationTabs handleChange={handleNavTabChange} currentTab={currentNavTab} />
    </div>
  );
}

function MediaAppActions({ listCategory }: { listCategory: ListCategory | NavigationTab }): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isModifyingPreferences, setIsModifyingPreferences] = useState(false);

  const handleOpenMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseMenu = (): void => setAnchorEl(null);

  const handleOpenCreateList = (): void => {
    handleCloseMenu();
    setIsCreatingList(true);
  };
  const handleCloseCreateList = (): void => setIsCreatingList(false);

  const handleOpenModifyPreferences = (): void => {
    handleCloseMenu();
    setIsModifyingPreferences(true);
  };
  const handleCloseModifyPreferences = (): void => setIsModifyingPreferences(false);

  const handleScrollToTop = (): void => {
    handleCloseMenu();
    document.querySelectorAll(`.listsPage`)[listCategory === 'towatch' ? 0 : 1]?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Fab
        aria-label="edit"
        size="large"
        className={`mediaAppFloatingButton ${style.mediaAppFloatingButton}`}
        onClick={handleOpenMenu}
      >
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
        <MenuItem onClick={handleOpenModifyPreferences} divider>
          <ListItemIcon>
            <MdRoomPreferences />
          </ListItemIcon>
          <ListItemText>Preferences</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleScrollToTop}>
          <ListItemIcon>
            <GrLinkTop />
          </ListItemIcon>
          <ListItemText>Scroll to top</ListItemText>
        </MenuItem>
      </Menu>
      <UniversalModal isOpen={isCreatingList} onClose={handleCloseCreateList} title="New List">
        <NewListForm onClose={handleCloseCreateList} listCategory={listCategory as ListCategory} />
      </UniversalModal>
      <UniversalModal isOpen={isModifyingPreferences} onClose={handleCloseModifyPreferences} title="Modify Preferences">
        <PreferencesForm onClose={handleCloseModifyPreferences} />
      </UniversalModal>
    </>
  );
}

function BottomNavigationTabs({ handleChange, currentTab }: BottomNavigationProps): JSX.Element {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
      id="bottomNavContainer"
      className={`bottomNavContainer raiseOnFullscreen ${style.raiseOnFullscreen}`}
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
