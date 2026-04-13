import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function ClassificationLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/state-display', { replace: true }), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ScreenWrapper padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="font-mono font-medium text-[12px] tracking-[0.08em] uppercase text-am-text-secondary loading-dots">
          READING YOUR SYSTEM
        </div>
      </div>
    </ScreenWrapper>
  );
}
