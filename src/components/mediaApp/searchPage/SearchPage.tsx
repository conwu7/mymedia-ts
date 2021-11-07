import { IconButton, InputLabel, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { GiCancel } from 'react-icons/gi';
import { MdPlaylistAdd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import defaultPoster from '../../../images/default-poster.png';
import { addItemToList, getUserMedia, searchForMedia } from '../../../services/api';
import { SearchSchema } from '../../../services/validation';
import ErrorFieldContainer from '../../utils/errorFieldContainer/ErrorFieldContainer';
import { ListSelectorModal } from '../../utils/listSelector/ListSelector';
import Loading from '../../utils/loading/Loading';
import style from './style.module.scss';
import { ResultCardProps, ResultsContainerProps, SearchBody, SearchProps, SearchResults } from './types';

export default function SearchPage({ hidden }: SearchProps): JSX.Element {
  const [previousSearch, setPreviousSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = { searchString: '' };
  const formik = useFormik({
    initialValues,
    validationSchema: SearchSchema,
    onSubmit: async (values: SearchBody) => {
      document.getElementById('resultsContainer')?.focus();
      setIsLoading(true);
      if (values.searchString === previousSearch) return setIsLoading(false);
      setPreviousSearch(values.searchString);
      const { result, err, status } = await searchForMedia(values.searchString);
      if (status !== 200) {
        setErrorMessage(err);
        setResults(null);
        return setIsLoading(false);
      }
      setErrorMessage('');
      setResults(result as SearchResults[]);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('searchPage')?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 250);
  }, [results]);

  const clearInput = () => {
    formik.resetForm();
  };

  return (
    <div className={`searchPage ${style.searchPage} ${hidden ? style.hidden : ''}`} id="searchPage">
      <div className={style.searchBarContainer}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className={style.searchFormControl}>
            <InputLabel htmlFor="outlined-adornment-searchString">Search</InputLabel>
            <OutlinedInput
              id="searchString"
              name="searchString"
              type="text"
              color="success"
              value={formik.values.searchString}
              onChange={formik.handleChange}
              className={style.searchInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="clear search characters" onClick={clearInput} edge="end">
                    <GiCancel className={style.clearButton} />
                  </IconButton>
                </InputAdornment>
              }
              label="Search"
            />
          </FormControl>
        </form>
        <Button variant="contained" id="searchButton" className={style.searchButton} onClick={formik.submitForm}>
          Search
        </Button>
      </div>
      <ErrorFieldContainer
        showError={!!formik.touched.searchString && !!formik.errors.searchString}
        errorMessage={formik.errors.searchString}
      />
      <ResultsContainer results={results} error={errorMessage} />
      <Loading isLoading={isLoading} />
    </div>
  );
}

function ResultsContainer({ error, results }: ResultsContainerProps): JSX.Element | null {
  return (
    <div className={style.resultsContainer} id="resultsContainer" tabIndex={0}>
      {!results && !error && null}
      {error && error}
      {results && results.map((result) => <ResultCard key={result.imdbId} result={result} />)}
    </div>
  );
}

function ResultCard({ result }: ResultCardProps): JSX.Element {
  return (
    <div className={style.resultCard}>
      <div className={style.posterContainer}>
        <img src={result.posterUrl || defaultPoster} alt="movie poster" className={style.resultImage} />
      </div>
      <div className={style.movieInfoContainer}>
        <h4 className={style.mediaTitle}>{result.title}</h4>
        <p className={style.mediaType}>{result.mediaType}</p>
        <p className={style.actors}>{result.actors}</p>
        <p className={style.releaseDate}>{result.releaseYears || result.releaseDate}</p>
      </div>
      <SearchActionBar result={result} />
    </div>
  );
}

function SearchActionBar({ result }: { result: SearchResults }): JSX.Element {
  const [isAddingToList, setIsAddingToList] = useState(false);

  const dispatch: Dispatch = useDispatch();

  const handleAddToList = (): void => setIsAddingToList(true);
  const handleCloseAddToList = (): void => setIsAddingToList(false);

  // API HANDLERS
  const addMediaToList = async (newListId: string): Promise<void> => {
    const { status, result: apiResult, err } = await addItemToList(result.imdbId, newListId, result.listCategory);
    if (status !== 200) return alert(err);
    const { result: updatedUserMediaList } = await getUserMedia({}, result.listCategory);
    dispatch({
      type: 'storeUserMedia',
      listType: result.listCategory,
      data: updatedUserMediaList || [],
    });
    dispatch({
      type: 'updateList',
      listType: result.listCategory,
      list: apiResult,
    });
    handleCloseAddToList();
  };

  return (
    <div className={style.searchActionContainer}>
      <IconButton onClick={handleAddToList}>
        <MdPlaylistAdd />
      </IconButton>
      <ListSelectorModal
        isOpen={isAddingToList}
        onClose={handleCloseAddToList}
        listCategory={result.listCategory}
        imdbId={result.imdbId}
        onSelect={addMediaToList}
        modalTitle={`Add ${result.title} to`}
      />
    </div>
  );
}
