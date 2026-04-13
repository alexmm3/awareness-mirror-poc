import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { MOCK_DATA } from '@/context/AppContext';

export default function BehaviourSurface() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/state-display" padBottom={false}>
      <div className="text-micro mt-4">2 / 4</div>
      <div className="text-label mt-3">WHAT YOUR SYSTEM IS DOING</div>
      <div className="divider mt-3" />

      {/* Mechanism */}
      <div className="mt-6">
        <div className="text-label">MECHANISM</div>
        <p className="text-body text-am-text-primary mt-2">{MOCK_DATA.mechanism}</p>
      </div>

      <div className="divider mt-6" />

      {/* Effect */}
      <div className="mt-6">
        <div className="text-label">EFFECT ON DECISIONS</div>
        <p className="text-body text-am-text-primary mt-2">{MOCK_DATA.effect}</p>
      </div>

      <div className="divider mt-6" />

      {/* Observer Note */}
      <div className="mt-6 p-4 -mx-4 rounded-lg" style={{ backgroundColor: 'hsl(var(--accent-teal) / 0.08)', border: '1px solid hsl(var(--accent-teal) / 0.18)' }}>
        <div className="text-label text-am-teal">OBSERVER NOTE</div>
        <p className="text-body text-am-text-primary mt-2 italic">{MOCK_DATA.observerNote}</p>
      </div>

      <div className="mt-8 flex items-center gap-2 text-am-text-tertiary text-[13px]">
        <span>🔖</span>
        <span>save insight</span>
      </div>

      <button
        onClick={() => navigate('/observer-strength')}
        className="btn-primary btn-teal mt-6 mb-8"
        aria-label="Continue"
      >
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
