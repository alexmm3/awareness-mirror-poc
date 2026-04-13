import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getRecommendedTechnique, CognitiveStateId } from '@/lib/content-templates';

const DECISION_TYPES = ['People', 'Money', 'Strategy', 'Operations'];

export default function DecisionCapture() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  const [decision, setDecision] = useState('');
  const [outcome, setOutcome] = useState('');
  const [type, setType] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  const session = state.activeSession;
  const detectedState = session?.userCorrectedState || session?.classification?.detected_state || '';

  const decisionWords = decision.trim() ? decision.trim().split(/\s+/).length : 0;
  const outcomeWords = outcome.trim() ? outcome.trim().split(/\s+/).length : 0;
  const canSubmit = decision.trim().length >= 3 && outcome.trim().length >= 3 && type !== '';

  const handleSubmit = async () => {
    if (!canSubmit || !user || saving) return;
    setSaving(true);

    // If no active session, create one for standalone decision capture
    let sessionId = session?.id;
    if (!sessionId) {
      const { data: newSession } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          session_type: 'decision_capture',
          session_started_at: new Date().toISOString(),
          detected_state: detectedState || null,
        })
        .select('id')
        .single();

      if (newSession) {
        sessionId = newSession.id;
        dispatch({ type: 'START_SESSION', payload: { type: 'decision_capture' } });
      }
    }

    // Insert decision
    const { data: decisionData } = await supabase
      .from('decisions')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        decision_text: decision,
        success_criteria: outcome,
        decision_type: type,
        detected_state_at_decision: detectedState || null,
      })
      .select('id')
      .single();

    if (decisionData) {
      dispatch({ type: 'SET_DECISION_ID', payload: decisionData.id });

      // Create pending outcome record
      await supabase.from('outcomes').insert({
        decision_id: decisionData.id,
        user_id: user.id,
      });

      // For standalone decision capture (no active session with classification),
      // set outcome_signal_due_at immediately since SessionClose won't be reached
      const isStandalone = !session?.classification;
      if (isStandalone) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('pilot_accelerated_timers')
          .eq('id', user.id)
          .single();
        const accelerated = profileData?.pilot_accelerated_timers;
        const now = new Date();
        const outcomeDue = new Date(
          now.getTime() + (accelerated ? 2 * 60 * 1000 : 48 * 60 * 60 * 1000)
        ).toISOString();

        await supabase
          .from('decisions')
          .update({ outcome_signal_due_at: outcomeDue })
          .eq('id', decisionData.id);
      }
    }

    setConfirmed(true);
    setSaving(false);
  };

  if (confirmed) {
    const hasActiveFlow = !!session?.classification;
    const handleContinue = () => {
      if (hasActiveFlow) {
        const stateId = (session?.userCorrectedState || session?.classification?.detected_state || '')
          .toLowerCase().replace(/\s+/g, '-') as CognitiveStateId;
        const technique = getRecommendedTechnique(stateId) || 'breathing-4-6';
        navigate(`/stabilisation?technique=${technique}`);
      } else {
        navigate('/');
      }
    };

    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-mono font-medium text-[14px] text-am-teal">Decision logged.</p>
          <button onClick={handleContinue} className="btn-primary btn-teal mt-6 w-48" aria-label="Continue">
            {hasActiveFlow ? 'CONTINUE →' : 'DONE →'}
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      {/* State context */}
      {detectedState && (
        <div className="border-l-2 border-am-amber pl-3 py-2 mt-2">
          <div className="text-micro">CURRENT STATE</div>
          <div className="font-mono font-medium text-[14px] text-am-text-primary">{detectedState}</div>
        </div>
      )}

      <div className="divider mt-4" />

      <div className="text-label mt-4">DECISION CAPTURE</div>

      {/* Field A */}
      <div className="mt-4">
        <div className="text-label">DESCRIBE THE DECISION</div>
        <textarea
          className="textarea-am mt-2"
          style={{ minHeight: 80 }}
          placeholder="Describe the decision in one sentence."
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          aria-label="Decision description"
        />
        <div className="text-micro text-right mt-1">{decisionWords} / 100</div>
      </div>

      {/* Field B */}
      <div className="mt-4">
        <div className="text-label">WHAT DOES A GOOD OUTCOME LOOK LIKE?</div>
        <textarea
          className="textarea-am mt-2"
          style={{ minHeight: 80 }}
          placeholder="What does success look like in 6 months?"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          aria-label="Good outcome description"
        />
        <div className="text-micro text-right mt-1">{outcomeWords} / 100</div>
      </div>

      {/* Decision type */}
      <div className="mt-4">
        <div className="text-label">DECISION TYPE</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {DECISION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`chip ${type === t ? 'chip-selected !text-am-teal !border-am-border-active' : ''}`}
              aria-label={`Decision type: ${t}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-am-text-tertiary italic mt-6">
        We'll follow up in 48 hours. — Outcome Signal scheduled automatically.
      </p>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || saving}
        className="btn-primary btn-teal mt-6"
        aria-label="Log this decision"
      >
        {saving ? 'SAVING...' : 'LOG THIS DECISION →'}
      </button>

      <button onClick={() => navigate('/technique-selection')} className="ghost-link block mx-auto mt-3 mb-8">
        Skip →
      </button>
    </ScreenWrapper>
  );
}
