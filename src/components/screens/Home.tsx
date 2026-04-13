import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface HomeData {
  lastState: string | null;
  lastActivation: number;
  lastSessionAgo: string;
  observerTrend: string;
  cnrTrend: string;
  dci: string;
  ctaState: 1 | 2 | 3 | 4;
  pendingOutcomeDecisionId: string | null;
  pendingReflectionId: string | null;
  pendingReflectionType: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<HomeData>({
    lastState: null, lastActivation: 0, lastSessionAgo: '',
    observerTrend: 'BUILDING...', cnrTrend: 'BUILDING...', dci: 'BUILDING...',
    ctaState: 4, pendingOutcomeDecisionId: null,
    pendingReflectionId: null, pendingReflectionType: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadHomeData();
  }, [user]);

  const loadHomeData = async () => {
    if (!user) return;
    const now = new Date().toISOString();

    // Parallel queries
    const [lastSessionRes, metricsRes, pendingOutcomeRes, pendingReflectionRes, patternsRes] = await Promise.all([
      supabase.from('sessions').select('detected_state, activation_level, user_corrected_state, created_at')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('user_metrics').select('*').eq('user_id', user.id).single(),
      supabase.from('outcomes')
        .select('id, decision_id, decisions!inner(outcome_signal_due_at)')
        .eq('user_id', user.id)
        .is('outcome_rating', null)
        .eq('outcome_expired', false)
        .limit(1)
        .single(),
      supabase.from('reflections')
        .select('id, reflection_type')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .lte('reflection_due_at', now)
        .order('reflection_due_at', { ascending: true })
        .limit(1)
        .single(),
      supabase.from('patterns')
        .select('id')
        .eq('user_id', user.id)
        .eq('viewed', false)
        .limit(1)
        .single(),
    ]);

    const lastSession = lastSessionRes.data;
    const metrics = metricsRes.data;

    // Expire outcomes older than 72h (or 10min if accelerated)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('pilot_accelerated_timers')
      .eq('id', user.id)
      .single();
    const accelerated = profileData?.pilot_accelerated_timers;
    const expiryMs = accelerated ? 10 * 60 * 1000 : 72 * 60 * 60 * 1000;

    // Check for expired outcomes and mark them
    const { data: allPendingOutcomes } = await supabase
      .from('outcomes')
      .select('id, created_at')
      .eq('user_id', user.id)
      .is('outcome_rating', null)
      .eq('outcome_expired', false);

    if (allPendingOutcomes) {
      for (const o of allPendingOutcomes) {
        if (Date.now() - new Date(o.created_at).getTime() > expiryMs) {
          await supabase.from('outcomes').update({ outcome_expired: true }).eq('id', o.id);
        }
      }
    }

    // Determine CTA state by priority
    let ctaState: 1 | 2 | 3 | 4 = 4;
    let pendingOutcomeDecisionId: string | null = null;
    let pendingReflectionId: string | null = null;
    let pendingReflectionType: string | null = null;

    // Check outcome signal due (CTA 1)
    if (pendingOutcomeRes.data) {
      const decision = pendingOutcomeRes.data.decisions as any;
      if (decision?.outcome_signal_due_at && new Date(decision.outcome_signal_due_at) <= new Date(now)) {
        ctaState = 1;
        pendingOutcomeDecisionId = pendingOutcomeRes.data.decision_id;
      }
    }

    // Check pending reflection (CTA 2) — only if not already CTA 1
    if (ctaState === 4 && pendingReflectionRes.data) {
      ctaState = 2;
      pendingReflectionId = pendingReflectionRes.data.id;
      pendingReflectionType = pendingReflectionRes.data.reflection_type;
    }

    // Check unviewed patterns (CTA 3)
    if (ctaState === 4 && patternsRes.data) {
      ctaState = 3;
    }

    setData({
      lastState: lastSession ? (lastSession.user_corrected_state || lastSession.detected_state) : null,
      lastActivation: lastSession?.activation_level || 0,
      lastSessionAgo: lastSession ? timeAgo(lastSession.created_at) : '',
      observerTrend: metrics?.observer_strength_trend?.toUpperCase() || 'BUILDING...',
      cnrTrend: metrics?.cnr_trend?.toUpperCase() || 'BUILDING...',
      dci: metrics?.dci_score != null ? `${Math.round(metrics.dci_score)}%` : 'BUILDING...',
      ctaState,
      pendingOutcomeDecisionId,
      pendingReflectionId,
      pendingReflectionType,
    });
    setLoading(false);
  };

  const ctaConfigs = {
    1: { context: 'Outcome signal due', label: 'COMPLETE OUTCOME SIGNAL →', className: 'btn-amber', path: '/outcome-signal' },
    2: { context: 'Reflection waiting', label: 'COMPLETE REFLECTION →', className: 'btn-purple',
         path: data.pendingReflectionType === 'post_pattern' ? '/reflection-b' : '/reflection-a' },
    3: { context: 'First pattern detected', label: 'FIRST PATTERN READY →', className: 'btn-gold', path: '/dashboard' },
    4: { context: 'Ready when you are', label: 'BEGIN SESSION →', className: 'btn-neutral', path: '/state-capture' },
  };

  const current = ctaConfigs[data.ctaState];

  if (loading) {
    return (
      <ScreenWrapper padBottom>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="font-mono text-[12px] text-am-text-secondary loading-dots">LOADING</div>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padBottom>
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-label">AWARENESS MIRROR</span>
          <button onClick={() => navigate('/profile')} className="ghost-link text-[11px]" aria-label="Settings">⚙</button>
        </div>

        <div className="divider mt-3" />

        {/* Last state */}
        {data.lastState ? (
          <div className="py-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono font-medium text-[18px] text-am-text-primary">{data.lastState}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`text-[8px] ${i <= data.lastActivation ? 'text-am-text-primary' : 'text-am-text-tertiary'}`}>●</span>
                  ))}
                </div>
              </div>
              <span className="text-micro">{data.lastSessionAgo}</span>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="font-mono text-[14px] text-am-text-secondary italic">No sessions yet</div>
          </div>
        )}

        <div className="divider" />

        {/* Metrics */}
        <div className="grid grid-cols-3 py-4 gap-2">
          <div>
            <div className="text-label text-[10px]">OBSERVER</div>
            <div className={`font-mono font-medium text-[14px] mt-1 ${data.observerTrend === 'BUILDING...' ? 'text-am-text-tertiary italic text-[12px]' : 'text-am-teal'}`}>
              {data.observerTrend}
            </div>
          </div>
          <div>
            <div className="text-label text-[10px]">CNR</div>
            <div className={`font-mono font-medium text-[14px] mt-1 ${data.cnrTrend === 'BUILDING...' ? 'text-am-text-tertiary italic text-[12px]' : 'text-am-teal'}`}>
              {data.cnrTrend}
            </div>
          </div>
          <div>
            <div className="text-label text-[10px]">DCI</div>
            <div className={`font-mono text-[13px] mt-1 ${data.dci === 'BUILDING...' ? 'text-am-text-tertiary italic' : 'text-am-teal font-medium text-[14px]'}`}>
              {data.dci}
            </div>
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
