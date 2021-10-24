import { ListCategory } from '../../../services/types';

export type SearchProps = {
  hidden: boolean;
};

export type SearchBody = {
  searchString: string;
};

export type SearchResults = {
  listCategory: ListCategory;
  posterUrl: string | null;
  title: string;
  mediaType: string;
  actors: string;
  imdbId: string;
  releaseDate: string;
  releaseYears?: string;
};

export type ResultsContainerProps = {
  results: SearchResults[] | null;
  error: string;
};

export type ResultCardProps = {
  result: SearchResults;
};
