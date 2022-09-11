import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import { RiGamepadLine, RiMovie2Line, RiSearchLine } from 'react-icons/ri';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { getLists, getUserMedia, is2xxStatus } from '../../services/api';
import { ListCategory, ListCategoryEnum, navBarsToListCategory } from '../../services/types';
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
import { DefaultMediaPage } from '../../store/userPreferences';
import { Alerts } from '../../store/alerts';
import { AlertBox } from '../utils/alertDialog/alertDialog';

const LOCAL_STORAGE_LAST_VIEWED_KEY = 'lastViewedMediaPage';

function getDefaultNavTab(defaultMediaPage?: DefaultMediaPage): NavigationTab {
  if (!defaultMediaPage) return NavigationTab.movies;

  if (defaultMediaPage === 'lastViewed') {
    const tab = localStorage.getItem(LOCAL_STORAGE_LAST_VIEWED_KEY) as NavigationTab;
    return tab ?? NavigationTab.movies;
  }

  return defaultMediaPage as NavigationTab;
}

export default function MediaApp({ user }: { user: User }): JSX.Element {
  const [currentNavTab, setCurrentNavTab] = useState<NavigationTab>(getDefaultNavTab(user.defaultMediaPage));
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadStatus: Record<ListCategory, boolean> = {
    towatch: false,
    towatchtv: false,
    togame: false,
  };
  const alerts = useSelector((state: { alerts: Alerts }) => state.alerts, shallowEqual);

  const loadStatus = useRef(initialLoadStatus);

  const dispatch: Dispatch = useDispatch();

  const closeAlert = async () => {
    dispatch({ type: 'close' });
  };

  const getAndStoreList = async (listCategory: ListCategory) => {
    setIsLoading(true);
    const { status, err, result } = await getLists({}, listCategory);
    if (!is2xxStatus(status) || err) return setIsLoading(false);
    dispatch({
      type: 'storeList',
      listType: listCategory,
      data: result || [],
    });
    setIsLoading(false);
  };

  const getAndStoreUserMedia = async (listCategory: ListCategory) => {
    setIsLoading(true);
    const { status, err, result } = await getUserMedia({}, listCategory);
    if (!is2xxStatus(status) || err) return setIsLoading(false);
    dispatch({
      type: 'storeUserMedia',
      listType: listCategory,
      data: result || [],
    });
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch({
      type: 'storeUserPreferences',
      data: user,
    });
  }, [user]);

  useEffect(() => {
    // TODO: Keep for individual pages. separate movies vs tvshows view.
    // const listCategory = navBarsToListCategory(currentNavTab);
    // if (loadStatus.current[listCategory]) return;
    //
    // getAndStoreList(listCategory).catch();
    // getAndStoreUserMedia(listCategory).catch();
    // loadStatus.current[listCategory] = true;

    const listCategory = navBarsToListCategory(currentNavTab);
    if (loadStatus.current[listCategory]) return;

    getAndStoreList(ListCategoryEnum.towatch).catch();
    getAndStoreUserMedia(ListCategoryEnum.towatch).catch();

    getAndStoreList(ListCategoryEnum.towatchtv).catch();
    getAndStoreUserMedia(ListCategoryEnum.towatchtv).catch();

    getAndStoreList(ListCategoryEnum.togame).catch();
    getAndStoreUserMedia(ListCategoryEnum.togame).catch();

    loadStatus.current.towatch = true;
    loadStatus.current.towatchtv = true;
    loadStatus.current.togame = true;
  }, [currentNavTab]);

  const setLastViewedMediaPage = (mediaPage: NavigationTab): void => {
    if (mediaPage === 'search') return;
    localStorage.setItem(LOCAL_STORAGE_LAST_VIEWED_KEY, mediaPage);
  };

  const handleNavTabChange = (_event: SyntheticEvent, newTab: NavigationTab): void => {
    if (currentNavTab === 'search' && newTab === 'search') {
      document.getElementById('searchString')?.focus();
    }
    setCurrentNavTab(newTab);
    setLastViewedMediaPage(newTab);
  };

  if (isLoading || (!loadStatus.current.towatch && !loadStatus.current.towatchtv && loadStatus.current.togame)) {
    return <Loading isLoading={true} />;
  }

  const bottomNavBarItems: BottomNavBarItem<unknown>[] = [
    { label: 'Movies', value: 'movies', icon: <BiCameraMovie /> },
    { label: 'Tv Shows', value: 'tvShows', icon: <RiMovie2Line /> },
    { label: 'Games', value: 'videoGames', icon: <RiGamepadLine /> },
    { label: 'Search', value: 'search', icon: <RiSearchLine /> },
  ];

  return (
    <div className={`mediaApp ${style.mediaApp}`}>
      <AppHeader />
      <AlertBox
        onClose={closeAlert}
        isOpen={alerts.isOpen}
        isFailedAlert={alerts.isFailedAlert}
        dialogContentText={alerts.dialogContentText}
        dialogTitle={alerts.dialogTitle}
        dialogCloseText={alerts.dialogCloseText}
      />
      <ListsPage listCategory={ListCategoryEnum.towatch} hidden={currentNavTab !== 'movies'} />
      <ListsPage listCategory={ListCategoryEnum.towatchtv} hidden={currentNavTab !== 'tvShows'} />
      <ListsPage listCategory={ListCategoryEnum.togame} hidden={currentNavTab !== 'videoGames'} />
      <SearchPage hidden={currentNavTab !== 'search'} />
      {<MediaAppActions currentTab={currentNavTab} />}
      <BottomNavTabs
        handleChange={handleNavTabChange}
        currentTab={currentNavTab}
        bottomNavBarItems={bottomNavBarItems}
      />
    </div>
  );
}
