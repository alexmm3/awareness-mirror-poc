import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function LoopProgress() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/observer-strength" padBottom={false}>
      <div className="text-micro mt-4">4 / 4</div>
      <div className="divider mt-3" />

      <div className="mt-6">
        <div className="text-label">LOOP PROGRESS</div>
        <p className="text-body text-am-text-primary mt-3">3 of 5 steps to complete your first loop</p>
        <div className="flex gap-2 mt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? 'bg-am-teal' : 'bg-am-bg-tertiary'}`} />
          ))}
        </div>
        <p className="text-body text-am-text-secondary mt-4">2 decisions to your first pattern</p>
        <button onClick={() => navigate('/dashboard')} className="ghost-link mt-3 text-am-amber">
          Your first pattern is ready →
        </button>
      </div>

      <button onClick={() => navigate('/technique-selection')} className="btn-primary btn-teal mt-8 mb-8" aria-label="Continue">
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
