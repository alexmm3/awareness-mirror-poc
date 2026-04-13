import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext, MOCK_DATA } from '@/context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const cta = state.ctaState;

  const ctaConfigs = {
    1: { context: 'Outcome signal due — 2h remaining', label: 'COMPLETE OUTCOME SIGNAL →', className: 'btn-amber', path: '/outcome-signal' },
    2: { context: 'Reflection waiting since Tuesday', label: 'COMPLETE REFLECTION →', className: 'btn-purple', path: '/reflection-a' },
    3: { context: 'First pattern detected', label: 'FIRST PATTERN READY →', className: 'btn-gold', path: '/dashboard' },
    4: { context: 'Ready when you are', label: 'BEGIN SESSION →', className: 'btn-neutral', path: '/state-capture' },
  };

  const current = ctaConfigs[cta];

  return (
      <ScreenWrapper padBottom>
        <div className="pt-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-label">AWARENESS MIRROR</span>
            <button onClick={() => navigate('/profile')} className="ghost-link text-[11px]" aria-label="Settings">⚙</button>
          </div>

          {/* Dev toggle - Remove before production */}
          <div className="flex items-center gap-1 mt-1 justify-end">
            <span className="text-micro">CTA:</span>
            {([1, 2, 3, 4] as const).map((n) => (
              <button
                key={n}
                onClick={() => dispatch({ type: 'SET_CTA_STATE', payload: n })}
                className={`font-mono text-[11px] w-5 h-5 flex items-center justify-center rounded-sm ${
                  cta === n ? 'text-am-teal bg-am-bg-tertiary' : 'text-am-text-tertiary'
                }`}
                aria-label={`CTA state ${n}`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="divider mt-3" />

          {/* Last state */}
          <div className="py-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono font-medium text-[18px] text-am-text-primary">{MOCK_DATA.currentState}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`text-[8px] ${i <= MOCK_DATA.activationLevel ? 'text-am-text-primary' : 'text-am-text-tertiary'}`}>●</span>
                  ))}
                </div>
              </div>
              <span className="text-micro">{MOCK_DATA.lastSession}</span>
            </div>
          </div>

          <div className="divider" />

          {/* Metrics */}
          <div className="grid grid-cols-3 py-4 gap-2">
            <div>
              <div className="text-label text-[10px]">OBSERVER</div>
              <div className="font-mono font-medium text-[14px] text-am-teal mt-1">{MOCK_DATA.observerStrength}</div>
            </div>
            <div>
              <div className="text-label text-[10px]">CNR</div>
              <div className="font-mono font-medium text-[14px] text-am-teal mt-1">{MOCK_DATA.cnrTrend}</div>
            </div>
            <div>
              <div className="text-label text-[10px]">DCI</div>
              <div className="font-mono text-[13px] text-am-text-tertiary italic mt-1">{MOCK_DATA.dci}</div>
            </div>
          </div>

          <div className="divider" />

          {/* CTA */}
          <div className="py-6">
            <div className="text-[12px] text-am-text-secondary mb-3">{current.context}</div>
            <button
              onClick={() => navigate(current.path)}
              className={`btn-primary ${current.className}`}
              aria-label={current.label}
            >
              {current.label}
            </button>

            <div className="flex flex-col gap-2 mt-4">
              <button onClick={() => navigate('/high-pressure')} className="ghost-link text-left">→ High-pressure moment</button>
              <button onClick={() => navigate('/decision-capture')} className="ghost-link text-left">→ Log a decision</button>
            </div>
          </div>
        </div>
      </ScreenWrapper>
  );
}
