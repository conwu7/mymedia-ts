import { Link, Rating } from '@mui/material';
import Box from '@mui/material/Box';
import style from './style.module.scss';
import { MediaReview, MoreInfoCardProps, MoreInfoMedia } from './types';
import Paper from '@mui/material/Paper';

export default function MoreInfoCard({ media, userMedia }: MoreInfoCardProps): JSX.Element {
  return (
    <div className={style.mediaInfoCard}>
      <Box>
        <MediaInfoCard media={media} userMedia={userMedia} />
      </Box>
    </div>
  );
}

function MediaInfoCard({ media, userMedia }: { media: MoreInfoMedia; userMedia?: MediaReview }): JSX.Element {
  const { language, plot, runtime, runYears, imdbID, totalSeasons, genre, imdbRating, releaseDate, actors } = media;

  const { userRating, toWatchNotes, reviewNotes } = userMedia ?? {};

  return (
    <Paper className={style.moreInfoContainer}>
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
        <span className={style.imdbRatingValue}>: {imdbRating ?? '-'}</span>
        /10
        {!!media.updatedAt && (
          <span className={style.imdbRatingAsOfDate}> (as of {new Date(media.updatedAt).toDateString()})</span>
        )}
      </p>
      <span className={style.mediaInfoLabel}>Release: </span>
      <p className={style.releaseDate}>
        {runYears && totalSeasons ? runYears : releaseDate ?? runYears}{' '}
        {totalSeasons && (
          <span className={style.totalSeasons}>
            ({totalSeasons} season{totalSeasons > 1 ? 's' : ''}){' '}
          </span>
        )}
        {runtime && `- (${runtime} min)`}
      </p>
      <span className={style.mediaInfoLabel}>Plot:</span>
      <p className={style.plot}>{plot || '-'}</p>
      <span className={style.mediaInfoLabel}>Cast:</span>
      <p className={style.actors}>{actors && actors.join(', ')}</p>
      <span className={style.mediaInfoLabel}>Genre:{'  '}</span>
      <p className={style.genre}>{genre && genre.join(', ')}</p>
      <span className={style.mediaInfoLabel}>Languages: </span>
      <p className={style.languages}>{language?.join(', ') || '-'}</p>
      {toWatchNotes && (
        <>
          <span className={style.mediaInfoLabel}>Watch notes:</span>
          <p className={style.toWatchNotes}>{toWatchNotes || '-'}</p>
        </>
      )}
      {userRating && (
        <>
          <span className={style.mediaInfoLabel}>Your review:</span>
          <div className={style.userRatingContainer}>
            <Rating name="read-only" value={userRating} readOnly max={10} className={style.userRating} />
            <span className={style.userRatingValue}>{userRating ?? '-'}/10</span>
          </div>
        </>
      )}
      {reviewNotes && (
        <>
          <span className={style.mediaInfoLabel}>Review Notes:</span>
          <p className={style.reviewNotes}>{reviewNotes ?? '-'}</p>
        </>
      )}
    </Paper>
  );
}
