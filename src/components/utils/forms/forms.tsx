import { FormControl, InputLabel, MenuItem, Rating, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { SyntheticEvent, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import {
  addUserMediaNotes,
  createList,
  markAsWatched,
  reviewUserMedia,
  updateList,
  updatePreferences,
} from '../../../services/api';
import { alertFactory, handleApiErrors } from '../../../services/errorHelpers';
import { ReviewUserMediaBody, UpdateListBody } from '../../../services/types';
import { UpdateListSchema, UserMediaNotesSchema, UserMediaSchema } from '../../../services/validation';
import { UserPreferences } from '../../../store/userPreferences';
import { FormTextField } from '../userForm/UserForm';
import ErrorFieldContainer from '../errorFieldContainer/ErrorFieldContainer';
import Loading from '../loading/Loading';
import style from './style.module.scss';
import {
  AddMediaNotesFormProps,
  EditListFormProps,
  ListFormProps,
  NewListFormProps,
  PreferencesFormProps,
  ReviewUserMediaFormProps,
} from './types';

export function EditListForm(props: EditListFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues: UpdateListBody = {
    listName: props.listName,
    description: props.description || '',
  };
  const dispatch: Dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateListSchema,
    onSubmit: async (values: UpdateListBody) => {
      setIsLoading(true);

      const { err, result } = await updateList(values, props.listCategory, props.listId);

      if (err) {
        return handleApiErrors(err, alertFactory(`Unable to save changes - ${err}`), setIsLoading);
      }

      dispatch({
        type: 'updateList',
        listType: props.listCategory,
        list: result,
      });

      setIsLoading(false);
      props.onClose();
    },
  });
  return <ListForm formik={formik} isLoading={isLoading} />;
}

export function NewListForm(props: NewListFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues: UpdateListBody = {
    listName: '',
    description: '',
  };
  const dispatch: Dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateListSchema,
    onSubmit: async (values: UpdateListBody) => {
      setIsLoading(true);

      const { err, result } = await createList(values, props.listCategory);

      if (err) {
        return handleApiErrors(err, alertFactory(`Unable to save list - ${err}`), setIsLoading);
      }

      dispatch({
        type: 'createList',
        listType: props.listCategory,
        list: result,
      });
      setIsLoading(false);
      props.onClose();
    },
  });

  return <ListForm formik={formik} isLoading={isLoading} />;
}

function ListForm({ formik, isLoading, error }: ListFormProps): JSX.Element {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      className={style.listForm}
    >
      <FormTextField label="List Name" name={'listName'} formik={formik} required={true} isMultiLine={true} />
      <FormTextField
        label="Description"
        name={'description'}
        formik={formik}
        required={false}
        showErrorImmediately={true}
        isMultiLine={true}
      />
      <ErrorFieldContainer showError={Boolean(error)} errorMessage={error} />
      <Button
        onClick={formik.submitForm}
        className={style.submitBtn}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Save
      </Button>
      <Loading isLoading={isLoading} />
    </Box>
  );
}

export function PreferencesForm(props: PreferencesFormProps): JSX.Element {
  const { listSortPreference, mediaSortPreference, defaultMediaPage } = useSelector(
    (state: { userPreferences: UserPreferences }) => state.userPreferences,
    shallowEqual,
  );
  const { onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setSortPreferences] = useState<UserPreferences>({
    listSortPreference: !listSortPreference || listSortPreference === 'default' ? 'created+' : listSortPreference,
    mediaSortPreference: !mediaSortPreference || mediaSortPreference === 'default' ? 'added+' : mediaSortPreference,
    defaultMediaPage: defaultMediaPage || 'movies',
  });

  const dispatch: Dispatch = useDispatch();

  // eslint-disable-next-line
  const handleChange = (e: any): void => {
    setSortPreferences({
      ...preferences,
      [e.target?.name]: e.target?.value,
    });
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      preferences.listSortPreference === listSortPreference &&
      preferences.mediaSortPreference === mediaSortPreference &&
      preferences.defaultMediaPage === defaultMediaPage
    ) {
      setIsLoading(false);
      return onClose();
    }

    const { result, err } = await updatePreferences(preferences);

    if (err) {
      return handleApiErrors(err, alertFactory('Failed to save preferences'), setIsLoading);
    }

    dispatch({
      type: 'storeUserPreferences',
      data: result,
    });
    setIsLoading(false);
    onClose();
  };
  return (
    <div className={style.preferenceFormContainer}>
      <Loading isLoading={isLoading} />
      <form onSubmit={handleSubmit} className={style.preferenceForm}>
        <FormControl fullWidth>
          <InputLabel id="listSortPreferenceLabel">List Sort</InputLabel>
          <Select
            labelId="listSortPreferenceLabel"
            id="listSortPreference"
            sx={{ m: 1 }}
            name="listSortPreference"
            value={preferences.listSortPreference}
            label="List Sort"
            onChange={handleChange}
          >
            <MenuItem value="alpha+">Alpha - A to Z</MenuItem>
            <MenuItem value="alpha-">Alpha - Z to A</MenuItem>
            <MenuItem value="created+">Date Created - Old to New</MenuItem>
            <MenuItem value="created-">Date Created - New to Old</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="mediaSortPreferenceLabel">Media Sort</InputLabel>
          <Select
            labelId="mediaSortPreference"
            id="mediaSortPreference"
            sx={{ m: 1 }}
            name="mediaSortPreference"
            value={preferences.mediaSortPreference}
            label="Media Sort"
            onChange={handleChange}
          >
            <MenuItem value="alpha+">Alpha - A to Z</MenuItem>
            <MenuItem value="alpha-">Alpha - Z to A</MenuItem>
            <MenuItem value="added+">Date Added - Old to New</MenuItem>
            <MenuItem value="added-">Date Added - New to Old</MenuItem>
            <MenuItem value="imdb+">IMDB Rating - Lowest to Highest</MenuItem>
            <MenuItem value="imdb-">IMDB Rating - Highest to Lowest</MenuItem>
            <MenuItem value="release+">Release Year - Old to New</MenuItem>
            <MenuItem value="release-">Release Year - New to Old</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="defaultMediaPageLabel">Default Media Page</InputLabel>
          <Select
            labelId="defaultMediaPageLabel"
            id="defaultMediaPage"
            name="defaultMediaPage"
            sx={{ m: 1 }}
            value={preferences.defaultMediaPage}
            label="Default Media Tab"
            onChange={handleChange}
          >
            <MenuItem value="movies">Movies</MenuItem>
            <MenuItem value="tvShows">Tv Shows</MenuItem>
            <MenuItem value="videoGames">Video Games</MenuItem>
            <MenuItem value="lastViewed">Last Viewed</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleSubmit} className={style.submitBtn} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Save
        </Button>
      </form>
    </div>
  );
}

export function AddMediaNotesForm({
  listCategory,
  imdbId,
  toWatchNotes,
  onClose,
}: AddMediaNotesFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: Dispatch = useDispatch();

  const initialValues: { toWatchNotes: string } = { toWatchNotes: toWatchNotes || '' };

  const formik = useFormik({
    initialValues,
    validationSchema: UserMediaNotesSchema,
    onSubmit: async (values: { toWatchNotes: string }) => {
      setIsLoading(true);
      const { err, result } = await addUserMediaNotes(imdbId, values.toWatchNotes, listCategory);

      if (err) {
        return handleApiErrors(err, alertFactory('Unable to save notes'), setIsLoading);
      }

      dispatch({
        type: 'updateUserMedia',
        listType: listCategory,
        dataSingle: result,
      });

      setIsLoading(false);
      onClose();
    },
  });

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      className={style.addMediaNotesForm}
    >
      <FormTextField
        label="Watch Notes"
        showErrorImmediately={true}
        name={'toWatchNotes'}
        formik={formik}
        required={true}
        isMultiLine={true}
        minRows={7}
      />
      <Button
        onClick={formik.submitForm}
        className={style.submitBtn}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Save
      </Button>
      <Loading isLoading={isLoading} />
    </Box>
  );
}

export function ReviewUserMediaForm({
  listCategory,
  imdbId,
  reviewNotes,
  userRating: oldUserRating,
  onClose,
  hideCompleteButton,
}: ReviewUserMediaFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(oldUserRating || 0);
  const [isMarkingAsWatched, setIsMarkingAsWatched] = useState(false);

  const dispatch: Dispatch = useDispatch();

  const initialValues: ReviewUserMediaBody = { reviewNotes: reviewNotes || '' };

  const formik = useFormik({
    initialValues,
    validationSchema: UserMediaSchema,
    onSubmit: async (values: ReviewUserMediaBody) => {
      setIsLoading(true);

      const { err, result } = await reviewUserMedia(imdbId, { ...values, userRating }, listCategory);
      if (err) {
        return handleApiErrors(err, alertFactory('Unable to save'), setIsLoading);
      }

      if (isMarkingAsWatched) {
        const { err: markAsWatchedError, result: markAsWatchedResponse } = await markAsWatched(listCategory, imdbId);

        if (markAsWatchedError) {
          return handleApiErrors(markAsWatchedError, alertFactory('Unable to mark complete'), setIsLoading);
        }

        dispatch({
          type: 'updateList',
          listType: listCategory,
          list: markAsWatchedResponse,
        });
      }

      dispatch({
        type: 'updateUserMedia',
        listType: listCategory,
        dataSingle: result,
      });

      setIsLoading(false);
      onClose(isMarkingAsWatched ? 'complete' : undefined);
    },
  });

  const handleMarkAsWatched = async (): Promise<void> => {
    setIsMarkingAsWatched(true);
    await formik.submitForm();
  };

  const handleUserRating = (_event: SyntheticEvent, newValue: number | null): void => {
    setUserRating(newValue || 0);
  };
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      className={style.reviewForm}
    >
      <Rating className={style.userRating} name="userRating" value={userRating} onChange={handleUserRating} max={10} />
      <FormTextField
        label="Review Notes"
        showErrorImmediately={true}
        name={'reviewNotes'}
        formik={formik}
        required={false}
        isMultiLine={true}
        minRows={5}
      />
      <div className={style.saveAndCompleteContainer}>
        <Button
          onClick={formik.submitForm}
          className={style.submitBtn}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
        {!hideCompleteButton && (
          <Button
            onClick={handleMarkAsWatched}
            className={style.completeButton}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Complete
          </Button>
        )}
      </div>
      <Loading isLoading={isLoading} />
    </Box>
  );
}
