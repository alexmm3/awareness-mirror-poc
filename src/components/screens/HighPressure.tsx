import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function HighPressure() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [logged, setLogged] = useState(false);

  const handleLog = async () => {
    if (!user) return;

    // Insert high-pressure session
    await supabase.from('sessions').insert({
      user_id: user.id,
      session_type: 'high_pressure_signal',
      raw_text_hash: text || null,
      context_tags: ['high_pressure_signal'],
      session_started_at: new Date().toISOString(),
      session_closed_at: new Date().toISOString(),
    });

    // Increment total_sessions
    const { data: metrics } = await supabase
      .from('user_metrics')
      .select('total_sessions')
      .eq('user_id', user.id)
      .single();

    await supabase
      .from('user_metrics')
      .update({ total_sessions: (metrics?.total_sessions || 0) + 1 })
      .eq('user_id', user.id);

    setLogged(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (logged) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-mono font-medium text-[14px] text-am-text-primary">
            Noted. Your system registered the moment.
          </p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <h1 className="font-mono-display text-[22px] text-am-text-primary mt-6">HIGH-PRESSURE MOMENT</h1>
      <p className="text-body text-am-text-secondary mt-2">Log it in under 30 seconds. No analysis. No follow-up.</p>

      <textarea
        className="textarea-am mt-6"
        style={{ minHeight: 80 }}
        placeholder="Optional — what happened?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="High-pressure moment description"
      />

      <button onClick={handleLog} className="btn-primary btn-red mt-6 mb-8" aria-label="Log it">
        LOG IT →
      </button>
    </ScreenWrapper>
  );
}
