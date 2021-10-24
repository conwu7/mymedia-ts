import { Route, Switch } from 'react-router-dom';
import useFetchApi from '../../hooks/useFetchApi';
import { getUserDetails } from '../../services/api';
import MediaApp from '../mediaApp/MediaApp';
import OnboardingPage from '../onboardingPage/OnboardingPage';
import './App.css';
import { User } from './types';

function App(): JSX.Element | null {
  const { data: user, isLoading } = useFetchApi<User>(true, getUserDetails, undefined);

  if (isLoading && !user) return null;
  return (
    <Switch>
      {!user && <OnboardingPage />}
      {user && (
        <Route path="/">
          <div className="App">
            <MediaApp user={user} />
          </div>
        </Route>
      )}
    </Switch>
  );
}

export default App;
