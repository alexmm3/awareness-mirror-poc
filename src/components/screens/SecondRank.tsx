import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface Alternative {
  name: string;
  description: string;
  isOriginal: boolean;
}

export default function SecondRank() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  const classification = state.activeSession?.classification;

  // Nothing selected by default. The CONFIRM button activates only
  // after the user explicitly taps a card (even the original one).
  const [selected, setSelected] = useState<number | null>(null);

  // Build the card list. The original classification is always first.
  // Alternatives from the LLM are deduplicated against the original
  // (Claude occasionally echoes the primary state back in
  // alternative_states, which would break React's stable keys).
  const alternatives: Alternative[] = useMemo(() => {
    if (!classification) return [];

    const originalName = classification.detected_state?.trim() || '';
    const originalCard: Alternative = {
      name: originalName,
      description: classification.recognition_sentence || '',
      isOriginal: true,
    };

    const alts: Alternative[] = (classification.alternative_states || [])
      .filter((a): a is { state: string; description: string } =>
        !!a && typeof a.state === 'string' && a.state.trim().length > 0
      )
      .map((a) => ({
        name: a.state.trim(),
        description: a.description || '',
        isOriginal: false,
      }))
      .filter((a) => a.name.toLowerCase() !== originalName.toLowerCase());

    return [originalCard, ...alts];
  }, [classification]);

  if (!classification) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-body text-am-text-secondary">No active session.</div>
          <button onClick={() => navigate('/')} className="ghost-link mt-4">Return home</button>
        </div>
      </ScreenWrapper>
    );
  }

  const handleConfirm = () => {
    if (selected === null) return;
    const picked = alternatives[selected];
    const isCorrection = !picked.isOriginal;

    if (isCorrection) {
      // 1. Update client-side context so BehaviourSurface picks up the
      //    corrected state immediately after navigation.
      dispatch({ type: 'SET_CORRECTED_STATE', payload: picked.name });

      // 2. Persist the correction to the DB. Fire-and-forget — we don't
      //    block navigation on the round-trip and we don't await it.
      //    This also avoids an earlier bug where a failing RPC call made
      //    the flow feel frozen.
      const sessionId = state.activeSession?.id;
      if (sessionId) {
        supabase
          .from('sessions')
          .update({ user_corrected_state: picked.name })
          .eq('id', sessionId)
          .then(() => {});
      }

      if (user) {
        // Increment correction_count by reading the current value then
        // writing back. No RPC dependency.
        supabase
          .from('user_metrics')
          .select('correction_count')
          .eq('user_id', user.id)
          .single()
          .then(({ data }) => {
            const next = (data?.correction_count || 0) + 1;
            supabase
              .from('user_metrics')
              .update({ correction_count: next })
              .eq('user_id', user.id)
              .then(() => {});
          });
      }
    }

    navigate('/behaviour-surface');
  };

  return (
    <ScreenWrapper showBack backPath="/state-display" padBottom={false}>
      <h2 className="font-sans font-medium text-[16px] text-am-text-primary mt-4">
        You know your system best — which of these fits?
      </h2>

      <div className="flex flex-col gap-3 mt-6">
        {alternatives.map((alt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`card-surface p-3 text-left transition-all duration-150 border-l-[3px] ${
              selected === i
                ? 'border-am-border-active border-l-am-teal'
                : 'border-l-transparent'
            }`}
            aria-label={alt.name}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-[15px] text-am-text-primary">
                {alt.name}
              </span>
              {alt.isOriginal && <span className="text-micro">current</span>}
            </div>
            {alt.description && (
              <p className="text-small mt-1">{alt.description}</p>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        disabled={selected === null}
        className={`btn-primary btn-teal mt-8 mb-8 ${
          selected === null ? 'opacity-40 pointer-events-none' : ''
        }`}
        aria-label="Confirm selection"
      >
        CONFIRM SELECTION →
      </button>

      <button
        onClick={() => navigate('/state-display')}
        className="ghost-link block mx-auto mb-8"
      >
        ← return to original
      </button>
    </ScreenWrapper>
  );
}
