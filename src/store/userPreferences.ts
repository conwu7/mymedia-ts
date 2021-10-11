export type UserPreferences = {
  listSortPreference?: 'alpha+' | 'alpha-' | 'created+' | 'created-';
  mediaSortPreference?: 'alpha+' | 'alpha-' | 'added+' | 'added-' | 'imdb+' | 'imdb-' | 'release+' | 'release-';
  defaultMediaPage?: 'movies' | 'tvShows';
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
        listSortPreference: action.data.listSortPreference,
        mediaSortPreference: action.data.mediaSortPreference,
        defaultMediaPage: action.data.defaultMediaPage,
      };
    default:
      return state;
  }
};

export default userPreferencesReducer;
