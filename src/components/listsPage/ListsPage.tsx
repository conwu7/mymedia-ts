import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
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
import style from './style.module.scss';
import { ListContainerProps, ListDescription, ListsPageProps } from './types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { UniversalDrawer } from '../utils/universalModal/UniversalModal';
import AlertDialog from '../utils/alertDialog/alertDialog';
import * as MuiColors from '@mui/material/colors';
import { MdOutlineArrowDropDownCircle } from 'react-icons/md';
import { RiDeleteBin2Fill, RiEdit2Fill } from 'react-icons/ri';

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
      <Grid sx={{ flexGrow: 1 }} container columns={2} className={style.listsGridContainer}>
        {mappedLists.length < 1 && hasFullyLoadedLists && (
          <div className={style.emptyLists}>
            <p>You have no lists</p>
          </div>
        )}
        {mappedLists.map((list) => (
          <Grid key={list._id} className={style.listsGrid}>
            <ListContainer list={list} key={list._id} listCategory={listCategory} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function ListContainer({ list, listCategory }: ListContainerProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);
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

  const handleOpenDeleteList = () => {
    handleCloseActionMenu();
    setIsDeletingList(true);
  };
  const handleCloseDeleteList = () => {
    setIsDeletingList(false);
  };

  const handleDeleteList = async () => {
    handleCloseActionMenu();

    setIsLoading(true);
    setIsDeletingList(false);

    const { err } = await deleteList(listCategory, list._id);

    if (err) {
      return handleApiErrors(
        err,
        alertFactory(
          {
            dialogContentText: 'Failed to delete list',
            isFailedAlert: true,
          },
          dispatch,
        ),
        setIsLoading,
      );
    }

    setIsLoading(false);
    setIsDeleted(true);
  };

  // set list background color
  useEffect(() => {
    const listBtn = document.querySelector(`[data-list-id="${list._id}"].${style.listContainerBtn}`) as HTMLElement;
    if (listBtn) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      listBtn.style.backgroundColor = MuiColors[list.color]?.[50] ?? 'white';
    }
  }, [list.color]);

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

  return (
    <div className={`${style.listContainerParent} ${isDeleted ? style.deleted : ''}`}>
      <Button onClick={handleOpenList} className={style.listContainerBtn} data-list-id={list._id}>
        <ListInformation name={list.name || 'list with no name, how?'} description={list.description} />
      </Button>
      <UniversalDrawer
        isOpen={isOpen}
        onClose={handleCloseList}
        title={list.name ?? ''}
        style={{ contentContainerBackgroundColor: list.color }}
      >
        <ListUserMediaContainer listCategory={listCategory} list={list} />
      </UniversalDrawer>
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
          <MenuItem onClick={handleOpenDeleteList}>
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
          color={list.color ?? 'white'}
        />
      </UniversalDrawer>
      <AlertDialog
        onClose={handleCloseDeleteList}
        onAccept={handleDeleteList}
        isOpen={isDeletingList}
        dialogContentText={`Are you sure you want to delete '${list.name}'?`}
        dialogTitle="Confirm - Delete List"
        dialogOkText="Yes"
      />
      <Loading isLoading={isLoading} />
    </div>
  );
}

function ListInformation({ name, description }: ListDescription): JSX.Element {
  return (
    <div className={style.listInformationContainer}>
      <h4 className={style.listNameHeader}>{name}</h4>
      <Divider light text-align="left" />
      <h4 className={style.listDescription}>{description || '-'}</h4>
    </div>
  );
}

function ListUserMediaContainer({ listCategory, list }: { listCategory: ListCategory; list: List }): JSX.Element {
  if (list && list.mediaInstants.length < 1) return <div className={style.emptyList}>Empty List</div>;
  return (
    // <div className={style.listUserMediaContainer}>
    <Grid sx={{ flexGrow: 1 }} container className={style.listUserMediaContainer}>
      {list.mediaInstants.map((mediaInstant) => (
        <Grid key={mediaInstant._id} className={style.userMediaCardContainer}>
          <UserMediaCard
            key={mediaInstant._id}
            userMediaId={mediaInstant.userMedia}
            listCategory={listCategory}
            currentListId={list._id}
            currentListName={list.name}
          />
        </Grid>
      ))}
    </Grid>
  );
}
