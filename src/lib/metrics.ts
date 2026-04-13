import { supabase } from './supabase';

/**
 * Recalculate all user metrics based on current data.
 * Called after session close, outcome signal, and reflection completion.
 */
export async function recalculateMetrics(userId: string): Promise<void> {
  // Fetch all relevant data in parallel
  const [sessionsRes, reflectionsRes, decisionsRes, outcomesRes] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, detected_state, user_corrected_state, recheck_clarity, session_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
    supabase
      .from('reflections')
      .select('ias_response')
      .eq('user_id', userId)
      .not('ias_response', 'is', null),
    supabase
      .from('decisions')
      .select('id, detected_state_at_decision')
      .eq('user_id', userId),
    supabase
      .from('outcomes')
      .select('decision_id, outcome_rating')
      .eq('user_id', userId)
      .not('outcome_rating', 'is', null),
  ]);

  const sessions = sessionsRes.data || [];
  const reflections = reflectionsRes.data || [];
  const decisions = decisionsRes.data || [];
  const outcomes = outcomesRes.data || [];

  // ─── CNR Trend ───────────────────────────────────────────
  // Based on last 8 sessions with recheck_clarity
  const clarityValues = sessions
    .filter(s => s.recheck_clarity)
    .slice(-8)
    .map(s => s.recheck_clarity === 'clearer' ? 1 : s.recheck_clarity === 'cloudier' ? -1 : 0);

  let cnr_trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (clarityValues.length >= 3) {
    const recentAvg = clarityValues.slice(-3).reduce((a, b) => a + b, 0) / 3;
    if (recentAvg > 0.2) cnr_trend = 'improving';
    else if (recentAvg < -0.2) cnr_trend = 'declining';
  }

  // ─── Observer Strength ───────────────────────────────────
  // OS = (IAS_score * 0.40) + (correction_accuracy * 0.35) + (cnr_consistency * 0.25)

  // IAS score: % of 'yes' responses
  const iasTotal = reflections.length;
  const iasYes = reflections.filter(r => r.ias_response === 'yes').length;
  const iasScore = iasTotal > 0 ? (iasYes / iasTotal) * 100 : 50;

  // Correction accuracy: simplified — % sessions WITHOUT corrections
  // (higher = more accurate initial classification)
  const sessionsWithClassification = sessions.filter(s => s.detected_state);
  const corrections = sessions.filter(s => s.user_corrected_state).length;
  const correctionAccuracy = sessionsWithClassification.length > 0
    ? ((sessionsWithClassification.length - corrections) / sessionsWithClassification.length) * 100
    : 50;

  // CNR consistency: % of sessions with 'clearer' outcome
  const cnrSessions = sessions.filter(s => s.recheck_clarity);
  const clearerCount = cnrSessions.filter(s => s.recheck_clarity === 'clearer').length;
  const cnrConsistency = cnrSessions.length > 0
    ? (clearerCount / cnrSessions.length) * 100
    : 50;

  const observerStrengthScore = (iasScore * 0.40) + (correctionAccuracy * 0.35) + (cnrConsistency * 0.25);

  // Observer strength trend: compare last 5 vs previous 5
  let observer_strength_trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (sessions.length >= 5) {
    // Simplified: based on recent IAS trend
    const recentIAS = reflections.slice(-3);
    const olderIAS = reflections.slice(-6, -3);
    if (recentIAS.length >= 2 && olderIAS.length >= 2) {
      const recentYes = recentIAS.filter(r => r.ias_response === 'yes').length / recentIAS.length;
      const olderYes = olderIAS.filter(r => r.ias_response === 'yes').length / olderIAS.length;
      if (recentYes > olderYes + 0.1) observer_strength_trend = 'rising';
      else if (recentYes < olderYes - 0.1) observer_strength_trend = 'declining';
    } else if (observerStrengthScore > 60) {
      observer_strength_trend = 'rising';
    }
  }

  // ─── DCI (Decision Clarity Index) ────────────────────────
  // % of decisions made from regulated states (Calm Readiness, Focused Tension low activation)
  const regulatedStates = ['CALM READINESS', 'Calm Readiness', 'FOCUSED TENSION', 'Focused Tension'];
  const decisionsWithState = decisions.filter(d => d.detected_state_at_decision);
  const regulatedDecisions = decisionsWithState.filter(d =>
    regulatedStates.includes(d.detected_state_at_decision || '')
  ).length;
  const dci_score = decisionsWithState.length > 0
    ? (regulatedDecisions / decisionsWithState.length) * 100
    : 0;

  // ─── Update metrics ──────────────────────────────────────
  await supabase
    .from('user_metrics')
    .update({
      observer_strength_score: Math.round(observerStrengthScore * 100) / 100,
      observer_strength_trend,
      cnr_trend,
      dci_score: Math.round(dci_score * 100) / 100,
      total_sessions: sessions.length,
      correction_count: corrections,
    })
    .eq('user_id', userId);
}
