import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { MOCK_DATA } from '@/context/AppContext';

const DECISION_TYPES = ['People', 'Money', 'Strategy', 'Operations'];

export default function DecisionCapture() {
  const navigate = useNavigate();
  const [decision, setDecision] = useState('');
  const [outcome, setOutcome] = useState('');
  const [type, setType] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const decisionWords = decision.trim() ? decision.trim().split(/\s+/).length : 0;
  const outcomeWords = outcome.trim() ? outcome.trim().split(/\s+/).length : 0;
  const canSubmit = decisionWords >= 5 && outcomeWords >= 5 && type !== '';

  const handleSubmit = () => {
    setConfirmed(true);
    setTimeout(() => navigate('/technique-selection'), 1500);
  };

  if (confirmed) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-mono font-medium text-[14px] text-am-teal">Decision logged. Continuing session.</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      {/* State context */}
      <div className="border-l-2 border-am-amber pl-3 py-2 mt-2">
        <div className="text-micro">CURRENT STATE</div>
        <div className="font-mono font-medium text-[14px] text-am-text-primary">{MOCK_DATA.currentState}</div>
      </div>

      <div className="divider mt-4" />

      <div className="text-label mt-4">DECISION CAPTURE</div>

      {/* Field A */}
      <div className="mt-4">
        <div className="text-label">DESCRIBE THE DECISION</div>
        <textarea
          className="textarea-am mt-2"
          style={{ minHeight: 80 }}
          placeholder="Describe the decision in one sentence."
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          aria-label="Decision description"
        />
        <div className="text-micro text-right mt-1">{decisionWords} / 100</div>
      </div>

      {/* Field B */}
      <div className="mt-4">
        <div className="text-label">WHAT DOES A GOOD OUTCOME LOOK LIKE?</div>
        <textarea
          className="textarea-am mt-2"
          style={{ minHeight: 80 }}
          placeholder="What does success look like in 6 months?"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          aria-label="Good outcome description"
        />
        <div className="text-micro text-right mt-1">{outcomeWords} / 100</div>
      </div>

      {/* Decision type */}
      <div className="mt-4">
        <div className="text-label">DECISION TYPE</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {DECISION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`chip ${type === t ? 'chip-selected !text-am-teal !border-am-border-active' : ''}`}
              aria-label={`Decision type: ${t}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-am-text-tertiary italic mt-6">
        We'll follow up in 48 hours. — Outcome Signal scheduled automatically.
      </p>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="btn-primary btn-teal mt-6"
        aria-label="Log this decision"
      >
        LOG THIS DECISION →
      </button>

      <button onClick={() => navigate('/technique-selection')} className="ghost-link block mx-auto mt-3 mb-8">
        Skip →
      </button>
    </ScreenWrapper>
  );
}
