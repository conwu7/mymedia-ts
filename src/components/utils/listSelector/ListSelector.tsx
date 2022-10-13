import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { sortLists } from '../../../services/sorting';
import { ListReference, ListsState } from '../../../store/lists';
import { UserPreferences } from '../../../store/userPreferences';
import { NewListForm } from '../forms/forms';
import Loading from '../loading/Loading';
import { UniversalDrawer } from '../universalModal/UniversalModal';
import style from './style.module.scss';
import { AddToListModalProps, ListSelectorModalProps, ListSelectorProps, ListWithSelectButtonStatus } from './types';
import { addItemToList, getUserMedia, is2xxStatus } from '../../../services/api';
import { Dispatch } from 'redux';
import { AlertBox } from '../alertDialog/alertDialog';
import { Alerts } from '../../../store/alerts';
import { alertFactory, handleApiErrors } from '../../../services/errorHelpers';

export function ListSelector(props: ListSelectorProps): JSX.Element {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const lists: ListReference = useSelector(
    (state: { lists: ListsState }) => state.lists[props.listCategory],
    shallowEqual,
  );
  const listSortPreference = useSelector(
    (state: { userPreferences: UserPreferences }) => state.userPreferences.listSortPreference,
    shallowEqual,
  );
  const listIds = Object.keys(lists);
  const mappedLists: ListWithSelectButtonStatus[] = sortLists(
    listIds.map((listId) => {
      return {
        ...lists[listId],
        disableSelectList: lists[listId].mediaInstants.some((instant) => instant.imdbID === props.imdbId),
      };
    }),
    listSortPreference,
  );
  const handleSelectFactory = (listId: string) => () => {
    props.onSelect(listId);
  };
  const handleOpenCreateList = () => setIsCreatingList(true);
  const handleCloseCreateList = () => setIsCreatingList(false);

  return (
    <div className={style.listSelectorContainer}>
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="contained"
        className={style.listSelectorButtonGroup}
        disableElevation={true}
      >
        {mappedLists &&
          mappedLists.length > 0 &&
          mappedLists.map((list) => (
            <Button
              key={list._id}
              className={style.listSelectorButton}
              onClick={handleSelectFactory(list._id)}
              disabled={list.disableSelectList}
            >
              {list.name}
            </Button>
          ))}
        <Button
          variant="outlined"
          className={`${style.listSelectorButton} ${style.createListButton}`}
          onClick={handleOpenCreateList}
        >
          Create New List
        </Button>
      </ButtonGroup>
      <UniversalDrawer isOpen={isCreatingList} onClose={handleCloseCreateList}>
        <NewListForm onClose={handleCloseCreateList} listCategory={props.listCategory} />
      </UniversalDrawer>
    </div>
  );
}

export function ListSelectorModal(props: ListSelectorModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const handleSelection = async (listId: string) => {
    setIsLoading(true);
    await props.onSelect(listId);
    setIsLoading(false);
  };
  return (
    <>
      <UniversalDrawer isOpen={props.isOpen} onClose={props.onClose} title={props.modalTitle || 'Select a list'}>
        <ListSelector listCategory={props.listCategory} imdbId={props.imdbId} onSelect={handleSelection} />
      </UniversalDrawer>
      <Loading isLoading={isLoading} />
    </>
  );
}

export function AddToListModal(props: AddToListModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const alerts = useSelector((state: { alerts: Alerts }) => state.alerts, shallowEqual);

  const dispatch: Dispatch = useDispatch();

  const closeAlert = async () => {
    dispatch({ type: 'close' });
  };

  // API HANDLERS
  const handleSelection = async (newListId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { status, result: apiResult, err } = await addItemToList(props.imdbId, newListId, props.listCategory);
      if (!is2xxStatus(status)) throw new Error(err);
      const { result: updatedUserMediaList } = await getUserMedia({}, props.listCategory);
      dispatch({
        type: 'storeUserMedia',
        listType: props.listCategory,
        data: updatedUserMediaList || [],
      });
      dispatch({
        type: 'updateList',
        listType: props.listCategory,
        list: apiResult,
      });
      setIsLoading(false);
      props.onSelect();
    } catch (err) {
      if (err) {
        return handleApiErrors(
          'Failed to add item to list',
          alertFactory(
            {
              dialogContentText: 'Failed to add item to list',
              isFailedAlert: true,
            },
            dispatch,
          ),
          setIsLoading,
        );
      }
    }
  };

  return (
    <>
      <AlertBox
        onClose={closeAlert}
        isOpen={alerts.isOpen}
        isFailedAlert={alerts.isFailedAlert}
        dialogContentText={alerts.dialogContentText}
        dialogTitle={alerts.dialogTitle}
        dialogCloseText={alerts.dialogCloseText}
      />
      <UniversalDrawer isOpen={props.isOpen} onClose={props.onCancel} title={props.modalTitle || 'Select a list'}>
        <ListSelector listCategory={props.listCategory} imdbId={props.imdbId} onSelect={handleSelection} />
      </UniversalDrawer>
      <Loading isLoading={isLoading} />
    </>
  );
}
