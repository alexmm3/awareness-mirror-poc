import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { SUB_PROMPTS } from '@/lib/content-templates';
import { recalculateMetrics } from '@/lib/metrics';

interface ReflectionData {
  id: string;
  prompt_text: string;
  decision_id: string | null;
  detected_state: string | null;
  outcome_rating: string | null;
}

const ratingLabels: Record<string, string> = {
  better: 'BETTER THAN EXPECTED',
  as_expected: 'AS EXPECTED',
  harder: 'HARDER THAN EXPECTED',
};

export default function ReflectionA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState<number[]>([]);
  const [showIAS, setShowIAS] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Find pending post_outcome reflection
    supabase
      .from('reflections')
      .select('id, prompt_text, decision_id')
      .eq('user_id', user.id)
      .eq('reflection_type', 'post_outcome')
      .is('completed_at', null)
      .order('reflection_due_at', { ascending: true })
      .limit(1)
      .single()
      .then(async ({ data }) => {
        if (!data) {
          setLoading(false);
          return;
        }

        // Get decision context
        let detected_state: string | null = null;
        let outcome_rating: string | null = null;

        if (data.decision_id) {
          const { data: decData } = await supabase
            .from('decisions')
            .select('detected_state_at_decision')
            .eq('id', data.decision_id)
            .single();
          detected_state = decData?.detected_state_at_decision || null;

          const { data: outcomeData } = await supabase
            .from('outcomes')
            .select('outcome_rating')
            .eq('decision_id', data.decision_id)
            .single();
          outcome_rating = outcomeData?.outcome_rating || null;
        }

        setReflection({
          id: data.id,
          prompt_text: data.prompt_text,
          decision_id: data.decision_id,
          detected_state,
          outcome_rating,
        });
        setLoading(false);
      });
  }, [user]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const toggleExpand = (i: number) => {
    setExpanded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleAction = async (submitted: boolean) => {
    if (reflection && user) {
      await supabase
        .from('reflections')
        .update({
          response_text: submitted && text.trim() ? text.trim() : null,
        })
        .eq('id', reflection.id);
    }
    setShowIAS(true);
  };

  const handleIAS = async (response: 'yes' | 'partially' | 'no') => {
    if (reflection && user) {
      await supabase
        .from('reflections')
        .update({
          ias_response: response,
          completed_at: new Date().toISOString(),
        })
        .eq('id', reflection.id);

      // Increment complete_loops
      const { data: metrics } = await supabase
        .from('user_metrics')
        .select('complete_loops')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('user_metrics')
        .update({ complete_loops: (metrics?.complete_loops || 0) + 1 })
        .eq('user_id', user.id);

      // Recalculate metrics
      await recalculateMetrics(user.id);
    }
    setTimeout(() => navigate('/'), 400);
  };

  if (loading) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="font-mono text-[12px] text-am-text-secondary loading-dots">Loading</div>
        </div>
      </ScreenWrapper>
    );
  }

  if (!reflection) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-body text-am-text-secondary">No pending reflections.</div>
          <button onClick={() => navigate('/')} className="ghost-link mt-4">Return home</button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex items-center justify-between mt-4">
        <div className="text-label">REFLECTION</div>
        <div className="text-micro italic">post_outcome</div>
      </div>

      {/* Context header */}
      {reflection.detected_state && reflection.outcome_rating && (
        <div className="border-l-2 border-am-amber pl-3 py-2 mt-4">
          <div className="font-mono text-[12px] text-am-text-primary">
            {reflection.detected_state} → {ratingLabels[reflection.outcome_rating] || reflection.outcome_rating}
          </div>
        </div>
      )}

      <div className="divider mt-4" />

      <p className="font-sans text-[17px] text-am-text-primary leading-[1.7] mt-4">
        {reflection.prompt_text}
      </p>

      <textarea
        className="textarea-am mt-4"
        style={{ minHeight: 120 }}
        placeholder="Write freely. 100 words max."
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Reflection response"
      />
      <div className="text-micro text-right mt-1">{wordCount} / 100</div>

      {/* Sub-prompts */}
      <div className="mt-4 space-y-1">
        {SUB_PROMPTS.map((prompt, i) => (
          <div key={i} className="border-b border-am-border">
            <button
              onClick={() => toggleExpand(i)}
              className="w-full flex items-center gap-2 py-3 text-left"
              aria-label={`Expand: ${prompt}`}
            >
              <span className="font-mono text-[14px] text-am-text-secondary">{expanded.includes(i) ? '−' : '+'}</span>
              <span className="text-small">{prompt.slice(0, 50)}...</span>
            </button>
            {expanded.includes(i) && (
              <p className="text-small italic pb-3 pl-5">{prompt}</p>
            )}
          </div>
        ))}
      </div>

      {!showIAS ? (
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={() => handleAction(false)} className="btn-primary btn-ghost btn-40" aria-label="Skip">SKIP →</button>
          <button onClick={() => handleAction(true)} className="btn-primary btn-purple btn-40" aria-label="Submit">SUBMIT →</button>
        </div>
      ) : (
        <div className="animate-slide-up mt-6">
          <p className="font-sans text-[15px] text-am-text-primary">Did what you noticed feel accurate?</p>
          <div className="flex gap-2 mt-3 mb-8">
            {(['yes', 'partially', 'no'] as const).map((opt) => (
              <button key={opt} onClick={() => handleIAS(opt)} className="chip flex-1 justify-center" aria-label={opt.toUpperCase()}>
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
}
