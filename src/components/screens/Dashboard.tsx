import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface StateFreq {
  state: string;
  count: number;
}

interface PatternItem {
  id: string;
  text: string;
  decisions: number;
  confidence: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [period, setPeriod] = useState<'30d' | 'all'>('30d');
  const [stateFrequency, setStateFrequency] = useState<StateFreq[]>([]);
  const [cnrData, setCnrData] = useState<number[]>([]);
  const [observerTrend, setObserverTrend] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user, period]);

  const loadDashboard = async () => {
    if (!user) return;

    const since = period === '30d'
      ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      : '1970-01-01T00:00:00Z';

    const [sessionsRes, metricsRes, patternsRes] = await Promise.all([
      supabase.from('sessions')
        .select('detected_state, user_corrected_state, recheck_clarity')
        .eq('user_id', user.id)
        .gte('created_at', since)
        .order('created_at', { ascending: true }),
      supabase.from('user_metrics').select('*').eq('user_id', user.id).single(),
      supabase.from('patterns')
        .select('id, pattern_text, pattern_confidence, supporting_session_ids, viewed')
        .eq('user_id', user.id)
        .order('detected_at', { ascending: false }),
    ]);

    const sessions = sessionsRes.data || [];
    // Count only classified sessions toward the threshold
    const classifiedSessions = sessions.filter(s => s.detected_state || s.user_corrected_state);
    setTotalSessions(classifiedSessions.length);

    // State frequency
    const freqMap: Record<string, number> = {};
    sessions.forEach(s => {
      const state = s.user_corrected_state || s.detected_state;
      if (state) freqMap[state] = (freqMap[state] || 0) + 1;
    });
    const freqArr = Object.entries(freqMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);
    setStateFrequency(freqArr);

    // CNR sparkline
    const cnr = sessions
      .filter(s => s.recheck_clarity)
      .map(s => s.recheck_clarity === 'clearer' ? 1 : s.recheck_clarity === 'cloudier' ? -1 : 0);
    setCnrData(cnr);

    // Metrics
    const metrics = metricsRes.data;
    setObserverTrend(metrics?.observer_strength_trend || null);

    // Patterns: sort by strongest first (supporting sessions count DESC),
    // then by recency. Mark all unviewed patterns as viewed so the Home
    // CTA stops surfacing them after the user has seen them here.
    const rawPatterns = patternsRes.data || [];
    const sortedPatterns: PatternItem[] = [...rawPatterns]
      .sort((a, b) => {
        const aCount = a.supporting_session_ids?.length || 0;
        const bCount = b.supporting_session_ids?.length || 0;
        return bCount - aCount;
      })
      .map((p) => ({
        id: p.id,
        text: p.pattern_text,
        decisions: p.supporting_session_ids?.length || 0,
        confidence: p.pattern_confidence,
      }));
    setPatterns(sortedPatterns);

    const unviewedIds = rawPatterns.filter((p) => !p.viewed).map((p) => p.id);
    if (unviewedIds.length > 0) {
      // Fire-and-forget: marking viewed doesn't block the dashboard render.
      supabase.from('patterns').update({ viewed: true }).in('id', unviewedIds).then(() => {});
    }

    setLoading(false);
  };

  // SVG sparkline
  const maxCount = Math.max(...stateFrequency.map(s => s.count), 1);
  const svgW = 280;
  const svgH = 40;
  const polyline = cnrData.length > 1 ? (() => {
    const minY = Math.min(...cnrData);
    const maxY = Math.max(...cnrData);
    const rangeY = maxY - minY || 1;
    return cnrData.map((v, i) => {
      const x = (i / (cnrData.length - 1)) * svgW;
      const y = svgH - ((v - minY) / rangeY) * (svgH - 4) - 2;
      return `${x},${y}`;
    }).join(' ');
  })() : '';

  // State colors (simplified)
  const stateColors: Record<string, string> = {
    'ANXIOUS VIGILANCE': 'hsl(0, 85%, 60%)',
    'Anxious Vigilance': 'hsl(0, 85%, 60%)',
    'FOCUSED TENSION': 'hsl(35, 90%, 55%)',
    'Focused Tension': 'hsl(35, 90%, 55%)',
    'CALM READINESS': 'hsl(160, 70%, 50%)',
    'Calm Readiness': 'hsl(160, 70%, 50%)',
    'COGNITIVE DEPLETION': 'hsl(220, 50%, 55%)',
    'Cognitive Depletion': 'hsl(220, 50%, 55%)',
    'FLAT DISCONNECTION': 'hsl(240, 20%, 60%)',
    'Flat Disconnection': 'hsl(240, 20%, 60%)',
    'REACTIVE ACTIVATION': 'hsl(340, 85%, 55%)',
    'Reactive Activation': 'hsl(340, 85%, 55%)',
  };

  if (loading) {
    return (
      <ScreenWrapper padBottom>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="font-mono text-[12px] text-am-text-secondary loading-dots">Loading</div>
        </div>
      </ScreenWrapper>
    );
  }

  // Insufficient data state
  if (totalSessions < 5) {
    return (
      <ScreenWrapper padBottom>
        <div className="text-label mt-4">INTELLIGENCE DASHBOARD</div>
        <div className="divider mt-4" />
        <div className="mt-8 text-center">
          <p className="text-body text-am-text-secondary">
            Collecting data. {5 - totalSessions} more session{5 - totalSessions !== 1 ? 's' : ''} to your first insights.
          </p>
          <div className="mt-4 h-2 bg-am-bg-tertiary rounded-sm overflow-hidden max-w-[200px] mx-auto">
            <div className="h-full bg-am-teal rounded-sm transition-all" style={{ width: `${(totalSessions / 5) * 100}%` }} />
          </div>
        </div>
      </ScreenWrapper>
    );
  }

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
          {stateFrequency.map((s, i) => (
            <div key={s.state} className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-am-text-secondary w-[140px] truncate">{s.state}</span>
              <div className="flex-1 h-3 bg-am-bg-tertiary rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: mounted ? `${(s.count / maxCount) * 100}%` : '0%',
                    backgroundColor: stateColors[s.state] || 'hsl(160, 68%, 51%)',
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
        {cnrData.length > 1 ? (
          <>
            <svg width={svgW} height={svgH} className="mt-3" aria-label="CNR trend sparkline">
              <polyline
                points={polyline}
                fill="none"
                stroke="hsl(160, 68%, 51%)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <div className="font-mono font-medium text-[12px] text-am-teal mt-1">
              {cnrData.length >= 3 && cnrData.slice(-3).reduce((a, b) => a + b, 0) > 0 ? 'IMPROVING' :
               cnrData.slice(-3).reduce((a, b) => a + b, 0) < 0 ? 'DECLINING' : 'STABLE'}
            </div>
          </>
        ) : (
          <p className="text-body text-am-text-secondary mt-2 italic">Not enough data yet.</p>
        )}
      </div>

      <div className="divider mt-6" />

      {/* Observer Strength */}
      <div className="mt-6">
        <div className="text-label">OBSERVER STRENGTH</div>
        <div className="font-mono font-medium text-[16px] text-am-teal mt-2">
          {observerTrend === 'rising' ? '↑ RISING' : observerTrend === 'declining' ? '↓ DECLINING' : '→ STABLE'}
        </div>
      </div>

      <div className="divider mt-6" />

      {/* Patterns */}
      {patterns.length > 0 && (
        <div className="mt-6 mb-8">
          <div className="font-mono font-medium text-[10px] tracking-[0.08em] uppercase text-am-purple">
            {patterns.length === 1 ? 'PATTERN DETECTED' : `${patterns.length} PATTERNS DETECTED`}
          </div>
          <div className="mt-3 space-y-3">
            {patterns.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded"
                style={{ backgroundColor: 'hsl(270, 25%, 9%)', border: '1px solid hsl(258, 38%, 38%)' }}
              >
                {p.confidence < 1 && (
                  <div className="font-mono text-[9px] tracking-[0.08em] uppercase" style={{ color: 'hsl(258, 28%, 50%)' }}>
                    EARLY SIGNAL — NOT YET CONFIRMED
                  </div>
                )}
                <p className="font-mono text-[15px] text-am-text-primary italic mt-2">
                  {p.text}
                </p>
                <div className="text-micro mt-2">Based on {p.decisions} session{p.decisions !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/reflection-b')}
            className="ghost-link mt-4 !text-am-purple text-[13px]"
            aria-label="Explore in reflection"
          >
            Explore in reflection →
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
