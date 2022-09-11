import { SyntheticEvent } from 'react';
import { NavigationTab } from '../../mediaApp/types';

export type BottomNavigationProps<T> = {
  handleChange: (event: SyntheticEvent, newTab: NavigationTab) => void;
  currentTab: T;
  bottomNavBarItems: BottomNavBarItem<T>[];
};

export type BottomNavBarItem<T> = {
  label: string;
  value: T;
  icon?: JSX.Element;
};
