import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function ObserverStrength() {
  const navigate = useNavigate();
  const [stateB, setStateB] = useState(true); // Show state B (post session 5)

  return (
    <ScreenWrapper showBack backPath="/behaviour-surface" padBottom={false}>
      <div className="text-micro mt-4">3 / 4</div>
      <div className="divider mt-3" />

      <div className="mt-6">
        <div className="text-label">OBSERVER STRENGTH</div>

        {!stateB ? (
          <div className="mt-4">
            <p className="text-body text-am-text-secondary">4 more sessions to your first Observer Strength reading</p>
            <div className="mt-4 h-2 bg-am-bg-tertiary rounded-sm overflow-hidden">
              <div className="h-full bg-am-teal rounded-sm" style={{ width: '20%' }} />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="font-mono font-medium text-[16px] text-am-teal">↑ RISING</div>
            <p className="text-body text-am-text-secondary mt-2">Your self-perception accuracy has improved over the last 3 weeks.</p>
          </div>
        )}
      </div>

      {/* Toggle for demo */}
      <button onClick={() => setStateB(!stateB)} className="ghost-link mt-4 text-[11px]">
        Toggle state: {stateB ? 'B (post-5)' : 'A (pre-5)'}
      </button>

      <button onClick={() => navigate('/loop-progress')} className="btn-primary btn-teal mt-8 mb-8" aria-label="Continue">
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
