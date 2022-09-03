import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { sortLists } from '../../../services/sorting';
import { ListReference, ListsState } from '../../../store/lists';
import { UserPreferences } from '../../../store/userPreferences';
import { NewListForm } from '../forms/forms';
import Loading from '../loading/Loading';
import { UniversalModal } from '../universalModal/UniversalModal';
import style from './style.module.scss';
import { ListSelectorModalProps, ListSelectorProps, ListWithSelectButtonStatus } from './types';

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
      <UniversalModal isOpen={isCreatingList} onClose={handleCloseCreateList}>
        <NewListForm onClose={handleCloseCreateList} listCategory={props.listCategory} />
      </UniversalModal>
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
      <UniversalModal isOpen={props.isOpen} onClose={props.onClose} title={props.modalTitle || 'Select a list'}>
        <ListSelector listCategory={props.listCategory} imdbId={props.imdbId} onSelect={handleSelection} />
      </UniversalModal>
      <Loading isLoading={isLoading} />
    </>
  );
}
