import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ReEntry() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lastState, setLastState] = useState<string | null>(null);
  const [cnrTrend, setCnrTrend] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('sessions')
        .select('detected_state, user_corrected_state')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      supabase.from('user_metrics')
        .select('cnr_trend')
        .eq('user_id', user.id)
        .single(),
    ]).then(([sessionRes, metricsRes]) => {
      const s = sessionRes.data;
      if (s) setLastState(s.user_corrected_state || s.detected_state);
      if (metricsRes.data) setCnrTrend(metricsRes.data.cnr_trend);
    });
  }, [user]);

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex flex-col justify-center min-h-[70vh]">
        <h1 className="font-mono-display text-[28px] text-am-text-primary">Welcome back.</h1>
        <p className="text-body text-am-text-secondary mt-2">Your data is here.</p>

        <div className="mt-8">
          <div className="text-micro">LAST STATE</div>
          <div className="font-mono text-[14px] text-am-text-primary mt-1">{lastState || '—'}</div>
          <div className="text-micro mt-3">CNR TREND</div>
          <div className="font-mono text-[14px] text-am-teal mt-1">
            {cnrTrend ? cnrTrend.toUpperCase() : 'BUILDING...'}
          </div>
        </div>

        <button onClick={() => navigate('/state-capture')} className="btn-primary btn-teal mt-8" aria-label="Begin a session">
          BEGIN A SESSION →
        </button>
      </div>
    </ScreenWrapper>
  );
}
