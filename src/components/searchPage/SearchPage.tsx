import { IconButton, InputLabel, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { GiCancel } from 'react-icons/gi';
import { MdPlaylistAdd } from 'react-icons/md';
import defaultPoster from '../../images/default-poster.png';
import { getMoreMediaDetails, is2xxStatus, searchForMedia } from '../../services/api';
import { SearchSchema } from '../../services/validation';
import ErrorFieldContainer from '../utils/errorFieldContainer/ErrorFieldContainer';
import { AddToListModal } from '../utils/listSelector/ListSelector';
import Loading, { LoadingWithoutModal } from '../utils/loading/Loading';
import style from './style.module.scss';
import {
  MoreInfoOnResultsCardProps,
  MoreMediaDetails,
  ResultCardProps,
  ResultsContainerProps,
  SearchBody,
  SearchProps,
  SearchResults,
} from './types';
import { UniversalDrawer } from '../utils/universalModal/UniversalModal';
import MoreInfoCard from '../moreInfo/MoreInfoCard';
import { IoMdInformationCircleOutline } from 'react-icons/io';

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
      if (!is2xxStatus(status)) {
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
      {error ?? null}
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
  const [isShowingMoreInfo, setIsShowingMoreInfo] = useState(false);

  const handleAddToList = (): void => setIsAddingToList(true);
  const handleCloseAddToList = (): void => setIsAddingToList(false);

  const handleShowMoreInfo = (): void => setIsShowingMoreInfo(true);
  const handleCloseShowMoreInfo = (): void => setIsShowingMoreInfo(false);

  return (
    <div className={style.searchActionContainer}>
      <IconButton onClick={handleAddToList} className={style.addToListBtn}>
        <MdPlaylistAdd />
      </IconButton>
      <IconButton onClick={handleShowMoreInfo} className={style.moreInfoBtn}>
        <IoMdInformationCircleOutline />
      </IconButton>
      <AddToListModal
        isOpen={isAddingToList}
        listCategory={result.listCategory}
        imdbId={result.imdbId}
        onSelect={handleCloseAddToList}
        onCancel={handleCloseAddToList}
        modalTitle={`Add '${result.title}' to`}
      />
      <MoreInfoOnResultCardModal
        isShowingMoreInfo={isShowingMoreInfo}
        imdbID={result.imdbId}
        onClose={handleCloseShowMoreInfo}
      />
    </div>
  );
}

function MoreInfoOnResultCardModal({ isShowingMoreInfo, imdbID, onClose }: MoreInfoOnResultsCardProps): JSX.Element {
  const [mediaDetails, setMediaDetails] = useState<MoreMediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMediaDetails = async (imdbId: string) => {
    setIsLoading(true);

    const response = await getMoreMediaDetails(imdbId);

    if (!is2xxStatus(response.status)) {
      setError('Failed to get more info on this title');
      setIsLoading(false);
      return;
    }

    setMediaDetails(response.result as MoreMediaDetails);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isShowingMoreInfo) return;

    if (!!mediaDetails) return;

    getMediaDetails(imdbID).catch((e) => console.log(e));
  }, [imdbID, isShowingMoreInfo]);

  return (
    <UniversalDrawer isOpen={isShowingMoreInfo} onClose={onClose} title={mediaDetails?.title ?? ''}>
      <>
        <LoadingWithoutModal isLoading={isLoading} />
        {!!error && <p>{error}</p>}
        {!!mediaDetails && <MoreInfoCard media={mediaDetails} />}
      </>
    </UniversalDrawer>
  );
}
