import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { getRecommendedTechnique, CognitiveStateId } from '@/lib/content-templates';

function stateNameToId(name: string): CognitiveStateId {
  return name.toLowerCase().replace(/\s+/g, '-') as CognitiveStateId;
}

export default function LoopProgress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state: appState } = useAppContext();
  const session = appState.activeSession;
  const detectedState = session?.userCorrectedState || session?.classification?.detected_state || '';
  const [completeLoops, setCompleteLoops] = useState(0);
  const [hasPattern, setHasPattern] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('user_metrics').select('complete_loops').eq('user_id', user.id).single(),
      supabase.from('patterns').select('id').eq('user_id', user.id).limit(1).single(),
    ]).then(([metricsRes, patternRes]) => {
      setCompleteLoops(metricsRes.data?.complete_loops || 0);
      setHasPattern(!!patternRes.data);
      setLoading(false);
    });
  }, [user]);

  // 5-node loop steps completed so far in the current cycle
  // State Capture (done) + Decision (maybe) + Outcome + Pattern + Reflection
  const stepsInLoop = Math.min(completeLoops >= 1 ? 5 : 3, 5); // simplified: show progress
  const decisionsToPattern = Math.max(0, 2 - completeLoops);

  return (
    <ScreenWrapper showBack backPath="/observer-strength" padBottom={false}>
      <div className="text-micro mt-4">4 / 4</div>
      <div className="divider mt-3" />

      <div className="mt-6">
        <div className="text-label">LOOP PROGRESS</div>

        {loading ? (
          <div className="font-mono text-[12px] text-am-text-secondary loading-dots mt-3">Loading</div>
        ) : (
          <>
            <p className="text-body text-am-text-primary mt-3">
              {completeLoops === 0
                ? 'Working toward your first complete loop'
                : `${completeLoops} complete loop${completeLoops !== 1 ? 's' : ''}`}
            </p>
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i <= stepsInLoop ? 'bg-am-teal' : 'bg-am-bg-tertiary'}`} />
              ))}
            </div>

            {!hasPattern && decisionsToPattern > 0 && (
              <p className="text-body text-am-text-secondary mt-4">
                {decisionsToPattern} more decision{decisionsToPattern !== 1 ? 's' : ''} to your first pattern
              </p>
            )}

            {hasPattern && (
              <button onClick={() => navigate('/dashboard')} className="ghost-link mt-3 text-am-amber">
                Your first pattern is ready →
              </button>
            )}
          </>
        )}
      </div>

      <button onClick={() => {
        const techniqueId = getRecommendedTechnique(stateNameToId(detectedState)) || 'breathing-4-6';
        navigate(`/stabilisation?technique=${techniqueId}`);
      }} className="btn-primary btn-teal mt-8 mb-8" aria-label="Continue">
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
