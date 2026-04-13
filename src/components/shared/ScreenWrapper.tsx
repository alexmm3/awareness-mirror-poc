import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScreenWrapperProps {
  children: ReactNode;
  showBack?: boolean;
  backPath?: string;
  padBottom?: boolean;
}

export default function ScreenWrapper({ children, showBack, backPath, padBottom = true }: ScreenWrapperProps) {
  const navigate = useNavigate();

  return (
    <div className="screen-enter min-h-screen bg-am-bg-primary max-w-[430px] mx-auto px-4" style={{ paddingBottom: padBottom ? '80px' : '24px' }}>
      {showBack && (
        <button
          onClick={() => backPath ? navigate(backPath) : navigate(-1)}
          className="ghost-link py-4 flex items-center gap-1"
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      {children}
    </div>
  );
}
