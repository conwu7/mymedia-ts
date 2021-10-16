import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { SyntheticEvent, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { createList, updateList, updatePreferences } from '../../../../services/api';
import { UpdateListBody } from '../../../../services/types';
import { UpdateListSchema } from '../../../../services/validation';
import { UserPreferences } from '../../../../store/userPreferences';
import { FormTextField } from '../../../onboardingPage/userForm/UserForm';
import ErrorFieldContainer from '../../../utils/errorFieldContainer/ErrorFieldContainer';
import Loading from '../../../utils/loading/Loading';
import style from './style.module.scss';
import { EditListFormProps, ListFormProps, NewListFormProps, PreferencesFormProps } from './types';

export function EditListForm(props: EditListFormProps): JSX.Element {
  const [error, setError] = useState('');
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
      setIsLoading(false);
      if (err) return setError(err);
      dispatch({
        type: 'updateList',
        listType: props.listCategory,
        list: result,
      });
      props.onClose();
    },
  });
  return <ListForm formik={formik} isLoading={isLoading} error={error} />;
}

export function NewListForm(props: NewListFormProps): JSX.Element {
  const [error, setError] = useState('');
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
      setIsLoading(false);
      if (err) return setError(err);
      dispatch({
        type: 'createList',
        listType: props.listCategory,
        list: result,
      });
      props.onClose();
    },
  });

  return <ListForm formik={formik} isLoading={isLoading} error={error} />;
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
    if (
      preferences.listSortPreference === listSortPreference &&
      preferences.mediaSortPreference === mediaSortPreference &&
      preferences.defaultMediaPage === defaultMediaPage
    ) {
      return onClose();
    }
    setIsLoading(true);
    const { result, err } = await updatePreferences(preferences);
    if (err) window.alert('Failed to save');
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
          </Select>
        </FormControl>
        <Button onClick={handleSubmit} className={style.submitBtn} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Save
        </Button>
      </form>
    </div>
  );
}
