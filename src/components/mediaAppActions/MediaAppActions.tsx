import { navBarsToListCategory, navBarsToListCategoryDisplay } from '../../services/types';
import { SyntheticEvent, useState } from 'react';
import Fab from '@mui/material/Fab';
import style from './style.module.scss';
import { MdReadMore, MdRoomPreferences } from 'react-icons/md';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { IoMdCreate } from 'react-icons/io';
import { GrLinkTop } from 'react-icons/gr';
import { UniversalDrawer } from '../utils/universalModal/UniversalModal';
import { AddFromImdbLinkForm, NewListForm, PreferencesForm } from '../utils/forms/forms';
import { NavigationTab } from '../mediaApp/types';
import { ContentPaste } from '@mui/icons-material';

export function MediaAppActions({ currentTab }: { currentTab: NavigationTab }): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isModifyingPreferences, setIsModifyingPreferences] = useState(false);
  const [isPastingImdbLink, setIsPastingImdbLink] = useState(false);

  const handleOpenMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseMenu = (): void => setAnchorEl(null);

  const handleOpenSubMenuItem = (setFunction: (status: boolean) => void) => () => {
    handleCloseMenu();
    setFunction(true);
  };

  const handleCloseSubMenuItem = (setFunction: (status: boolean) => void) => () => {
    setFunction(false);
  };

  const handleScrollToTop = (): void => {
    handleCloseMenu();
    const classSelector = currentTab === 'search' ? '.searchPage' : '.listsPage.active';
    document.querySelectorAll(classSelector)[0]?.scrollTo({
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
        {/*Create New List*/}
        {currentTab !== 'search' && (
          <MenuItem onClick={handleOpenSubMenuItem(setIsCreatingList)} divider>
            <ListItemIcon>
              <IoMdCreate />
            </ListItemIcon>
            <ListItemText>Create list</ListItemText>
          </MenuItem>
        )}
        {/*Paste IMDB Link*/}
        <MenuItem onClick={handleOpenSubMenuItem(setIsPastingImdbLink)} divider>
          <ListItemIcon>
            <ContentPaste />
          </ListItemIcon>
          <ListItemText>Paste IMDB link</ListItemText>
        </MenuItem>
        {/*Modify User Preferences*/}
        <MenuItem onClick={handleOpenSubMenuItem(setIsModifyingPreferences)} divider>
          <ListItemIcon>
            <MdRoomPreferences />
          </ListItemIcon>
          <ListItemText>Preferences</ListItemText>
        </MenuItem>
        {/*Scroll To Top*/}
        <MenuItem onClick={handleScrollToTop}>
          <ListItemIcon>
            <GrLinkTop />
          </ListItemIcon>
          <ListItemText>Scroll to top</ListItemText>
        </MenuItem>
      </Menu>
      {/*Create list Modal*/}
      <UniversalDrawer
        isOpen={isCreatingList}
        onClose={handleCloseSubMenuItem(setIsCreatingList)}
        title={`New ${navBarsToListCategoryDisplay(currentTab)} List`}
      >
        <NewListForm
          onClose={handleCloseSubMenuItem(setIsCreatingList)}
          listCategory={navBarsToListCategory(currentTab)}
        />
      </UniversalDrawer>
      {/*Add from Imdb Link Modal*/}
      <UniversalDrawer
        isOpen={isPastingImdbLink}
        onClose={handleCloseSubMenuItem(setIsPastingImdbLink)}
        title="Add media to one your lists using an IMDB link"
      >
        <AddFromImdbLinkForm
          onClose={handleCloseSubMenuItem(setIsPastingImdbLink)}
          listCategory={navBarsToListCategory(currentTab)}
        />
      </UniversalDrawer>
      {/*Modify Preferences Modal*/}
      <UniversalDrawer
        isOpen={isModifyingPreferences}
        onClose={handleCloseSubMenuItem(setIsModifyingPreferences)}
        title="Modify Preferences"
      >
        <PreferencesForm onClose={handleCloseSubMenuItem(setIsModifyingPreferences)} />
      </UniversalDrawer>
    </>
  );
}
