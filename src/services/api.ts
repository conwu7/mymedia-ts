import { ApiResponse, LoginBody, SignupBody } from './types';

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

const makeRequest = async (
  path: string,
  method: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<ApiResponse> => {
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

export async function getUserDetails({ signal }: { signal: AbortSignal }): Promise<ApiResponse> {
  return makeRequest('getuserdetails', 'get', undefined, signal);
}
