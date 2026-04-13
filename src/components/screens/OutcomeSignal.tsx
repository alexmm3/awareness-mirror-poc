import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getRandomReflection, CognitiveStateId } from '@/lib/content-templates';

function stateNameToId(name: string): CognitiveStateId {
  return name.toLowerCase().replace(/\s+/g, '-') as CognitiveStateId;
}

type OutcomeRating = 'better' | 'as_expected' | 'harder';

interface PendingDecision {
  id: string;
  decision_text: string;
  detected_state_at_decision: string | null;
}

export default function OutcomeSignal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [decision, setDecision] = useState<PendingDecision | null>(null);
  const [selected, setSelected] = useState<OutcomeRating | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Find the oldest pending outcome signal
    supabase
      .from('outcomes')
      .select('decision_id, decisions!inner(id, decision_text, detected_state_at_decision, outcome_signal_due_at)')
      .eq('user_id', user.id)
      .is('outcome_rating', null)
      .eq('outcome_expired', false)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          const d = data.decisions as any;
          setDecision({
            id: d.id,
            decision_text: d.decision_text,
            detected_state_at_decision: d.detected_state_at_decision,
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleConfirm = async () => {
    if (!decision || !user || !selected || saving) return;
    setSaving(true);
    const rating = selected;

    // Update outcome
    await supabase
      .from('outcomes')
      .update({
        outcome_rating: rating,
        outcome_received_at: new Date().toISOString(),
      })
      .eq('decision_id', decision.id)
      .eq('user_id', user.id);

    // Get user profile for accelerated timers
    const { data: profileData } = await supabase
      .from('profiles')
      .select('pilot_accelerated_timers')
      .eq('id', user.id)
      .single();
    const accelerated = profileData?.pilot_accelerated_timers;

    // Schedule post_outcome reflection
    const ratingLabel = rating === 'better' ? 'better than expected'
      : rating === 'harder' ? 'harder than expected' : 'about as expected';

    const stateId = decision.detected_state_at_decision
      ? stateNameToId(decision.detected_state_at_decision) : null;

    const reflectionTemplate = stateId
      ? getRandomReflection(stateId, 'post_outcome') : null;

    const promptText = reflectionTemplate
      ? reflectionTemplate.template
          .replace('{outcome}', ratingLabel)
      : `Your system recorded this decision. It went ${ratingLabel}. What do you notice?`;

    const reflectionDue = new Date(
      Date.now() + (accelerated ? 1 * 60 * 1000 : 60 * 60 * 1000)
    ).toISOString();

    await supabase.from('reflections').insert({
      user_id: user.id,
      decision_id: decision.id,
      reflection_type: 'post_outcome',
      prompt_text: promptText,
      reflection_due_at: reflectionDue,
    });

    // Trigger pattern detection in background
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (authSession) {
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-patterns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authSession.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
        }).catch(() => {}); // Fire and forget
      }
    } catch {}

    // Navigate to confirmation, passing the rating
    navigate('/outcome-confirmation', { state: { rating } });
  };

  const options: { label: string; value: OutcomeRating }[] = [
    { label: 'Better than expected', value: 'better' },
    { label: 'About as expected', value: 'as_expected' },
    { label: 'Harder than expected', value: 'harder' },
  ];

  if (loading) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="font-mono text-[12px] text-am-text-secondary loading-dots">Loading</div>
        </div>
      </ScreenWrapper>
    );
  }

  if (!decision) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-body text-am-text-secondary">No pending outcome signals.</div>
          <button onClick={() => navigate('/')} className="ghost-link mt-4">Return home</button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="pt-8">
        <div className="font-mono text-[11px] text-am-text-tertiary uppercase tracking-wider mb-2">
          OUTCOME SIGNAL
        </div>
        <h1 className="font-mono-display text-[22px] text-am-text-primary leading-tight">
          How did this decision go?
        </h1>

        {/* Decision context */}
        <div className="card-surface p-4 rounded-lg mt-6">
          <div className="font-mono text-[10px] text-am-text-tertiary uppercase tracking-wider mb-2">
            DECISION
          </div>
          <div className="font-sans text-[14px] text-am-text-primary leading-relaxed">
            "{decision.decision_text}"
          </div>
          {decision.detected_state_at_decision && (
            <>
              <div className="font-mono text-[10px] text-am-text-tertiary uppercase tracking-wider mt-3">
                STATE AT TIME OF DECISION
              </div>
              <div className="font-mono text-[13px] text-am-amber mt-1">
                {decision.detected_state_at_decision}
              </div>
            </>
          )}
        </div>

        {/* Response options */}
        <div className="mt-8 space-y-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`card-surface w-full p-4 rounded-lg text-left font-sans text-[14px] text-am-text-primary transition-colors ${
                selected === opt.value ? 'border-am-border-active border-l-[3px] border-l-am-teal' : 'border-l-[3px] border-l-transparent'
              }`}
              aria-label={opt.label}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || saving}
          className={`btn-primary btn-amber mt-6 mb-8 ${!selected ? 'opacity-40 pointer-events-none' : ''}`}
          aria-label="Confirm"
        >
          {saving ? 'SAVING...' : 'CONFIRM →'}
        </button>
      </div>
    </ScreenWrapper>
  );
}
