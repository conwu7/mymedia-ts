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

export type MediaType = 'movie' | 'tvShow';

export type ListCategory = 'towatch' | 'towatchtv';

export enum ListCategoryDisplay {
  towatch = 'Movie',
  towatchtv = 'Tv Show',
}

export type UpdateListBody = {
  listName: string;
  description?: string;
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
