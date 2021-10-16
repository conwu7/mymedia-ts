export type ListSortPreference = 'alpha+' | 'alpha-' | 'created+' | 'created-' | 'default' | undefined;
export type MediaSortPreference =
  | 'alpha+'
  | 'alpha-'
  | 'added+'
  | 'added-'
  | 'imdb+'
  | 'imdb-'
  | 'release+'
  | 'release-'
  | 'default'
  | undefined;
export type DefaultMediaPage = 'movies' | 'tvShows' | 'default' | undefined;

export type UserPreferences = {
  listSortPreference?: ListSortPreference;
  mediaSortPreference?: MediaSortPreference;
  defaultMediaPage?: DefaultMediaPage;
};

export type UserPreferencesAction = {
  type: string;
  data: UserPreferences;
};

export type DispatchType = (args: UserPreferences) => UserPreferencesAction;

const initialState: UserPreferences = {
  listSortPreference: undefined,
  mediaSortPreference: undefined,
  defaultMediaPage: undefined,
};

const userPreferencesReducer = (
  state: UserPreferences = initialState,
  action: UserPreferencesAction,
): UserPreferences => {
  switch (action.type) {
    case 'storeUserPreferences':
      return {
        listSortPreference: action.data?.listSortPreference,
        mediaSortPreference: action.data?.mediaSortPreference,
        defaultMediaPage: action.data?.defaultMediaPage,
      };
    default:
      return state;
  }
};

export default userPreferencesReducer;
