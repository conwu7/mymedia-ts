import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import defaultPoster from '../../images/default-poster.png';
import style from './style.module.scss';
import {
  HandleTabChange,
  MediaReviewCardProps,
  MoreInfoCardProps,
  MoreInfoMedia,
  MoreInfoTabs,
  MoreInfoTabsDisplay,
} from './types';

export default function MoreInfoCard({ hideReviewTab, media, userMedia }: MoreInfoCardProps): JSX.Element {
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
        {currentTab === 'review' && <MediaReviewCard userMedia={userMedia} />}
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
          <p className={style.releaseDate}>
            <span className={style.mediaInfoLabel}>Release: </span>
            {runYears && totalSeasons ? runYears : releaseDate}
            {totalSeasons && (
              <span className={style.totalSeasons}>
                ({totalSeasons} season{totalSeasons > 1 ? 's' : ''})
              </span>
            )}
          </p>
          <p className={style.runtime}>
            <span className={style.mediaInfoLabel}>Runtime: </span>
            {runtime ?? '-'} min
          </p>
          <p className={style.languages}>
            <span className={style.mediaInfoLabel}>Languages: </span>
            {language && language.join(', ')}
          </p>
          <p className={style.imdbRating}>
            <Link
              href={`https://imdb.com/title/${imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              className={style.imdbLink}
            >
              IMDB:
            </Link>
            <span className={style.imdbRatingValue}> {imdbRating ?? '-'}</span>
            /10
          </p>
          <p className={style.genre}>
            <span className={style.mediaInfoLabel}>Genre:{'  '}</span>
            {genre && genre.join(', ')}
          </p>
        </div>
      </section>
      <section className={style.otherInfoContainer}>
        <span className={style.mediaInfoLabel}>Plot:</span>
        <p className={style.plot}>{plot || '-'}</p>
        <span className={style.mediaInfoLabel}>Cast:</span>
        <p className={style.actors}>{actors && actors.join(', ')}</p>
      </section>
    </div>
  );
}

function MediaReviewCard({ userMedia }: MediaReviewCardProps): JSX.Element {
  const { userRating, toWatchNotes, reviewNotes } = userMedia ?? {};
  return (
    <div className={style.reviewCardContainer}>
      <span className={style.mediaInfoLabel}>Watch notes:</span>
      <p className={style.toWatchNotes}>{toWatchNotes || '-'}</p>
      <span className={style.mediaInfoLabel}>Your review:</span>
      <div className={style.userRatingContainer}>
        <Rating name="read-only" value={userRating} readOnly max={10} className={style.userRating} />
        <span className={style.userRatingValue}>{userRating ?? '-'}/10</span>
      </div>
      <p className={style.reviewNotes}>{reviewNotes ?? '-'}</p>
    </div>
  );
}
