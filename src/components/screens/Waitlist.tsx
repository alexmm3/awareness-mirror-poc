import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function Waitlist() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[90vh]">
        <h1 className="font-mono-display text-[28px] text-am-text-primary tracking-[-0.02em]">AWARENESS MIRROR</h1>
        <p className="text-body text-am-text-secondary mt-2">Decision Intelligence for founders.</p>

        {/* Blurred dashboard preview */}
        <div className="w-full mt-8 relative">
          <div className="card-surface p-6 filter blur-[8px] opacity-60">
            <div className="text-label">INTELLIGENCE CONSOLE</div>
            <div className="font-mono text-[18px] text-am-text-primary mt-4">ANXIOUS VIGILANCE</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="h-8 bg-am-bg-tertiary rounded" />
              <div className="h-8 bg-am-bg-tertiary rounded" />
              <div className="h-8 bg-am-bg-tertiary rounded" />
            </div>
            <div className="h-12 bg-am-bg-tertiary rounded mt-4" />
          </div>
          <div className="absolute inset-0 bg-am-bg-primary/40" />
        </div>

        <button
          onClick={() => {}}
          className="btn-primary btn-amber mt-8 max-w-[280px]"
          aria-label="Request access"
        >
          REQUEST ACCESS →
        </button>

        <button onClick={() => navigate('/onboarding')} className="ghost-link mt-4">
          Have access? Sign in →
        </button>
      </div>
    </ScreenWrapper>
  );
}
