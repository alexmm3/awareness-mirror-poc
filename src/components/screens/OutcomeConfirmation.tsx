import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function OutcomeConfirmation() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="font-mono-display text-[22px] text-am-text-primary">Response recorded.</h2>
        <div className="font-mono font-medium text-[14px] text-am-amber mt-4">HARDER THAN EXPECTED</div>
        <p className="text-small mt-3">A reflection will arrive in 1 hour.</p>
        <button onClick={() => navigate('/')} className="btn-primary btn-neutral mt-8 w-48" aria-label="Done">
          DONE →
        </button>
      </div>
    </ScreenWrapper>
  );
}
