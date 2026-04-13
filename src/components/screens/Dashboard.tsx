import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

import { MOCK_DATA } from '@/context/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'30d' | 'all'>('30d');
  const [mounted, setMounted] = useState(false);
  const maxCount = Math.max(...MOCK_DATA.stateFrequency.map(s => s.count));

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // SVG sparkline
  const cnrPoints = MOCK_DATA.cnrData;
  const minY = Math.min(...cnrPoints);
  const maxY = Math.max(...cnrPoints);
  const rangeY = maxY - minY || 1;
  const svgW = 280;
  const svgH = 40;
  const polyline = cnrPoints.map((v, i) => {
    const x = (i / (cnrPoints.length - 1)) * svgW;
    const y = svgH - ((v - minY) / rangeY) * (svgH - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
      <ScreenWrapper padBottom>
        <div className="text-label mt-4">INTELLIGENCE DASHBOARD</div>

        {/* Period toggle */}
        <div className="flex gap-1 mt-3">
          {[{ key: '30d' as const, label: '30 DAYS' }, { key: 'all' as const, label: 'ALL TIME' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`font-mono text-[11px] tracking-[0.06em] uppercase px-3 py-1 rounded-sm transition-colors ${
                period === key ? 'text-am-text-primary bg-am-bg-tertiary' : 'text-am-text-tertiary'
              }`}
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="divider mt-4" />

        {/* State Frequency */}
        <div className="mt-6">
          <div className="text-label">STATE FREQUENCY</div>
          <div className="space-y-2 mt-3">
            {MOCK_DATA.stateFrequency.map((s, i) => (
              <div key={s.state} className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-am-text-secondary w-[140px] truncate">{s.state}</span>
                <div className="flex-1 h-3 bg-am-bg-tertiary rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{
                      width: mounted ? `${(s.count / maxCount) * 100}%` : '0%',
                      backgroundColor: `hsl(${s.color})`,
                      opacity: 0.6,
                      transitionDuration: '500ms',
                      transitionDelay: `${i * 80}ms`,
                      transitionTimingFunction: 'ease-out',
                    }}
                  />
                </div>
                <span className="font-mono text-[12px] text-am-text-secondary w-4 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider mt-6" />

        {/* CNR Trend */}
        <div className="mt-6">
          <div className="text-label">COGNITIVE NOISE REDUCTION</div>
          <svg width={svgW} height={svgH} className="mt-3" aria-label="CNR trend sparkline">
            <polyline
              points={polyline}
              fill="none"
              stroke="hsl(160, 68%, 51%)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <div className="font-mono font-medium text-[12px] text-am-teal mt-1">IMPROVING</div>
        </div>

        <div className="divider mt-6" />

        {/* Observer Strength */}
        <div className="mt-6">
          <div className="text-label">OBSERVER STRENGTH</div>
          <div className="font-mono font-medium text-[16px] text-am-teal mt-2">↑ RISING</div>
          <svg width={svgW} height={svgH} className="mt-2" aria-label="Observer strength trend">
            <polyline
              points={polyline}
              fill="none"
              stroke="hsl(160, 68%, 51%)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="divider mt-6" />

        {/* Pattern Preview */}
        <div className="mt-6 mb-8">
          <div className="font-mono font-medium text-[10px] tracking-[0.08em] uppercase text-am-purple">PATTERN DETECTED</div>
          <div
            className="mt-3 p-4 rounded"
            style={{ backgroundColor: 'hsl(270, 25%, 9%)', border: '1px solid hsl(258, 38%, 38%)' }}
          >
            <div className="font-mono text-[9px] tracking-[0.08em] uppercase" style={{ color: 'hsl(258, 28%, 50%)' }}>
              EARLY SIGNAL — NOT YET CONFIRMED
            </div>
            <p className="font-mono text-[15px] text-am-text-primary italic mt-2">
              {MOCK_DATA.detectedPattern}
            </p>
            <div className="text-micro mt-2">Based on {MOCK_DATA.patternDecisions} decisions</div>
            <button
              onClick={() => navigate('/reflection-b')}
              className="ghost-link mt-3 !text-am-purple text-[13px]"
              aria-label="Explore in reflection"
            >
              Explore in reflection →
            </button>
          </div>
        </div>
      </ScreenWrapper>
  );
}
