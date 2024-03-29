import { IconButton, Link, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { SyntheticEvent, useEffect, useState } from 'react';
import { AiTwotoneCopy } from 'react-icons/ai';
import { CgMoveRight, CgNotes } from 'react-icons/cg';
import { MdRateReview } from 'react-icons/md';
import { RiDeleteBin2Fill, RiMore2Fill } from 'react-icons/ri';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import defaultPoster from '../../images/default-poster.png';
import { addItemToList, is2xxStatus, removeItemFromList } from '../../services/api';
import { List } from '../../store/lists';
import { Movie, TvShow, UserMediaCombo, UserMediaState } from '../../store/userMedia';
import { UserMediaCardProps } from '../listsPage/types';
import MoreInfoCard from '../moreInfo/MoreInfoCard';
import { AddMediaNotesForm, ReviewUserMediaForm } from '../utils/forms/forms';
import { ListSelectorModal } from '../utils/listSelector/ListSelector';
import Loading from '../utils/loading/Loading';
import { UniversalDrawer } from '../utils/universalModal/UniversalModal';
import style from './style.module.scss';
import { ListCategory } from '../../services/types';
import { alertFactory } from '../../services/errorHelpers';

export default function UserMediaCard({
  userMediaId,
  listCategory,
  currentListId,
  currentListName,
}: UserMediaCardProps): JSX.Element {
  const userMedia: UserMediaCombo = useSelector(
    (state: { userMedia: UserMediaState }) => state.userMedia?.[listCategory]?.[userMediaId],
    shallowEqual,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isViewingMore, setIsViewingMore] = useState(false);
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [isReviewingMedia, setIsReviewingMedia] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [updatedList, setUpdatedList] = useState<List | null>(null);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const dispatch: Dispatch = useDispatch();
  // MORE - MEDIA INFO
  const handleOpenMore = (): void => setIsViewingMore(true);
  const handleCloseMore = (): void => setIsViewingMore(false);
  // ACTION MENU
  const handleOpenActionMenu = (event: SyntheticEvent): void => setAnchorEl(event.currentTarget);
  const handleCloseActionMenu = (): void => setAnchorEl(null);
  // ADD NOTES
  const handleOpenAddNotes = (): void => {
    handleCloseActionMenu();
    setIsAddingNotes(true);
  };
  const handleCloseAddNotes = (): void => setIsAddingNotes(false);
  // REVIEW MEDIA
  const handleOpenReview = (): void => {
    handleCloseActionMenu();
    setIsReviewingMedia(true);
  };
  const handleCloseReview = (action?: string): void => {
    setIsReviewingMedia(false);
    if (action && action === 'complete') {
      removeMediaFromList().catch(() => undefined);
    }
  };
  // MOVE MEDIA
  const handleMoveMedia = (): void => {
    handleCloseActionMenu();
    setIsMoving(true);
  };
  const handleCloseMoveMedia = (): void => setIsMoving(false);
  // COPY MEDIA
  const handleCopyMedia = (): void => {
    handleCloseActionMenu();
    setIsCopying(true);
  };
  const handleCloseCopyMedia = (): void => setIsCopying(false);

  // API HANDLERS
  const copyMediaToList = async (newListId: string): Promise<void> => {
    const { status, result, err } = await addItemToList(media.imdbID, newListId, listCategory);
    if (!is2xxStatus(status))
      return alertFactory(
        { dialogContentText: err, dialogTitle: 'Failed to copy item', isFailedAlert: true },
        dispatch,
      )();
    dispatch({
      type: 'updateList',
      listType: listCategory,
      list: result,
    });
    handleCloseCopyMedia();
  };
  const removeMediaFromList = async (): Promise<void> => {
    handleCloseActionMenu();
    setIsLoading(true);
    const { status, result, err } = await removeItemFromList(media.imdbID, currentListId, listCategory);
    if (!is2xxStatus(status)) {
      setIsLoading(false);
      return alertFactory(
        { dialogContentText: err, dialogTitle: 'Failed to remove item', isFailedAlert: true },
        dispatch,
      )();
    }
    setUpdatedList(result as List);
    setIsDeleted(true);
    setIsLoading(false);
  };

  const moveMediaToList = async (newListId: string): Promise<void> => {
    setIsLoading(true);
    await copyMediaToList(newListId);
    await removeMediaFromList();
    setIsLoading(false);
    handleCloseMoveMedia();
  };

  // complete remove from list
  useEffect(() => {
    if (!isDeleted) return;
    setTimeout(() => {
      dispatch({
        type: 'updateList',
        listType: listCategory,
        list: updatedList,
      });
    }, 400);
  }, [isDeleted]);

  if (!userMedia) return <span>🙈</span>;

  const { media } = userMedia;

  return (
    <Paper className={`${style.userMediaCard} ${isDeleted ? style.deleted : ''}`}>
      <div className={style.posterContainer}>
        <img src={media.posterUrl || defaultPoster} alt={media.title + ' poster'} className={style.poster} />
      </div>
      <div className={style.mediaInfo}>
        <UserMediaInfo media={media} listCategory={listCategory} />
        <div className={style.userMediaActionsContainer}>
          <Button variant="contained" className={style.moreInfoButton} onClick={handleOpenMore}>
            More
          </Button>
          <IconButton className={style.actionButtonWrapper} onClick={handleOpenActionMenu}>
            <RiMore2Fill />
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
              onClick={handleOpenAddNotes}
              className={`${style.actionMenuItem} ${style.addNotesActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <CgNotes />
              </ListItemIcon>
              <ListItemText>Add notes</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleOpenReview}
              className={`${style.actionMenuItem} ${style.reviewActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <MdRateReview />
              </ListItemIcon>
              <ListItemText>Review</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleMoveMedia}
              className={`${style.actionMenuItem} ${style.moveActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <CgMoveRight />
              </ListItemIcon>
              <ListItemText>Move</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleCopyMedia}
              className={`${style.actionMenuItem} ${style.copyActionMenuItem}`}
              divider
            >
              <ListItemIcon>
                <AiTwotoneCopy />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem onClick={removeMediaFromList} className={`${style.actionMenuItem} ${style.removeActionMenuItem}`}>
              <ListItemIcon>
                <RiDeleteBin2Fill />
              </ListItemIcon>
              <ListItemText>Remove</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <UniversalDrawer isOpen={isViewingMore} onClose={handleCloseMore} title={media.title}>
        <MoreInfoCard media={userMedia.media} userMedia={userMedia} />
      </UniversalDrawer>
      <UniversalDrawer isOpen={isAddingNotes} onClose={handleCloseAddNotes} title={media.title}>
        <AddMediaNotesForm
          toWatchNotes={userMedia.toWatchNotes}
          onClose={handleCloseAddNotes}
          listCategory={listCategory}
          imdbId={userMedia.imdbID}
        />
      </UniversalDrawer>
      <UniversalDrawer isOpen={isReviewingMedia} onClose={handleCloseReview} title={`Review - ${media.title}`}>
        <ReviewUserMediaForm
          onClose={handleCloseReview}
          listCategory={listCategory}
          imdbId={userMedia.imdbID}
          userRating={userMedia.userRating}
          reviewNotes={userMedia.reviewNotes}
          hideCompleteButton={currentListName?.toLowerCase() === 'watched'}
        />
      </UniversalDrawer>
      <ListSelectorModal
        isOpen={isMoving}
        onClose={handleCloseMoveMedia}
        listCategory={listCategory}
        imdbId={userMedia.imdbID}
        onSelect={moveMediaToList}
        modalTitle={`Move '${media.title}' to`}
      />
      <ListSelectorModal
        isOpen={isCopying}
        onClose={handleCloseCopyMedia}
        listCategory={listCategory}
        imdbId={userMedia.imdbID}
        onSelect={copyMediaToList}
        modalTitle={`Copy '${media.title}' to`}
      />
      <Loading isLoading={isLoading} />
    </Paper>
  );
}

function UserMediaInfo({ media, listCategory }: { media: Movie | TvShow; listCategory: ListCategory }): JSX.Element {
  return (
    <>
      <h1 className={style.mediaTitle}>{media.title}</h1>
      <div className={style.releaseYearRuntimeContainer}>
        <p className={style.releaseYear}>{media.runYears || media.releaseYear} </p>
        {!media.runYears && <p className={style.runtime}>({media.runtime ? media.runtime : '-'} min)</p>}
      </div>
      {/*<p className={style.streamingSource}>{userMedia.streamingSource && userMedia.streamingSource.toUpperCase()}</p>*/}
      {listCategory !== 'togame' && (
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
      )}
    </>
  );
}
