import { useEffect, useState } from 'react';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface SessionRow {
  id: string;
  detected_state: string | null;
  user_corrected_state: string | null;
  session_type: string;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  state_capture: 'State Capture',
  decision_capture: 'Decision Capture',
  high_pressure_signal: 'High-Pressure',
};

export default function History() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('sessions')
      .select('id, detected_state, user_corrected_state, session_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setSessions(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <ScreenWrapper padBottom>
      <div className="text-label mt-4">SESSION HISTORY</div>
      <div className="divider mt-3" />

      {loading ? (
        <div className="font-mono text-[12px] text-am-text-secondary loading-dots mt-6">Loading</div>
      ) : sessions.length === 0 ? (
        <div className="mt-6 text-body text-am-text-secondary italic">No sessions yet.</div>
      ) : (
        <div className="space-y-0 mt-2">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3 border-b border-am-border">
              <div>
                <div className="text-micro">
                  {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="font-mono text-[11px] text-am-text-primary mt-1">
                  {s.user_corrected_state || s.detected_state || typeLabels[s.session_type] || s.session_type}
                </div>
              </div>
              <span className="text-micro">{typeLabels[s.session_type] || s.session_type}</span>
            </div>
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}
