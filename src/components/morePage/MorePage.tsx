import Button from '@mui/material/Button';
import { logout } from '../../services/api';
import style from './style.module.scss';

export default function MorePage({ hidden }: { hidden: boolean }): JSX.Element {
  const handleLogout = async () => {
    if (!window.confirm('Are you sure?')) return;
    const { status } = await logout();
    if (status === 200) return window.location.reload();
    alert('There was issue with that request');
  };

  return (
    <div className={`${style.morePage} ${hidden ? style.hidden : ''}`}>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
