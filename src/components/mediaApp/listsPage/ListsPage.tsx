import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { shallowEqual, useSelector } from 'react-redux';
import { ListCategory } from '../../../services/types';
import { List, ListsState } from '../../../store/lists';
import style from './style.module.scss';
import { ListContainerProps, ListDescription, ListsPageProps } from './types';
import UserMediaCard from './userMediaCard/UserMediaCard';

export default function ListsPage({ listCategory, hidden }: ListsPageProps): JSX.Element {
  const lists: List[] = useSelector((state: { lists: ListsState }) => state.lists[listCategory], shallowEqual);

  if (lists.length < 1)
    return (
      <div className={style.emptyLists}>
        <p>Your {listCategory === 'towatch' ? 'movies' : 'tv shows'} list is empty</p>
        <p>To create new lists, click on &quot;More&quot; on the bottom tab</p>
        <p>then click &quot;Create New List&quot;</p>
      </div>
    );

  return (
    <div className={`${style.listsPage} ${hidden ? style.hidden : ''}`}>
      {lists.map((list, index) => (
        <ListContainer list={list} key={index} listCategory={listCategory} />
      ))}
    </div>
  );
}

function ListContainer({ list, listCategory }: ListContainerProps): JSX.Element {
  return (
    <Accordion className={style.listContainer}>
      <AccordionSummary className={style.listInformationContainerParent} expandIcon={<ExpandMoreIcon />}>
        <ListInformation name={list.name} description={list.description} />
      </AccordionSummary>
      <AccordionDetails className={style.accordionDetails}>
        <ListUserMediaContainer listCategory={listCategory} list={list} />
      </AccordionDetails>
    </Accordion>
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
