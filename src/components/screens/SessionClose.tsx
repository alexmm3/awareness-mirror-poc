import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getRandomClosure } from '@/lib/content-templates';
import { recalculateMetrics } from '@/lib/metrics';

export default function SessionClose() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { user, profile } = useAuth();
  const closedRef = useRef(false);
  const session = state.activeSession;

  const clarity = session?.recheckClarity || 'same';
  const closureStatement = getRandomClosure();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  useEffect(() => {
    if (closedRef.current || !session?.id || !user) return;
    closedRef.current = true;

    const closeSession = async () => {
      const closedAt = new Date().toISOString();

      // Update session closed_at
      await supabase
        .from('sessions')
        .update({ session_closed_at: closedAt })
        .eq('id', session.id);

      // Increment total_sessions
      await supabase
        .from('user_metrics')
        .update({
          total_sessions: (await supabase
            .from('user_metrics')
            .select('total_sessions')
            .eq('user_id', user.id)
            .single()
          ).data?.total_sessions + 1 || 1,
        })
        .eq('user_id', user.id);

      // If a decision was logged, schedule outcome signal
      if (session.decisionId) {
        const accelerated = profile?.pilot_accelerated_timers;
        const outcomeDue = new Date(
          new Date(closedAt).getTime() + (accelerated ? 2 * 60 * 1000 : 48 * 60 * 60 * 1000)
        ).toISOString();
        const reflectionFallback = new Date(
          new Date(closedAt).getTime() + (accelerated ? 3 * 60 * 1000 : 49 * 60 * 60 * 1000)
        ).toISOString();

        await supabase
          .from('decisions')
          .update({
            outcome_signal_due_at: outcomeDue,
            reflection_fallback_due_at: reflectionFallback,
          })
          .eq('id', session.decisionId);
      }

      // Recalculate metrics
      await recalculateMetrics(user.id);
    };

    closeSession();
  }, []);

  const handleDone = () => {
    dispatch({ type: 'CLEAR_SESSION' });
    navigate('/');
  };

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="font-mono font-medium text-[16px] text-am-text-primary italic text-center leading-relaxed">
          "{closureStatement}"
        </p>
        <div className="font-mono text-[12px] text-am-teal mt-6">
          CLARITY THIS SESSION: {clarity.charAt(0).toUpperCase() + clarity.slice(1)}
        </div>
        <div className="text-micro mt-2">{dateStr} — {timeStr}</div>
        <button onClick={handleDone} className="ghost-link mt-8" aria-label="Done">
          DONE
        </button>
      </div>
    </ScreenWrapper>
  );
}
