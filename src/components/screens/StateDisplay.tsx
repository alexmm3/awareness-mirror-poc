import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';

export default function StateDisplay() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const classification = state.activeSession?.classification;

  // Redirect if no active session
  if (!classification) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-body text-am-text-secondary">No active session.</div>
          <button onClick={() => navigate('/')} className="ghost-link mt-4">Return home</button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="text-micro mt-4">1 / 4</div>
      <div className="divider mt-3" />

      <div className="mt-6">
        <div className="text-label">YOUR SYSTEM IS IN</div>
        <h1 className="font-mono-display text-[32px] text-am-text-primary mt-3 leading-none tracking-[-0.02em]">
          {classification.detected_state}
        </h1>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-micro">ACTIVATION</span>
          <span className="flex gap-[3px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={`text-[8px] ${i <= classification.activation_level ? 'text-am-text-primary' : 'text-am-text-tertiary'}`}>●</span>
            ))}
          </span>
          <span className="text-micro">{classification.activation_level} of 5</span>
        </div>
      </div>

      {/* Recognition sentence */}
      <div className="mt-8 border-l-2 border-am-amber bg-am-bg-secondary p-4 rounded-r">
        <p className="text-body italic text-am-text-primary">
          "{classification.recognition_sentence}"
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
