import { SyntheticEvent, useEffect, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { RiMovie2Line, RiSearchLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import useFetchApi from '../../hooks/useFetchApi';
import { getLists, getUserMedia } from '../../services/api';
import { ListCategory } from '../../services/types';
import { List } from '../../store/lists';
import { UserMovie, UserTvShow } from '../../store/userMedia';
import { User } from '../app/types';
import ListsPage from '../listsPage/ListsPage';
import SearchPage from '../searchPage/SearchPage';
import AppHeader from '../utils/appHeader/AppHeader';
import Loading from '../utils/loading/Loading';
import style from './style.module.scss';
import { NavigationTab } from './types';
import { MediaAppActions } from '../mediaAppActions/MediaAppActions';
import { BottomNavTabs } from '../utils/bottomNavTabs/BottomNavTabs';
import { BottomNavBarItem } from '../utils/bottomNavTabs/types';

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

  const handleNavTabChange = (_event: SyntheticEvent, newTab: NavigationTab): void => {
    if (currentNavTab === 'search' && newTab === 'search') {
      document.getElementById('searchString')?.focus();
    }
    setCurrentNavTab(newTab);
  };

  if (isLoading || isLoadingTv || isLoadingUserMedia || isLoadingUserMediaTv) {
    return <Loading isLoading={true} />;
  }

  const bottomNavBarItems: BottomNavBarItem[] = [
    { label: 'Movies', value: 'towatch', icon: <BiCameraMovie /> },
    { label: 'Tv Shows', value: 'towatchtv', icon: <RiMovie2Line /> },
    { label: 'Search', value: 'search', icon: <RiSearchLine /> },
  ];

  return (
    <div className={`mediaApp ${style.mediaApp}`}>
      <AppHeader />
      <ListsPage listCategory={'towatch'} hidden={currentNavTab !== 'towatch'} />
      <ListsPage listCategory={'towatchtv'} hidden={currentNavTab !== 'towatchtv'} />
      <SearchPage hidden={currentNavTab !== 'search'} />
      {currentNavTab !== 'search' && <MediaAppActions currentTab={currentNavTab} />}
      <BottomNavTabs
        handleChange={handleNavTabChange}
        currentTab={currentNavTab}
        bottomNavBarItems={bottomNavBarItems}
      />
    </div>
  );
}
