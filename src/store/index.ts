import { RootStateOrAny } from 'react-redux';
import { combineReducers, createStore, Store } from 'redux';
import listsReducer from './lists';
import userMediaReducer from './userMedia';
import userPreferencesReducer from './userPreferences';

const rootReducer = combineReducers({
  userPreferences: userPreferencesReducer,
  lists: listsReducer,
  userMedia: userMediaReducer,
});

const store: Store<RootStateOrAny> = createStore(rootReducer);

export default store;
