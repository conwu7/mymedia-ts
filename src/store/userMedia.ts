import { ListCategory } from '../services/types';

export type Media = {
  _id: string;
  imdbID: string;
  title?: string;
  plot?: string;
  releaseDate?: string;
  releaseYear?: number;
  runYears: string;
  runtime?: number; //in minutes
  genre?: string[];
  posterUrl?: string;
  imdbRating?: number;
  imdbVotes?: number;
  metascore?: number;
  director?: string[];
  actors?: string[];
  language?: string[];
};

export type Movie = Media;
export type VideoGame = Media;

export type TvShow = {
  imdbID: string;
  title: string;
  plot: string;
  releaseDate: string;
  releaseYear: number;
  runYears: string;
  runtime: number;
  totalSeasons: number;
  genre: string[];
  posterUrl: string;
  imdbRating: number;
  metascore: number;
  actors: string[];
  language: string[];
};

export type UserMedia = {
  _id: string;
  imdbID: string;
  userRating?: number;
  toWatchNotes?: string;
  reviewNotes?: string;
  isWatched?: boolean;
  streamingSource?: string;
};

export interface UserMovie extends UserMedia {
  media: Movie;
}

export interface UserTvShow extends UserMedia {
  media: TvShow;
}

export interface UserVideoGame extends UserMedia {
  media: VideoGame;
}

export type UserMediaCombo = UserMovie | UserTvShow | UserVideoGame;

export type UserMediaListCombo = UserMovie[] | UserTvShow[] | UserVideoGame[];

export type UserMediaComboAction = {
  type: string;
  listType: ListCategory;
  data: UserMediaCombo[];
  dataSingle: UserMediaCombo;
};

export type UserMovieMap = {
  [key: string]: UserMovie;
};
export type UserTvShowMap = {
  [key: string]: UserTvShow;
};
export type UserVideoGameMap = {
  [key: string]: UserVideoGame;
};

export type UserMediaState = {
  towatch: UserMovieMap;
  towatchtv: UserTvShowMap;
  togame: UserVideoGameMap;
};

const initialState: UserMediaState = {
  towatch: {} as UserMovieMap,
  towatchtv: {} as UserTvShowMap,
  togame: {} as UserVideoGameMap,
};

type UserMediaReducer = (state: UserMediaState, action: UserMediaComboAction) => UserMediaState;
const userMediaReducer: UserMediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'storeUserMedia':
      return {
        ...state,
        [action.listType]: action.data.reduce(
          (acc, userMedia: UserMediaCombo): UserMovieMap | UserTvShowMap | UserVideoGameMap => ({
            ...acc,
            [userMedia._id]: userMedia,
          }),
          {},
        ),
      };
    case 'updateUserMedia': {
      const updatedCategoryUserMedia = {
        ...state[action.listType],
        [action.dataSingle._id]: action.dataSingle,
      };
      return {
        ...state,
        [action.listType]: updatedCategoryUserMedia,
      };
    }
    default:
      return state;
  }
};

export default userMediaReducer;
