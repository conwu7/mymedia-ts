import Button from '@mui/material/Button';
import useFetchApi from '../../hooks/useFetchApi';
import { getUserDetails, logout } from '../../services/api';
import Loading from '../loading/Loading';
import OnboardingPage from '../onboardingPage/OnboardingPage';
import './App.css';

function App(): JSX.Element {
  const { data: user, isLoading } = useFetchApi(getUserDetails);

  if (isLoading && !user) return <Loading isLoading={isLoading} />;
  if (!user) return <OnboardingPage />;

  const handleLogout = async () => {
    if (!window.confirm('Are you sure?')) return;
    const { status } = await logout();
    if (status === 200) return window.location.reload();
    alert('There was issue with that request');
  };
  return (
    <div className="App">
      The main app
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default App;
