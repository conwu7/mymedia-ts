import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { SyntheticEvent, useEffect, useState } from 'react';
import { MdOutlineArrowDropDownCircle, RiDeleteBin2Fill, RiEdit2Fill } from 'react-icons/all';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { deleteList } from '../../services/api';
import { alertFactory, handleApiErrors } from '../../services/errorHelpers';
import { sortLists, sortMediaInstantLists } from '../../services/sorting';
import { ListCategory } from '../../services/types';
import { List, ListReference, ListsState } from '../../store/lists';
import { UserMediaState } from '../../store/userMedia';
import { UserPreferences } from '../../store/userPreferences';
import UserMediaCard from '../userMediaCard/UserMediaCard';
import { EditListForm } from '../utils/forms/forms';
import Loading from '../utils/loading/Loading';
import UniversalModal from '../utils/universalModal/UniversalModal';
import style from './style.module.scss';
import { ListContainerProps, ListDescription, ListsPageProps } from './types';

export default function ListsPage({ listCategory, hidden }: ListsPageProps): JSX.Element {
  const [listIds, setListIds] = useState<string[]>([]);
  const [mappedLists, setMappedLists] = useState<List[]>([]);
  const lists: ListReference = useSelector((state: { lists: ListsState }) => state.lists[listCategory], shallowEqual);
  const { listSortPreference, mediaSortPreference } = useSelector(
    (state: { userPreferences: UserPreferences }) => state.userPreferences,
    shallowEqual,
  );
  const [hasFullyLoadedLists, setHasFullyLoadedLists] = useState(false);
  const [hasFullyLoadedListIds, setHasFullyLoadedListIds] = useState(false);
  const userMedia = useSelector(
    (state: { userMedia: UserMediaState }) => state.userMedia?.[listCategory],
    shallowEqual,
  );

  // set list ids
  useEffect(() => {
    setListIds(Object.keys(lists));
    setHasFullyLoadedListIds(true);
  }, [lists]);

  // set fully mapped lists
  useEffect(() => {
    if (!hasFullyLoadedListIds) return;
    setMappedLists(
      sortLists(
        Object.keys(lists).map((listId) => lists[listId]),
        listSortPreference,
      ).map((list) => {
        return {
          ...list,
          mediaInstants: sortMediaInstantLists(list.mediaInstants, userMedia, mediaSortPreference),
        };
      }),
    );
    setHasFullyLoadedLists(true);
  }, [listSortPreference, mediaSortPreference, listIds]);

  return (
    <div className={`listsPage ${style.listsPage} ${hidden ? style.hidden : ''}`}>
      <Loading isLoading={!hasFullyLoadedLists} />
      {mappedLists.length < 1 && hasFullyLoadedLists && (
        <div className={style.emptyLists}>
          <p>Your {listCategory === 'towatch' ? 'movies' : 'tv shows'} list is empty</p>
        </div>
      )}
      {mappedLists.map((list) => (
        <ListContainer list={list} key={list._id} listCategory={listCategory} />
      ))}
    </div>
  );
}

function ListContainer({ list, listCategory }: ListContainerProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isListExpanded, setListContainerExpanded] = useState<string | boolean>(false);

  const dispatch: Dispatch = useDispatch();

  const handleOpenActionMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseActionMenu = (): void => setAnchorEl(null);

  const handleOpenEditList = () => {
    handleCloseActionMenu();
    setIsEditingList(true);
  };
  const handleCloseEditList = () => {
    setIsEditingList(false);
  };

  const handleExpandListContainer = (container: string) => (_event: SyntheticEvent, isExpanded: string | boolean) => {
    setListContainerExpanded(isExpanded ? container : false);
  };

  const handleDeleteList = async () => {
    handleCloseActionMenu();

    if (!window.confirm(`Are you sure you want to delete '${list.name}'?`)) return;
    setIsLoading(true);
    const { err } = await deleteList(listCategory, list._id);

    if (err) {
      return handleApiErrors(err, alertFactory('Failed to delete list'), setIsLoading);
    }

    setIsLoading(false);
    setIsDeleted(true);
  };

  // complete delete
  useEffect(() => {
    if (!isDeleted) return;
    setTimeout(() => {
      dispatch({
        type: 'deleteList',
        listType: listCategory,
        listToDelete: list._id,
      });
    }, 400);
  }, [isDeleted]);

  let listActionContainerStyle = '';
  if (isListExpanded) {
    listActionContainerStyle = list.mediaInstants.length < 1 ? style.emptyListExpanded : style.listExpanded;
  }

  return (
    <div className={`${style.listContainerParent} ${isDeleted ? style.deleted : ''}`}>
      <Accordion
        className={style.listContainer}
        expanded={isListExpanded === 'list'}
        onChange={handleExpandListContainer('list')}
        TransitionProps={{ unmountOnExit: true }}
        disableGutters={true}
      >
        <AccordionSummary className={style.listInformationContainerParent} expandIcon={<ExpandMoreIcon />}>
          <ListInformation name={list.name || 'list with no name, how?'} description={list.description} />
        </AccordionSummary>
        <AccordionDetails className={style.accordionDetails}>
          <ListUserMediaContainer listCategory={listCategory} list={list} />
        </AccordionDetails>
      </Accordion>
      <div className={`${style.listActionContainer} ${listActionContainerStyle}`}>
        <IconButton onClick={handleOpenActionMenu} className={style.listActionButton}>
          <MdOutlineArrowDropDownCircle />
        </IconButton>
        <Menu
          id="listPageActionMenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseActionMenu}
          MenuListProps={{
            'aria-labelledby': 'listPageActionMenu',
          }}
        >
          <MenuItem onClick={handleOpenEditList} divider>
            <ListItemIcon>
              <RiEdit2Fill />
            </ListItemIcon>
            <ListItemText>Edit List</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteList}>
            <ListItemIcon>
              <RiDeleteBin2Fill />
            </ListItemIcon>
            <ListItemText>Delete List</ListItemText>
          </MenuItem>
        </Menu>
      </div>
      <UniversalModal isOpen={isEditingList} onClose={handleCloseEditList} title={'Edit List'}>
        <EditListForm
          onClose={handleCloseEditList}
          listCategory={listCategory}
          listId={list._id}
          listName={list.name}
          description={list.description}
        />
      </UniversalModal>
      <Loading isLoading={isLoading} />
    </div>
  );
}

function ListInformation({ name, description }: ListDescription): JSX.Element {
  return (
    <div className={style.listInformationContainer}>
      <h4 className={style.listNameHeader}>{name.toLocaleUpperCase()}</h4>
      <h4 className={style.listDescription}>{description}</h4>
    </div>
  );
}

function ListUserMediaContainer({ listCategory, list }: { listCategory: ListCategory; list: List }): JSX.Element {
  if (list && list.mediaInstants.length < 1) return <div className={style.emptyList}>Empty List</div>;
  return (
    <div className={style.listUserMediaContainer}>
      {list.mediaInstants.map((mediaInstant) => (
        <UserMediaCard
          key={mediaInstant._id}
          userMediaId={mediaInstant.userMedia}
          listCategory={listCategory}
          currentListId={list._id}
        />
      ))}
    </div>
  );
}
