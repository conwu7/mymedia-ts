import { ListCategory, MediaType } from '../../services/types';

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

export type MoreInfoOnResultsCardProps = {
  isShowingMoreInfo: boolean;
  imdbID: string;
  onClose: () => void;
};

export type MoreMediaDetails = {
  mediaType: MediaType;
  listCategory: ListCategory;
  imdbID: string;
  title: string;
  genre: string[];
  plot: string;
  runtime: number;
  posterUrl: string;
  releaseDate: string;
  releaseYear: number;
  runYears: string;
  imdbRating: number;
  imdbVotes: number;
  metascore: number;
  director: string[];
  actors: string[];
  language: string[];
  createdAt: string;
  updatedAt: string;
  totalSeasons?: number;
};
