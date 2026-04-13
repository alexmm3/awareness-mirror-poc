import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/disclaimer" padBottom={false}>
      <div className="text-label mt-4">DATA & PRIVACY CONSENT</div>

      <div className="mt-6">
        <div className="text-label">YOUR RIGHTS</div>
        <div className="flex gap-2 mt-3">
          {['View', 'Export', 'Delete'].map((right) => (
            <div key={right} className="chip flex-1 justify-center cursor-default">{right}</div>
          ))}
        </div>
      </div>

      <div className="divider mt-6" />

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-small">Apple Health HRV</span>
            <p className="text-micro mt-1">Enables biometric grounding in a future update</p>
          </div>
          <div className="w-10 h-5 bg-am-bg-tertiary rounded-full flex items-center px-0.5">
            <div className="w-4 h-4 bg-am-text-tertiary rounded-full" />
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/auth')} className="btn-primary btn-teal mt-8 mb-8" aria-label="Continue">
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
