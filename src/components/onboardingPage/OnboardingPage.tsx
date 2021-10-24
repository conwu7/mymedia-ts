import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import AppHeader from '../utils/appHeader/AppHeader';
import LoginPage from './loginPage/LoginPage';
import SignupPage from './signupPage/SignupPage';
import SitePreviewPage from './sitePreviewPage/SitePreviewPage';
import style from './style.module.scss';
import { HandlePageChange, OnboardingPages, OnboardingPagesDisplayText } from './types';

export default function OnboardingPage(): JSX.Element {
  const [page, setPage] = useState<OnboardingPages>('home');

  const handlePageChange: HandlePageChange = (event, newPage) => setPage(newPage);

  return (
    <>
      <AppHeader useSticky={true} unAuthenticated={true} />
      <AppBar color="default" className={style.tabSwitcherContainer}>
        <Tabs value={page} onChange={handlePageChange} centered>
          <Tab label={OnboardingPagesDisplayText.home} value="home" className={style.tab} />
          <Tab label={OnboardingPagesDisplayText.signup} value="signup" className={style.tab} />
          <Tab label={OnboardingPagesDisplayText.login} value="login" className={style.tab} />
        </Tabs>
      </AppBar>
      <Box>
        {page === 'home' && <SitePreviewPage />}
        {page === 'signup' && <SignupPage />}
        {page === 'login' && <LoginPage />}
      </Box>
    </>
  );
}
