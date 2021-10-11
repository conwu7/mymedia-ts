import useFetchApi from '../../hooks/useFetchApi';
import { getUserDetails } from '../../services/api';
import AppDataManager from '../appDataManager/AppDataManager';
import Loading from '../loading/Loading';
import OnboardingPage from '../onboardingPage/OnboardingPage';
import './App.css';
import { User } from './types';

function App(): JSX.Element {
  const { data: user, isLoading } = useFetchApi<User>(getUserDetails, undefined);

  if (isLoading && !user) return <Loading isLoading={isLoading} />;
  if (!user) return <OnboardingPage />;
  return (
    <div className="App">
      <AppDataManager user={user} />
    </div>
  );
}

export default App;
