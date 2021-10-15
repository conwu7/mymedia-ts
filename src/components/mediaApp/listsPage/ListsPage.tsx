import { MoreVert } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { SyntheticEvent, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { deleteList } from '../../../services/api';
import { ListCategory } from '../../../services/types';
import { List, ListReference, ListsState } from '../../../store/lists';
import Loading from '../../utils/loading/Loading';
import UniversalModal from '../../utils/universalModal/UniversalModal';
import { EditListForm } from './forms/forms';
import style from './style.module.scss';
import { ListContainerProps, ListDescription, ListsPageProps } from './types';
import UserMediaCard from './userMediaCard/UserMediaCard';

export default function ListsPage({ listCategory, hidden }: ListsPageProps): JSX.Element {
  const lists: ListReference = useSelector((state: { lists: ListsState }) => state.lists[listCategory], shallowEqual);

  const listIds = Object.keys(lists);
  const mappedLists = listIds.map((listId) => lists[listId]);

  if (mappedLists.length < 1)
    return (
      <div className={style.emptyLists}>
        <p>Your {listCategory === 'towatch' ? 'movies' : 'tv shows'} list is empty</p>
        <p>To create new lists, click on &quot;More&quot; on the bottom tab</p>
        <p>then click &quot;Create New List&quot;</p>
      </div>
    );

  return (
    <div className={`${style.listsPage} ${hidden ? style.hidden : ''}`}>
      {mappedLists.map((list, index) => (
        <ListContainer list={list} key={index} listCategory={listCategory} />
      ))}
    </div>
  );
}

function ListContainer({ list, listCategory }: ListContainerProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleDeleteList = async () => {
    handleCloseActionMenu();
    if (!window.confirm(`Are you sure you want to delete '${list.name}' list?`)) return;
    setIsLoading(true);
    const { err } = await deleteList(listCategory, list._id);
    setIsLoading(false);
    if (err) return window.alert('Failed to delete list');
    dispatch({
      type: 'deleteList',
      listType: listCategory,
      listToDelete: list._id,
    });
  };
  return (
    <div className={style.listContainerParent}>
      <Accordion className={style.listContainer}>
        <AccordionSummary className={style.listInformationContainerParent} expandIcon={<ExpandMoreIcon />}>
          <ListInformation name={list.name} description={list.description} />
        </AccordionSummary>
        <AccordionDetails className={style.accordionDetails}>
          <ListUserMediaContainer listCategory={listCategory} list={list} />
        </AccordionDetails>
      </Accordion>
      <div className={style.listActionContainer}>
        <IconButton onClick={handleOpenActionMenu} className={style.listActionButton}>
          <MoreVert fontSize="large" />
        </IconButton>
        <Menu
          id="actionMenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseActionMenu}
          MenuListProps={{
            'aria-labelledby': 'actionMenu',
          }}
        >
          <MenuItem onClick={handleOpenEditList} divider>
            Edit List
          </MenuItem>
          <MenuItem onClick={handleDeleteList}>Delete List</MenuItem>
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
  if (list && list.mediaInstants.length < 1) return <div>Empty List</div>;
  return (
    <div className={style.listUserMediaContainer}>
      {list.mediaInstants.map((mediaInstant, index) => (
        <UserMediaCard key={index} userMediaId={mediaInstant.userMedia} listCategory={listCategory} />
      ))}
    </div>
  );
}
