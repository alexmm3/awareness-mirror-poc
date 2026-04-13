import { useLocation } from 'react-router-dom';
import BottomNav from '@/components/shared/BottomNav';
import { useAuth } from '@/context/AuthContext';

// Screens where bottom nav is hidden (session flow + auth/onboarding)
const HIDE_BOTTOM_NAV = [
  '/outcome-notification',
  '/waitlist', '/auth', '/onboarding', '/disclaimer', '/privacy',
  '/state-capture', '/classification-loading', '/state-display',
  '/second-rank', '/behaviour-surface', '/observer-strength', '/loop-progress',
  '/decision-capture', '/technique-selection', '/stabilisation', '/micro-action',
  '/recheck', '/session-close', '/high-pressure',
  '/outcome-signal', '/outcome-confirmation',
  '/reflection-a', '/reflection-b',
  '/re-entry',
];

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, profile } = useAuth();

  const showNav = user
    && profile?.onboarding_complete
    && !HIDE_BOTTOM_NAV.includes(location.pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
}
