import { ApiResponse, ListCategory, LoginBody, MakeRequest, OptionalSignal, SignupBody, UpdateListBody } from './types';

const addBase = (path: string) => `api/${path}`;

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
    return window.fetch(addBase(path), buildOptions(body, method, signal)).then(async (response) => {
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
