import { navBarsToListCategory } from '../../services/types';
import { SyntheticEvent, useState } from 'react';
import Fab from '@mui/material/Fab';
import style from './style.module.scss';
import { MdReadMore, MdRoomPreferences } from 'react-icons/md';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { IoMdCreate } from 'react-icons/io';
import { GrLinkTop } from 'react-icons/gr';
import { UniversalDrawer } from '../utils/universalModal/UniversalModal';
import { NewListForm, PreferencesForm } from '../utils/forms/forms';
import { NavigationTab } from '../mediaApp/types';

export function MediaAppActions({ currentTab }: { currentTab: NavigationTab }): JSX.Element {
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
    document.querySelectorAll(`.listsPage.active`)[0]?.scrollTo({
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
        <MenuItem onClick={handleOpenCreateList} divider>
          <ListItemIcon>
            <IoMdCreate />
          </ListItemIcon>
          <ListItemText>Create List</ListItemText>
        </MenuItem>
        {/*Modify User Preferences*/}
        <MenuItem onClick={handleOpenModifyPreferences} divider>
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
      <UniversalDrawer isOpen={isCreatingList} onClose={handleCloseCreateList} title="New List">
        <NewListForm onClose={handleCloseCreateList} listCategory={navBarsToListCategory(currentTab)} />
      </UniversalDrawer>
      {/*Modify Preferences Modal*/}
      <UniversalDrawer
        isOpen={isModifyingPreferences}
        onClose={handleCloseModifyPreferences}
        title="Modify Preferences"
      >
        <PreferencesForm onClose={handleCloseModifyPreferences} />
      </UniversalDrawer>
    </>
  );
}
