import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { getRecommendedTechnique, CognitiveStateId } from '@/lib/content-templates';

function stateNameToId(name: string): CognitiveStateId {
  return name.toLowerCase().replace(/\s+/g, '-') as CognitiveStateId;
}

const techniques = [
  {
    id: 'breathing-4-6',
    name: '4-6 BREATHING',
    subtitle: 'Inhale 4, exhale 6',
    desc: 'Primary deactivation',
  },
  {
    id: 'extended-exhale',
    name: 'EXTENDED EXHALE',
    subtitle: 'Inhale 4, exhale 8',
    desc: 'High anxiety',
  },
  {
    id: '90-second-pause',
    name: '90-SECOND PAUSE',
    desc: 'Observe without acting',
    extra: 'Emotions have a 90-second chemical lifespan — then they need a story to continue.',
  },
  {
    id: 'name-5-sensations',
    name: 'NAME 5 PHYSICAL SENSATIONS',
    desc: 'Somatic grounding',
    extra: 'Interrupts rumination',
  },
];

export default function TechniqueSelection() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const session = state.activeSession;
  const detectedState = session?.userCorrectedState || session?.classification?.detected_state || '';
  const recommendedId = getRecommendedTechnique(stateNameToId(detectedState));

  // Pre-select recommended technique
  const recommendedIndex = recommendedId
    ? techniques.findIndex(t => t.id === recommendedId)
    : null;
  const [selected, setSelected] = useState<number | null>(recommendedIndex);

  const handleContinue = () => {
    if (selected === null) return;
    const technique = techniques[selected];
    navigate(`/stabilisation?technique=${technique.id}`);
  };

  return (
    <ScreenWrapper showBack backPath="/loop-progress" padBottom={false}>
      <div className="text-label mt-4">STABILISATION</div>
      <p className="text-body text-am-text-secondary mt-2">Choose a technique matched to your state.</p>

      <div className="flex flex-col gap-3 mt-6 stagger-children">
        {techniques.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setSelected(i)}
            className={`card-surface p-4 text-left transition-all duration-150 ${
              selected === i ? 'border-am-border-active border-l-[3px] border-l-am-teal' : 'border-l-[3px] border-l-transparent'
            }`}
            aria-label={t.name}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-[14px] text-am-text-primary">{t.name}</span>
              {recommendedId === t.id && (
                <span className="text-[9px] font-mono text-am-teal bg-am-bg-tertiary px-1.5 py-0.5 rounded">RECOMMENDED</span>
              )}
            </div>
            {'subtitle' in t && t.subtitle && (
              <p className="text-small mt-1">{t.subtitle}</p>
            )}
            <p className="text-small mt-1 text-am-text-secondary">{t.desc}</p>
            {'extra' in t && t.extra && (
              <p className="text-micro mt-2">{t.extra}</p>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 mb-8">
        <button onClick={() => navigate('/recheck')} className="btn-primary btn-ghost btn-40" aria-label="Skip">
          SKIP →
        </button>
        <button
          onClick={handleContinue}
          disabled={selected === null}
          className={`btn-primary btn-teal btn-40 ${selected === null ? 'opacity-40 pointer-events-none' : ''}`}
          aria-label="Continue"
        >
          CONTINUE →
        </button>
      </div>
    </ScreenWrapper>
  );
}
