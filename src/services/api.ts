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

const buildFullPath = (path: string) => `api/${path}`;

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

const makeRequest: MakeRequest = async (path, method, body, signal) => {
  try {
    return window.fetch(buildFullPath(path), buildOptions(body, method, signal)).then(async (response) => {
      return {
        ...(await response.json()),
        status: response.status,
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
  return makeRequest('login', 'post', body);
}

export async function logout(): Promise<ApiResponse> {
  return makeRequest('logout', 'post');
}

export async function signup({ body }: { body: SignupBody }): Promise<ApiResponse> {
  return makeRequest('signup', 'post', body);
}

export async function getUserDetails({ signal }: OptionalSignal): Promise<ApiResponse> {
  return makeRequest('getuserdetails', 'get', undefined, signal);
}

export async function getLists({ signal }: OptionalSignal, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}`, 'get', undefined, signal);
}

export async function getAllCompletedLists({ signal }: OptionalSignal): Promise<ApiResponse> {
  return makeRequest(`lists/completed`, 'get', undefined, signal);
}

export async function getUserMedia({ signal }: OptionalSignal, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(listCategory === 'towatch' ? 'usermovies' : 'usertvshows', 'get', undefined, signal);
}

export async function createList(body: UpdateListBody, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}`, 'post', body);
}

export async function updateList(
  body: UpdateListBody,
  listCategory: ListCategory,
  listId: string,
): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}/${listId}`, 'put', body);
}

export async function deleteList(listCategory: ListCategory, listId: string): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}/${listId}`, 'delete');
}

export async function updatePreferences(preferences: UserPreferences): Promise<ApiResponse> {
  return makeRequest('user/preferences', 'put', preferences);
}

export async function addUserMediaNotes(
  imdbId: string,
  toWatchNotes: string,
  listCategory: ListCategory,
): Promise<ApiResponse> {
  return makeRequest(`${listCategory === 'towatch' ? 'usermovies' : 'usertvshows'}/${imdbId}`, 'put', {
    toWatchNotes,
  });
}

export async function reviewUserMedia(
  imdbId: string,
  body: ReviewUserMediaBody,
  listCategory: ListCategory,
): Promise<ApiResponse> {
  return makeRequest(`${listCategory === 'towatch' ? 'usermovies' : 'usertvshows'}/${imdbId}`, 'put', body);
}

export async function addItemToList(imdbId: string, listId: string, listCategory: ListCategory): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}/${listId}/${imdbId}`, 'post');
}

export async function removeItemFromList(
  imdbId: string,
  listId: string,
  listCategory: ListCategory,
): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}/${listId}/${imdbId}`, 'delete');
}

export async function searchForMedia(searchString: string): Promise<ApiResponse> {
  return makeRequest(`search?searchString=${searchString}`, 'get');
}

export async function markComplete(listCategory: ListCategory, imdbId: string): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}/${imdbId}/completed`, 'post');
}

export async function markIncomplete(listCategory: ListCategory, imdbId: string): Promise<ApiResponse> {
  return makeRequest(`lists/${listCategory}/${imdbId}/completed`, 'delete');
}
