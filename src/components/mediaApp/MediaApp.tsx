import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestoreIcon from '@mui/icons-material/Restore';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import useFetchApi from '../../hooks/useFetchApi';
import { getLists, getUserMedia } from '../../services/api';
import { ListCategory } from '../../services/types';
import { List } from '../../store/lists';
import { UserMovie, UserTvShow } from '../../store/userMedia';
import { User } from '../app/types';
import Loading from '../utils/loading/Loading';
import AppHeader from './AppHeader';
import ListsPage from './listsPage/ListsPage';
import MorePage from './morePage/MorePage';
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
    <div>
      <AppHeader />
      <ListsPage listCategory={'towatch'} hidden={currentNavTab !== 'towatch'} />
      <ListsPage listCategory={'towatchtv'} hidden={currentNavTab !== 'towatchtv'} />
      <MorePage hidden={currentNavTab !== 'more'} />
      <BottomNavigationTabs handleChange={handleNavTabChange} currentTab={currentNavTab} />
    </div>
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
      <Box>
        <BottomNavigation showLabels value={currentTab} onChange={handleChange}>
          <BottomNavigationAction label="Movies" value="towatch" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Tv Shows" value="towatchtv" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Search" value="search" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="More" value="more" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Box>
    </Paper>
  );
}
