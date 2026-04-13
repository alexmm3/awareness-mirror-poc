import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

// --- Technique definitions ---

interface TechniqueConfig {
  name: string;
  steps: string[];
  type: 'breathing-4-6' | 'breathing-4-8' | 'pause' | 'sensations';
  inhale?: number;
  exhale?: number;
}

const techniqueConfigs: Record<string, TechniqueConfig> = {
  'breathing-4-6': {
    name: '4-6 BREATHING',
    type: 'breathing-4-6',
    inhale: 4,
    exhale: 6,
    steps: [
      'Find a comfortable position. Close your eyes if it helps.',
      'Inhale slowly through your nose for 4 seconds.',
      'Exhale slowly through your mouth for 6 seconds.',
      'Repeat for 2 minutes.',
      'Notice your system beginning to downregulate.',
    ],
  },
  'extended-exhale': {
    name: 'EXTENDED EXHALE',
    type: 'breathing-4-8',
    inhale: 4,
    exhale: 8,
    steps: [
      'Sit upright. Relax your shoulders.',
      'Inhale slowly through your nose for 4 seconds.',
      'Exhale very slowly through your mouth for 8 seconds.',
      'The extended exhale activates the parasympathetic nervous system.',
      'Repeat for 2 minutes or until the activation shifts.',
    ],
  },
  '90-second-pause': {
    name: '90-SECOND PAUSE',
    type: 'pause',
    steps: [
      'Stop what you are doing.',
      'Do not act on any thought that arises.',
      'Notice the activation in your body — where it lives, how it moves.',
      'Observe without interpretation for 90 seconds.',
      'The activation will shift on its own.',
    ],
  },
  'name-5-sensations': {
    name: 'NAME 5 PHYSICAL SENSATIONS',
    type: 'sensations',
    steps: [
      'Pause and direct attention to your body.',
      'Name the first physical sensation you notice. Say it silently.',
      'Move to a different part of your body. Name the next sensation.',
      'Continue until you have named 5 distinct physical sensations.',
      'Notice how your attention has shifted from thought to body.',
    ],
  },
};

const defaultConfig = techniqueConfigs['90-second-pause'];

export default function MicroAction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const techniqueId = searchParams.get('technique');
  const technique = (techniqueId && techniqueConfigs[techniqueId]) || defaultConfig;

  const isBreathing = technique.type === 'breathing-4-6' || technique.type === 'breathing-4-8';
  const inhale = technique.inhale || 4;
  const exhale = technique.exhale || 6;
  const totalCycle = inhale + exhale;

  // 90-second pause timer
  const [secondsLeft, setSecondsLeft] = useState(90);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (technique.type !== 'pause') return;
    setSecondsLeft(90);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [technique.type]);

  return (
    <ScreenWrapper showBack backPath={`/stabilisation?technique=${techniqueId || '90-second-pause'}`} padBottom={false}>
      <div className="flex items-center justify-between mt-4">
        <div className="text-label">{technique.name}</div>
      </div>

      {/* Breathing animation (4-6 and 4-8) */}
      {isBreathing && (
        <div className="relative mt-8 mb-4" style={{ height: '180px' }}>
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="rounded-full"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'hsl(var(--accent-teal))',
                opacity: 0.08,
                animation: `breatheAnim ${totalCycle}s ease-in-out infinite`,
              }}
            />
          </div>
        </div>
      )}

      {/* Pause: timer in preserved space */}
      {technique.type === 'pause' && (
        <div className="flex justify-center items-center mt-6 mb-2" style={{ height: '48px' }}>
          <span
            className="font-mono text-am-text-tertiary"
            style={{ fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}
          >
            {secondsLeft}s
          </span>
        </div>
      )}

      {/* Sensations: empty space preserved (circles removed) */}
      {technique.type === 'sensations' && (
        <div className="flex justify-center gap-2 mt-6 mb-2" style={{ height: '10px' }} />
      )}

      {/* Steps - all visible immediately, static */}
      <div className="mt-6 space-y-4">
        {technique.steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="font-mono text-[14px] text-am-text-tertiary">{i + 1}.</span>
            <p className="text-body text-am-text-primary">{step}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/recheck')} className="btn-primary btn-teal mt-8 mb-8" aria-label="Done">
        DONE →
      </button>

      <style>{`
        @keyframes breatheAnim {
          0%, 100% { transform: scale(1); opacity: 0.06; }
          ${(inhale / totalCycle * 100).toFixed(1)}% { transform: scale(1.5); opacity: 0.12; }
        }
      `}</style>
    </ScreenWrapper>
  );
}
