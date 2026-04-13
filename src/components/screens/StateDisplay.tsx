import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { MOCK_DATA } from '@/context/AppContext';

export default function StateDisplay() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="text-micro mt-4">1 / 4</div>
      <div className="divider mt-3" />

      <div className="mt-6">
        <div className="text-label">YOUR SYSTEM IS IN</div>
        <h1 className="font-mono-display text-[32px] text-am-text-primary mt-3 leading-none tracking-[-0.02em]">
          {MOCK_DATA.currentState}
        </h1>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-micro">ACTIVATION</span>
          <span className="flex gap-[3px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={`text-[8px] ${i <= MOCK_DATA.activationLevel ? 'text-am-text-primary' : 'text-am-text-tertiary'}`}>●</span>
            ))}
          </span>
          <span className="text-micro">{MOCK_DATA.activationLevel} of 5</span>
        </div>
      </div>

      {/* Recognition sentence */}
      <div className="mt-8 border-l-2 border-am-amber bg-am-bg-secondary p-4 rounded-r">
        <p className="text-body italic text-am-text-primary">
          "{MOCK_DATA.recognition}"
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button onClick={() => navigate('/second-rank')} className="ghost-link">
          Not quite right?
        </button>
      </div>

      <button
        onClick={() => navigate('/behaviour-surface')}
        className="btn-primary btn-teal mt-6 mb-8"
        aria-label="Continue"
      >
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
