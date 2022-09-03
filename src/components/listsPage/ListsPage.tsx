import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
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
import { UniversalDrawer, UniversalModal } from '../utils/universalModal/UniversalModal';
import style from './style.module.scss';
import { ListContainerProps, ListDescription, ListsPageProps } from './types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
    <div className={`listsPage ${style.listsPage} ${hidden ? style.hidden : ''} ${hidden ? '' : 'active'}`}>
      <Loading isLoading={!hasFullyLoadedLists} />
      {mappedLists.length < 1 && hasFullyLoadedLists && (
        <div className={style.emptyLists}>
          <p>You have no lists</p>
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
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const dispatch: Dispatch = useDispatch();

  const handleOpenList = () => setIsOpen(true);
  const handleCloseList = () => setIsOpen(false);

  const handleOpenActionMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseActionMenu = (): void => setAnchorEl(null);

  const handleOpenEditList = () => {
    handleCloseActionMenu();
    setIsEditingList(true);
  };
  const handleCloseEditList = () => {
    setIsEditingList(false);
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

  // let listActionContainerStyle = '';
  // if (isListExpanded) {
  //   listActionContainerStyle = list.mediaInstants.length < 1 ? style.emptyListExpanded : style.listExpanded;
  // }

  return (
    <div className={`${style.listContainerParent} ${isDeleted ? style.deleted : ''}`}>
      <Button variant="contained" onClick={handleOpenList} className={style.listContainerBtn}>
        <ListInformation name={list.name || 'list with no name, how?'} description={list.description} />
      </Button>
      <UniversalModal isOpen={isOpen} onClose={handleCloseList} title={list.name ?? ''}>
        <ListUserMediaContainer listCategory={listCategory} list={list} />
      </UniversalModal>
      {/*<Accordion*/}
      {/*  className={style.listContainer}*/}
      {/*  expanded={isListExpanded === 'list'}*/}
      {/*  onChange={handleExpandListContainer('list')}*/}
      {/*  TransitionProps={{ unmountOnExit: true }}*/}
      {/*  disableGutters={true}*/}
      {/*>*/}
      {/*  /!*<AccordionSummary className={style.listInformationContainerParent} expandIcon={<ExpandMoreIcon />}>*!/*/}
      {/*  /!*  <ListInformation name={list.name || 'list with no name, how?'} description={list.description} />*!/*/}
      {/*  /!*</AccordionSummary>*!/*/}
      {/*  /!*<AccordionDetails className={style.accordionDetails}>*!/*/}
      {/*  /!*  <ListUserMediaContainer listCategory={listCategory} list={list} />*!/*/}
      {/*  /!*</AccordionDetails>*!/*/}
      {/*</Accordion>*/}
      <div className={`${style.listActionContainer}`}>
        <IconButton onClick={handleOpenActionMenu} className={style.listActionBtn}>
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
      <UniversalDrawer isOpen={isEditingList} onClose={handleCloseEditList} title={'Edit List'}>
        <EditListForm
          onClose={handleCloseEditList}
          listCategory={listCategory}
          listId={list._id}
          listName={list.name}
          description={list.description}
        />
      </UniversalDrawer>
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
    // <div className={style.listUserMediaContainer}>
    <Grid sx={{ flexGrow: 1 }} container className={style.listUserMediaContainer}>
      {list.mediaInstants.map((mediaInstant) => (
        <Grid key={mediaInstant._id}>
          <UserMediaCard
            key={mediaInstant._id}
            userMediaId={mediaInstant.userMedia}
            listCategory={listCategory}
            currentListId={list._id}
          />
        </Grid>
      ))}
    </Grid>
  );
}
