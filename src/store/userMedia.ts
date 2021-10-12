export type Movie = {
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

export type UserMediaCombo = UserMovie | UserTvShow;

export type UserMediaListCombo = UserMovie[] | UserTvShow[];

export type UserMediaComboAction = {
  type: string;
  listType: 'towatch' | 'towatchtv' | 'completed' | 'completedtv';
  data: UserMediaCombo[];
};

export type UserMovieMap = {
  [key: string]: UserMovie;
};
export type UserTvShowMap = {
  [key: string]: UserTvShow;
};

export type UserMediaState = {
  towatch: UserMovieMap;
  towatchtv: UserTvShowMap;
  completed: UserMovieMap;
  completedtv: UserTvShowMap;
};

const initialState: UserMediaState = {
  towatch: {} as UserMovieMap,
  towatchtv: {} as UserTvShowMap,
  completed: {} as UserMovieMap,
  completedtv: {} as UserTvShowMap,
};

type UserMediaReducer = (state: UserMediaState, action: UserMediaComboAction) => UserMediaState;
const userMediaReducer: UserMediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'storeUserMedia':
      return {
        ...state,
        [action.listType]: action.data.reduce(
          (acc, userMedia: UserMediaCombo): UserMovieMap | UserTvShowMap => ({
            ...acc,
            [userMedia._id]: userMedia,
          }),
          {},
        ),
      };
    default:
      return state;
  }
};

export default userMediaReducer;
