import { UserPreferences } from '../store/userPreferences';
import {
  ApiResponse,
  ListCategory,
  LoginBody,
  MakeRequest,
  OptionalSignal,
  ReviewUserMediaBody,
  SignupBody,
  UpdateListBody,
} from './types';

const USER_MEDIA_MAP = {
  towatch: 'usermovies',
  towatchtv: 'usertvshows',
  togame: 'uservideogames',
};

const LIST_MEDIA_TYPE_MAP = {
  towatch: 'movies',
  towatchtv: 'tvshows',
  togame: 'videogames',
};

const buildOptions = (body: unknown, method = 'get', signal?: AbortSignal): RequestInit => ({
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: body ? JSON.stringify(body) : null,
  method: method.toUpperCase(),
  signal,
});

const getResponseBody = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const is2xxStatus = (status: number | string): boolean => status.toString()[0] === '2';

const makeRequest: MakeRequest = async (path, method, body, signal) => {
  try {
    return window.fetch(`api/${path}`, buildOptions(body, method, signal)).then(async (response) => {
      const responseBody = await getResponseBody(response);

      return {
        status: response.status,
        success: !!responseBody.success,
        result: is2xxStatus(response.status) ? responseBody : undefined,
        err: responseBody.message,
      };
    });
  } catch {
    return {
      err: 'Unable to reach the server. Make sure you are online',
      result: undefined,
      status: 999,
      success: false,
    };
  }
};

export async function login({ body }: { body: LoginBody }): Promise<ApiResponse> {
  return makeRequest('auth/login', 'post', body);
}

export async function logout(): Promise<ApiResponse> {
  return makeRequest('auth/logout', 'post');
}

export async function signup({ body }: { body: SignupBody }): Promise<ApiResponse> {
  return makeRequest('auth/signup', 'post', body);
}

export async function getUserDetails({ signal }: OptionalSignal): Promise<ApiResponse> {
  return makeRequest('users/me/info', 'get', undefined, signal);
}

export async function getLists({ signal }: OptionalSignal, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`lists/${LIST_MEDIA_TYPE_MAP[listCategory]}`, 'get', undefined, signal);
}

export async function getAllCompletedListsDEPRACATED({ signal }: OptionalSignal): Promise<ApiResponse> {
  return makeRequest(`lists/completed`, 'get', undefined, signal);
}

export async function getUserMedia({ signal }: OptionalSignal, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`usermedia/${USER_MEDIA_MAP[listCategory]}`, 'get', undefined, signal);
}

export async function createList(body: UpdateListBody, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`lists/${LIST_MEDIA_TYPE_MAP[listCategory]}`, 'post', body);
}

export async function updateList(
  body: UpdateListBody,
  listCategory: ListCategory,
  listId: string,
): Promise<ApiResponse> {
  return makeRequest(`lists/${LIST_MEDIA_TYPE_MAP[listCategory]}/${listId}`, 'patch', body);
}

export async function deleteList(listCategory: ListCategory, listId: string): Promise<ApiResponse> {
  return makeRequest(`lists/${LIST_MEDIA_TYPE_MAP[listCategory]}/${listId}`, 'delete');
}

export async function updatePreferences(preferences: UserPreferences): Promise<ApiResponse> {
  return makeRequest('users/me/info', 'patch', preferences);
}

export async function addUserMediaNotes(
  imdbId: string,
  toWatchNotes: string,
  listCategory: ListCategory,
): Promise<ApiResponse> {
  const userMediaType = listCategory === 'towatch' ? 'usermovies' : 'usertvshows';
  return makeRequest(`usermedia/${userMediaType}/${imdbId}`, 'patch', {
    toWatchNotes,
  });
}

export async function reviewUserMedia(
  imdbId: string,
  body: ReviewUserMediaBody,
  listCategory: ListCategory,
): Promise<ApiResponse> {
  return makeRequest(`usermedia/${USER_MEDIA_MAP[listCategory]}/${imdbId}`, 'patch', body);
}

export async function addItemToList(imdbId: string, listId: string, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`lists/${LIST_MEDIA_TYPE_MAP[listCategory]}/${listId}/${imdbId}`, 'post');
}

export async function removeItemFromList(
  imdbId: string,
  listId: string,
  listCategory: ListCategory,
): Promise<ApiResponse> {
  return makeRequest(`lists/${LIST_MEDIA_TYPE_MAP[listCategory]}/${listId}/${imdbId}`, 'delete');
}

export async function searchForMedia(searchString: string): Promise<ApiResponse> {
  return makeRequest(`media/search?searchString=${searchString}`, 'get');
}

export async function getMoreMediaDetails(imdbID: string): Promise<ApiResponse> {
  return makeRequest(`media/${imdbID}`, 'get');
}

export async function markAsWatched(listCategory: ListCategory, imdbId: string): Promise<ApiResponse> {
  return makeRequest(`lists/watched/${LIST_MEDIA_TYPE_MAP[listCategory]}/${imdbId}`, 'post');
}
