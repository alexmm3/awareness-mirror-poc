import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { MOCK_DATA } from '@/context/AppContext';

export default function OutcomeSignal() {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate('/outcome-confirmation');
  };

  const options = [
    'Better than expected',
    'About as expected',
    'Harder than expected',
  ];

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="pt-8">
        <div className="font-mono text-[11px] text-am-text-tertiary uppercase tracking-wider mb-2">
          OUTCOME SIGNAL
        </div>
        <h1 className="font-mono-display text-[22px] text-am-text-primary leading-tight">
          How did this decision go?
        </h1>

        {/* Decision context */}
        <div className="card-surface p-4 rounded-lg mt-6">
          <div className="font-mono text-[10px] text-am-text-tertiary uppercase tracking-wider mb-2">
            DECISION
          </div>
          <div className="font-sans text-[14px] text-am-text-primary leading-relaxed">
            "{MOCK_DATA.lastDecision}"
          </div>
          <div className="font-mono text-[10px] text-am-text-tertiary uppercase tracking-wider mt-3">
            STATE AT TIME OF DECISION
          </div>
          <div className="font-mono text-[13px] text-am-amber mt-1">
            {MOCK_DATA.currentState}
          </div>
        </div>

        {/* Response options */}
        <div className="mt-8 space-y-3">
          {options.map((label) => (
            <button
              key={label}
              onClick={handleSelect}
              className="card-surface w-full p-4 rounded-lg text-left font-sans text-[14px] text-am-text-primary hover:border-am-border-active transition-colors"
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
}
