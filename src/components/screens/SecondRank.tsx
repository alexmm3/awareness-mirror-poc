import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

const alternatives = [
  { name: 'ANXIOUS VIGILANCE', desc: 'Threat-detection dominant, compressed time horizons.', current: true },
  { name: 'FOCUSED TENSION', desc: 'High engagement with narrowed attention. Productive but brittle.' },
  { name: 'COGNITIVE DEPLETION', desc: 'Reduced executive function. Decision quality compromised by fatigue.' },
];

export default function SecondRank() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  return (
    <ScreenWrapper showBack backPath="/state-display" padBottom={false}>
      <h2 className="font-sans font-medium text-[16px] text-am-text-primary mt-4">
        You know your system best — which of these fits?
      </h2>

      <div className="flex flex-col gap-3 mt-6">
        {alternatives.map((alt, i) => (
          <button
            key={alt.name}
            onClick={() => setSelected(i)}
            className={`card-surface p-3 text-left transition-all duration-150 ${
              selected === i ? 'border-am-border-active border-l-2 border-l-am-teal' : ''
            }`}
            aria-label={alt.name}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-[15px] text-am-text-primary">{alt.name}</span>
              {alt.current && <span className="text-micro">current</span>}
            </div>
            <p className="text-small mt-1">{alt.desc}</p>
          </button>
        ))}
      </div>

      <button onClick={() => navigate('/behaviour-surface')} className="btn-primary btn-teal mt-8 mb-8" aria-label="Confirm selection">
        CONFIRM SELECTION →
      </button>

      <button onClick={() => navigate('/state-display')} className="ghost-link block mx-auto mb-8">
        ← return to original
      </button>
    </ScreenWrapper>
  );
}
