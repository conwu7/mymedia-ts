import { SyntheticEvent } from 'react';

export type NavigationTab = 'towatch' | 'towatchtv' | 'search' | 'more';

export type BottomNavigationProps = {
  handleChange: (event: SyntheticEvent, newTab: NavigationTab) => void;
  currentTab: NavigationTab;
};
