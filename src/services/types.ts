export type LoginBody = {
  username: string;
  password: string;
};

export type SignupBody = {
  username: string;
  email: string;
  password: string;
};

export type MakeRequest = (path: string, method: string, body?: unknown, signal?: AbortSignal) => Promise<ApiResponse>;

export type ApiResponse = {
  err: string;
  result: unknown;
  status: number;
  success: boolean;
};

export type OptionalSignal = {
  signal?: AbortSignal;
};

export type MediaType = 'movie' | 'tvShow' | 'videoGame';

export type ListCategory = 'towatch' | 'towatchtv' | 'togame';
export enum ListCategoryEnum {
  towatch = 'towatch',
  towatchtv = 'towatchtv',
  togame = 'togame',
}

export const navBarsToListCategory = (navBar: string): ListCategory => {
  switch (navBar) {
    case 'movies':
      return 'towatch';
    case 'tvShows':
      return 'towatchtv';
    case 'videoGames':
      return 'togame';
    default:
      return 'towatch';
  }
};

export const navBarsToListCategoryDisplay = (navBar: string): string => {
  switch (navBar) {
    case 'movies':
      return 'Movie';
    case 'tvShows':
      return 'Tv Show';
    case 'videoGames':
      return 'Video Game';
    default:
      return '';
  }
};

export const listCategoryToUserMediaCategory = (listCategory: ListCategory): string => {
  switch (listCategory) {
    case 'towatch':
      return 'usermovies';
    case 'towatchtv':
      return 'usertvshows';
    case 'togame':
      return 'uservideogames';
    default:
      return 'usermovies';
  }
};

export enum ListCategoryDisplay {
  towatch = 'Movie',
  towatchtv = 'Tv Show',
  togame = 'Video Game',
}

export type UpdateListBody = {
  listName: string;
  description?: string;
  color?: string;
};

export type ReviewUserMediaBody = {
  userRating?: number;
  reviewNotes?: string;
};

export type SortingOptions = {
  isDescending?: boolean;
  useDateParse?: boolean;
  useUserMedia?: boolean;
  isNumber?: boolean;
};
