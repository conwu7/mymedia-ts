import { BottomNavigationProps } from './types';
import style from './style.module.scss';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';

export function BottomNavTabs<TabTypes>({
  handleChange,
  currentTab,
  bottomNavBarItems,
}: BottomNavigationProps<TabTypes>): JSX.Element {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
      id="bottomNavContainer"
      className={`bottomNavContainer raiseOnFullscreen`}
    >
      <Box className={style.bottomNavContainer}>
        <BottomNavigation showLabels value={currentTab} onChange={handleChange}>
          {bottomNavBarItems.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={item.label}
              value={item.value}
              icon={item.icon}
              className={currentTab === item.value ? style.selected : ''}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Paper>
  );
}
