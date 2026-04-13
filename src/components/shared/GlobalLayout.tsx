import { useLocation } from 'react-router-dom';
import BottomNav from '@/components/shared/BottomNav';

const HIDE_BOTTOM_NAV = ['/outcome-notification'];

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const showNav = !HIDE_BOTTOM_NAV.includes(location.pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
}
