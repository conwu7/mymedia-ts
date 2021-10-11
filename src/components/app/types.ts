import { UserPreferences } from '../../store/userPreferences';

export type AppProps = {
  storePreferences: (userPreferences: UserPreferences) => void;
};

export type User = {
  username: string;
  listSortPreference: string;
  mediaSortPreference: string;
  defaultMediaPage: string;
};
