import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

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
  const canSubmit = decisionWords >= 5 && outcomeWords >= 5 && type !== '';

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
    }

    setConfirmed(true);
    setSaving(false);
  };

  if (confirmed) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-mono font-medium text-[14px] text-am-teal">Decision logged.</p>
          <button onClick={() => navigate('/technique-selection')} className="btn-primary btn-teal mt-6 w-48" aria-label="Continue">
            CONTINUE →
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
