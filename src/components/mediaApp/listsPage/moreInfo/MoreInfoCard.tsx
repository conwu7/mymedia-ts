import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import defaultPoster from '../../../../images/default-poster.png';
import style from './style.module.scss';
import { HandleTabChange, MoreInfoCardProps, MoreInfoMedia, MoreInfoTabs, MoreInfoTabsDisplay } from './types';

export default function MoreInfoCard({ hideReviewTab, media }: MoreInfoCardProps): JSX.Element {
  const [currentTab, setCurrentTab] = useState<MoreInfoTabs>('info');
  const handleTabChange: HandleTabChange = (event, newTab) => setCurrentTab(newTab);
  return (
    <div className={style.mediaInfoCard}>
      <AppBar className={style.tabSwitcherContainer}>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label={MoreInfoTabsDisplay.info} value="info" className={style.tab} />
          {!hideReviewTab && <Tab label={MoreInfoTabsDisplay.review} value="review" className={style.tab} />}
        </Tabs>
      </AppBar>
      <Box>
        {currentTab === 'info' && <MediaInfoCard media={media} />}
        {currentTab === 'review' && <MediaReviewCard />}
      </Box>
    </div>
  );
}

function MediaInfoCard({ media }: { media: MoreInfoMedia }): JSX.Element {
  const {
    posterUrl,
    language,
    plot,
    title,
    runtime,
    runYears,
    imdbID,
    totalSeasons,
    genre,
    imdbRating,
    releaseDate,
    actors,
  } = media;

  return (
    <div className={style.moreInfoContainer}>
      <section className={style.posterAndMainInfoContainer}>
        <div className={style.posterInMoreContainer}>
          <img src={posterUrl || defaultPoster} alt={`${title} poster`} className={style.posterInMore} />
        </div>
        <div className={style.mainInfoContainer}>
          <h1 className={style.mediaTitle}>{title}</h1>
          <div>
            <span className={style.mediaInfoLabel}>Runtime:</span>
            <p className={style.runtime}>{runtime ? runtime : '-'} min</p>
          </div>
          <p className={style.languages}>{language && language.join(', ')}</p>
          <p className={style.imdbRating}>
            <Link
              href={`https://imdb.com/title/${imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              className={style.imdbLink}
            >
              IMDB
            </Link>
            <span className={style.imdbRatingValue}> {imdbRating || '-'}</span>
            /10
          </p>
        </div>
      </section>
      <section className={style.otherInfoContainer}>
        <span className={style.mediaInfoLabel}>Release Date:</span>
        <p className={style.releaseDate}>
          {runYears && totalSeasons
            ? `${runYears} (${totalSeasons} season${totalSeasons > 1 ? 's' : ''})`
            : releaseDate}
        </p>
        <span className={style.mediaInfoLabel}>Genre:</span>
        <p className={style.genre}>{genre && genre.join(', ')}</p>
        <span className={style.mediaInfoLabel}>Plot:</span>
        <p className={style.plot}>{plot || '-'}</p>
        <span className={style.mediaInfoLabel}>Cast:</span>
        <p className={style.actors}>{actors && actors.join(', ')}</p>
      </section>
    </div>
  );
}

function MediaReviewCard(): JSX.Element {
  return <div>b</div>;
}
