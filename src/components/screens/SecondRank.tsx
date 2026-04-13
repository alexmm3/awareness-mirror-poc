import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function SecondRank() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  const classification = state.activeSession?.classification;
  const [selected, setSelected] = useState(0); // 0 = original classification

  if (!classification) {
    navigate('/', { replace: true });
    return null;
  }

  // Build alternatives list: original + alternatives from API
  const alternatives = [
    { name: classification.detected_state, description: classification.recognition_sentence, current: true },
    ...classification.alternative_states.map(alt => ({
      name: alt.state,
      description: alt.description,
      current: false,
    })),
  ];

  const handleConfirm = async () => {
    const selectedState = alternatives[selected].name;
    const isCorrection = selected !== 0;

    if (isCorrection) {
      dispatch({ type: 'SET_CORRECTED_STATE', payload: selectedState });

      // Update session in DB
      if (state.activeSession?.id) {
        await supabase
          .from('sessions')
          .update({ user_corrected_state: selectedState })
          .eq('id', state.activeSession.id);
      }

      // Increment correction count
      if (user) {
        await supabase.rpc('increment_correction_count', { p_user_id: user.id }).catch(() => {
          // RPC may not exist yet, update directly
          supabase
            .from('user_metrics')
            .update({ correction_count: (state.activeSession as any)?.correctionCount || 1 })
            .eq('user_id', user.id);
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
            key={alt.name}
            onClick={() => setSelected(i)}
            className={`card-surface p-3 text-left transition-all duration-150 ${
              selected === i ? 'border-am-border-active border-l-2 border-l-am-teal' : ''
            }`}
            aria-label={alt.name}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-[15px] text-am-text-primary">{alt.name}</span>
              {alt.current && <span className="text-micro">current</span>}
            </div>
            <p className="text-small mt-1">{alt.description}</p>
          </button>
        ))}
      </div>

      <button onClick={handleConfirm} className="btn-primary btn-teal mt-8 mb-8" aria-label="Confirm selection">
        CONFIRM SELECTION →
      </button>

      <button onClick={() => navigate('/state-display')} className="ghost-link block mx-auto mb-8">
        ← return to original
      </button>
    </ScreenWrapper>
  );
}
