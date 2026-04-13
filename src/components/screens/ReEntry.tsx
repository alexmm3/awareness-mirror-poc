import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function ReEntry() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex flex-col justify-center min-h-[70vh]">
        <h1 className="font-mono-display text-[28px] text-am-text-primary">Welcome back.</h1>
        <p className="text-body text-am-text-secondary mt-2">Your data is here.</p>

        <div className="mt-8">
          <div className="text-micro">LAST STATE</div>
          <div className="font-mono text-[14px] text-am-text-primary mt-1">ANXIOUS VIGILANCE</div>
          <div className="text-micro mt-3">CNR TREND</div>
          <div className="font-mono text-[14px] text-am-teal mt-1">IMPROVING</div>
        </div>

        <button onClick={() => navigate('/state-capture')} className="btn-primary btn-teal mt-8" aria-label="Begin a session">
          BEGIN A SESSION →
        </button>
      </div>
    </ScreenWrapper>
  );
}
