import {
  DefaultMediaPage,
  ListSortPreference,
  MediaSortPreference,
  UserPreferences,
} from '../../store/userPreferences';

export type AppProps = {
  storePreferences: (userPreferences: UserPreferences) => void;
};

export type User = {
  username: string;
  listSortPreference: ListSortPreference;
  mediaSortPreference: MediaSortPreference;
  defaultMediaPage: DefaultMediaPage;
};
