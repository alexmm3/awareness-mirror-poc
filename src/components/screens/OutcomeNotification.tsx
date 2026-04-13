import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

/**
 * Notification-style Outcome Signal UI.
 * Preserved as a best-practice notification example (external push notification trigger).
 * Not the main in-app data entry screen — see OutcomeSignal for that.
 */
export default function OutcomeNotification() {
  const navigate = useNavigate();

  const handleOutcome = () => {
    navigate('/outcome-confirmation');
  };

  return (
    <ScreenWrapper padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Mock lock screen notification */}
        <div className="w-full max-w-[360px]">
          <div className="text-center text-am-text-tertiary text-[13px] font-mono mb-8">9:41</div>
          
          <div className="card-surface p-4 rounded-lg">
            <div className="font-mono text-[11px] text-am-text-tertiary uppercase tracking-wider">AWARENESS MIRROR</div>
            <div className="font-sans font-medium text-[14px] text-am-text-primary mt-1">
              "Whether to hire Marcus at $180k..."
            </div>
            <div className="text-body text-am-text-secondary mt-1">How did this decision go?</div>
            
            <div className="flex gap-2 mt-4">
              {['Better than expected', 'About as expected', 'Harder than expected'].map((label) => (
                <button
                  key={label}
                  onClick={handleOutcome}
                  className="chip flex-1 text-center justify-center text-[10px]"
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-micro text-center mt-4">Tap to respond without opening the app</div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
