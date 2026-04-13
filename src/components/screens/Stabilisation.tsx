import { useNavigate, useSearchParams } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

const techniqueData: Record<string, { name: string; description: string; time: string }> = {
  'breathing-4-6': {
    name: '4-6 BREATHING',
    description: 'Inhale through your nose for 4 seconds. Exhale through your mouth for 6 seconds. Repeat until the activation begins to shift.',
    time: '2 MINUTES',
  },
  'extended-exhale': {
    name: 'EXTENDED EXHALE',
    description: 'Inhale through your nose for 4 seconds. Exhale slowly through your mouth for 8 seconds. The extended exhale activates the parasympathetic nervous system.',
    time: '2 MINUTES',
  },
  '90-second-pause': {
    name: '90-SECOND PAUSE',
    description: 'Observe the activation without acting on it. Emotions have a 90-second chemical lifespan — then they need a story to continue.',
    time: '90 SECONDS',
  },
  'name-5-sensations': {
    name: 'NAME 5 PHYSICAL SENSATIONS',
    description: 'Notice and silently name 5 physical sensations in your body right now. This interrupts rumination by redirecting attention to somatic experience.',
    time: '1 MINUTE',
  },
};

const defaultTechnique = techniqueData['90-second-pause'];

export default function Stabilisation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const techniqueId = searchParams.get('technique');
  const technique = (techniqueId && techniqueData[techniqueId]) || defaultTechnique;

  return (
    <ScreenWrapper showBack backPath="/technique-selection" padBottom={false}>
      <div className="text-label mt-4">STABILISATION</div>
      <p className="text-body text-am-text-secondary mt-2">Based on your current state, we recommend:</p>

      <div className="card-surface p-4 mt-6">
        <div className="font-mono font-medium text-[14px] text-am-text-primary">{technique.name}</div>
        <p className="text-body text-am-text-secondary mt-2">
          {technique.description}
        </p>
        <div className="text-micro mt-3">{technique.time}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 mb-8">
        <button onClick={() => navigate('/recheck')} className="btn-primary btn-ghost btn-40" aria-label="Skip">
          SKIP →
        </button>
        <button onClick={() => navigate(`/micro-action?technique=${techniqueId || '90-second-pause'}`)} className="btn-primary btn-teal btn-40" aria-label="Do this">
          DO THIS →
        </button>
      </div>
    </ScreenWrapper>
  );
}
