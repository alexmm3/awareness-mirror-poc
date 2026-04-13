import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function SessionClose() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="font-mono font-medium text-[16px] text-am-text-primary italic text-center leading-relaxed">
          "You created space between activation and action."
        </p>
        <div className="font-mono text-[12px] text-am-teal mt-6">CLARITY THIS SESSION: Clearer</div>
        <div className="text-micro mt-2">March 16, 2026 — 14:32</div>
        <button onClick={() => navigate('/')} className="ghost-link mt-8" aria-label="Done">
          DONE
        </button>
      </div>
    </ScreenWrapper>
  );
}
