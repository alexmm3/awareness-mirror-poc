import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { STATE_TEMPLATES } from '@/lib/content-templates';

// Map detected state name to template ID
function stateNameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function BehaviourSurface() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const session = state.activeSession;
  const detectedState = session?.userCorrectedState || session?.classification?.detected_state || '';
  const templateId = stateNameToId(detectedState);
  const template = STATE_TEMPLATES.find(t => t.id === templateId);

  // Fallback if no template found
  const mechanism = template?.mechanism || 'Classification data unavailable.';
  const effect = template?.effect || '';
  const observerNote = template?.observer_note || '';

  return (
    <ScreenWrapper showBack backPath="/state-display" padBottom={false}>
      <div className="text-micro mt-4">2 / 4</div>
      <div className="text-label mt-3">WHAT YOUR SYSTEM IS DOING</div>
      <div className="divider mt-3" />

      {/* Mechanism */}
      <div className="mt-6">
        <div className="text-label">MECHANISM</div>
        <p className="text-body text-am-text-primary mt-2">{mechanism}</p>
      </div>

      <div className="divider mt-6" />

      {/* Effect */}
      <div className="mt-6">
        <div className="text-label">EFFECT ON DECISIONS</div>
        <p className="text-body text-am-text-primary mt-2">{effect}</p>
      </div>

      <div className="divider mt-6" />

      {/* Observer Note */}
      <div className="mt-6 p-4 -mx-4 rounded-lg" style={{ backgroundColor: 'hsl(var(--accent-teal) / 0.08)', border: '1px solid hsl(var(--accent-teal) / 0.18)' }}>
        <div className="text-label text-am-teal">OBSERVER NOTE</div>
        <p className="text-body text-am-text-primary mt-2 italic">{observerNote}</p>
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
