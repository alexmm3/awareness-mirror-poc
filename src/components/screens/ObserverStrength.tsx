import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ObserverStrength() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [totalSessions, setTotalSessions] = useState(0);
  const [trend, setTrend] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_metrics')
      .select('total_sessions, observer_strength_trend')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setTotalSessions(data.total_sessions || 0);
          setTrend(data.observer_strength_trend);
        }
        setLoading(false);
      });
  }, [user]);

  const hasEnoughData = totalSessions >= 5;
  const remaining = Math.max(0, 5 - totalSessions);

  return (
    <ScreenWrapper showBack backPath="/behaviour-surface" padBottom={false}>
      <div className="text-micro mt-4">3 / 4</div>
      <div className="divider mt-3" />

      <div className="mt-6">
        <div className="text-label">OBSERVER STRENGTH</div>

        {loading ? (
          <div className="mt-4">
            <div className="font-mono text-[12px] text-am-text-secondary loading-dots">Loading</div>
          </div>
        ) : !hasEnoughData ? (
          <div className="mt-4">
            <p className="text-body text-am-text-secondary">
              {remaining} more session{remaining !== 1 ? 's' : ''} to your first Observer Strength reading
            </p>
            <div className="mt-4 h-2 bg-am-bg-tertiary rounded-sm overflow-hidden">
              <div className="h-full bg-am-teal rounded-sm" style={{ width: `${(totalSessions / 5) * 100}%` }} />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="font-mono font-medium text-[16px] text-am-teal">
              {trend === 'rising' ? '↑ RISING' : trend === 'declining' ? '↓ DECLINING' : '→ STABLE'}
            </div>
            <p className="text-body text-am-text-secondary mt-2">
              Your self-perception accuracy has {trend === 'rising' ? 'improved' : trend === 'declining' ? 'declined' : 'remained stable'} over recent sessions.
            </p>
          </div>
        )}
      </div>

      <button onClick={() => navigate('/loop-progress')} className="btn-primary btn-teal mt-8 mb-8" aria-label="Continue">
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
