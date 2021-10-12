import useFetchApi from '../../hooks/useFetchApi';
import { getUserDetails } from '../../services/api';
import MediaApp from '../mediaApp/MediaApp';
import OnboardingPage from '../onboardingPage/OnboardingPage';
import Loading from '../utils/loading/Loading';
import './App.css';
import { User } from './types';

function App(): JSX.Element {
  const { data: user, isLoading } = useFetchApi<User>(true, getUserDetails, undefined);

  if (isLoading && !user) return <Loading isLoading={isLoading} />;
  if (!user) return <OnboardingPage />;
  return (
    <div className="App">
      <MediaApp user={user} />
    </div>
  );
}

export default App;
