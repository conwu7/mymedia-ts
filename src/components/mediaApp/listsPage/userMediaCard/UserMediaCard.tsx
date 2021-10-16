import { MoreVert } from '@mui/icons-material';
import { IconButton, Link, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { SyntheticEvent, useState } from 'react';
import { AiTwotoneCopy } from 'react-icons/ai';
import { CgMoveRight, CgNotes } from 'react-icons/cg';
import { MdRateReview } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { shallowEqual, useSelector } from 'react-redux';
import defaultPoster from '../../../../images/default-poster.png';
import { LIstCategoryDisplay } from '../../../../services/types';
import { UserMediaCombo, UserMediaState } from '../../../../store/userMedia';
import UniversalModal from '../../../utils/universalModal/UniversalModal';
import MoreInfoCard from '../moreInfo/MoreInfoCard';
import { UserMediaCardProps } from '../types';
import style from './style.module.scss';

export default function UserMediaCard({ userMediaId, listCategory }: UserMediaCardProps): JSX.Element {
  const userMedia: UserMediaCombo = useSelector(
    (state: { userMedia: UserMediaState }) => state.userMedia?.[listCategory]?.[userMediaId],
    shallowEqual,
  );
  const [isViewingMore, setIsViewingMore] = useState(false);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleOpenMore = (): void => setIsViewingMore(true);
  const handleCloseMore = (): void => setIsViewingMore(false);
  const handleOpenActionMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseActionMenu = (): void => setAnchorEl(null);

  if (!userMedia) return <span>working on it</span>;

  const { media } = userMedia;

  return (
    <Paper className={style.userMediaCard}>
      <div className={style.posterContainer}>
        <img src={media.posterUrl || defaultPoster} alt={media.title + ' poster'} className={style.poster} />
      </div>
      <div className={style.mediaInfo}>
        <h1 className={style.mediaTitle}>{media.title}</h1>
        <p className={style.releaseYear}>{media.releaseYear || media.runYears}</p>
        <p className={style.runtime}>{media.runtime ? media.runtime : '-'} min</p>

        {/*<p className={style.streamingSource}>{userMedia.streamingSource && userMedia.streamingSource.toUpperCase()}</p>*/}
        <p className={style.imdbRating}>
          <Link
            href={`https://imdb.com/title/${media.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            className={style.imdbLink}
          >
            IMDB
          </Link>
          <span className={style.imdbRatingValue}>{media.imdbRating || '-'}</span>
          /10
        </p>
        <p className={style.genre}>{media.genre && media.genre.slice(0, 2).join(', ')}</p>
        <div className={style.userMediaActionsContainer}>
          <Button variant="contained" className={style.moreInfoButton} onClick={handleOpenMore}>
            More
          </Button>
          <IconButton className={style.actionButtonWrapper} onClick={handleOpenActionMenu}>
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
            className={style.actionMenu}
          >
            <MenuItem
              onClick={handleCloseActionMenu}
              className={`${style.actionMenuItem} ${style.addNotesActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <CgNotes />
              </ListItemIcon>
              <ListItemText>Add notes</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleCloseActionMenu}
              className={`${style.actionMenuItem} ${style.reviewActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <MdRateReview />
              </ListItemIcon>
              <ListItemText>Review</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleCloseActionMenu}
              className={`${style.actionMenuItem} ${style.moveActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <CgMoveRight />
              </ListItemIcon>
              <ListItemText>Move</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleCloseActionMenu}
              className={`${style.actionMenuItem} ${style.copyActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <AiTwotoneCopy />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleCloseActionMenu}
              className={`${style.actionMenuItem} ${style.removeActionMenuItem}`}
            >
              <ListItemIcon>
                <RiDeleteBin2Fill />
              </ListItemIcon>
              <ListItemText>Remove</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <UniversalModal isOpen={isViewingMore} onClose={handleCloseMore} title={LIstCategoryDisplay[listCategory]}>
        <MoreInfoCard media={userMedia.media} userMedia={userMedia} />
      </UniversalModal>
    </Paper>
  );
}
