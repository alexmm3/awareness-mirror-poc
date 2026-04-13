import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'HOME', path: '/' },
  { label: 'HISTORY', path: '/history' },
  { label: 'DASHBOARD', path: '/dashboard' },
  { label: 'PROFILE', path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-am-border bg-am-bg-primary" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex max-w-[430px] mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              className={`flex-1 py-3 text-center font-mono text-[10px] tracking-[0.08em] uppercase transition-colors duration-150 border-t-2 ${
                isActive
                  ? 'text-am-text-primary border-am-teal'
                  : 'text-am-text-tertiary border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
