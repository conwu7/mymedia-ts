import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { shallowEqual, useSelector } from 'react-redux';
import defaultPoster from '../../images/default-poster.png';
import { ListCategory } from '../../services/types';
import { List, ListsState } from '../../store/lists';
import { UserMediaCombo, UserMediaState } from '../../store/userMedia';
import style from './style.module.scss';
import { ListContainerProps, ListDescription, ListsPageProps } from './types';

export default function ListsPage({ listCategory, hidden }: ListsPageProps): JSX.Element {
  const lists: List[] = useSelector((state: { lists: ListsState }) => state.lists[listCategory], shallowEqual);

  if (lists.length < 1)
    return (
      <div className={style.emptyLists}>
        <p>Your {listCategory === 'towatch' ? 'movies' : 'tv shows'} list is empty</p>
        <p>To create new lists, click on &quot;Menu&quot; on the bottom tab</p>
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
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
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
      <h3 className={style.listNameHeader}>{name.toLocaleUpperCase()}</h3>
      <h4 className={style.listDescription}>{description}</h4>
    </div>
  );
}

function ListUserMediaContainer({ listCategory, list }: { listCategory: ListCategory; list: List }): JSX.Element {
  if (list && list.mediaInstants.length < 1) {
    return <div>Empty List</div>;
  }
  return (
    <div className={style.listUserMediaContainer}>
      {list.mediaInstants.map((mediaInstant, index) => (
        <UserMediaCard key={index} userMediaId={mediaInstant.userMedia} listCategory={listCategory} />
      ))}
    </div>
  );
}

function UserMediaCard({
  userMediaId,
  listCategory,
}: {
  userMediaId: string;
  listCategory: ListCategory;
}): JSX.Element {
  const userMedia: UserMediaCombo = useSelector(
    (state: { userMedia: UserMediaState }) => state.userMedia?.[listCategory]?.[userMediaId],
    shallowEqual,
  );

  if (!userMedia) return <span>working on it</span>;

  const { media } = userMedia;

  return (
    <Paper className={style.userMediaCard}>
      <div className={style.posterContainer}>
        <img src={media.posterUrl || defaultPoster} alt={media.title + ' poster'} className={style.poster} />
      </div>
      <div className={style.mediaInfo}>
        <h1 className={style.mediaTitle}>{media.title}</h1>
        {/*<p className={style.streamingSource}>{userMedia.streamingSource && userMedia.streamingSource.toUpperCase()}</p>*/}
        <p className={style.imdbRating}>
          <a href={`https://imdb.com/title/${media.imdbID}`} target="_blank" rel="noopener noreferrer">
            IMDB
          </a>
          <span className={style.imdbRatingSpan}>{media.imdbRating || '-'}</span>
          /10
        </p>
        <p className={style.runtime}>({media.runtime ? media.runtime : '-'} min)</p>
        {/*<p className={style.genre}>{media.genre && media.genre.join(', ')}</p>*/}
        <p className={style.releaseDate}>{media.releaseDate}</p>
        <Button variant="outlined">More Info</Button>
      </div>
    </Paper>
  );
}
