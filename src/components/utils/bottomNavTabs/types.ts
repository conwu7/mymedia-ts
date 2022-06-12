import { SyntheticEvent } from 'react';
import { NavigationTab } from '../../mediaApp/types';

export type BottomNavigationProps<T> = {
  handleChange: (event: SyntheticEvent, newTab: NavigationTab) => void;
  currentTab: T;
  bottomNavBarItems: BottomNavBarItem[];
};

export type BottomNavBarItem = {
  label: string;
  value: string;
  icon?: JSX.Element;
};
