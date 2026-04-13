// ──────────────────────────────────────────────────────────────────────────────
// Content Templates — Awareness Mirror
// Decision Intelligence tool for founders.
// Tone: clinical-but-curious. Bloomberg Terminal for human cognition.
// NEVER wellness/empathy language. "Your system" not "you are".
// ──────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type CognitiveStateId =
  | 'anxious-vigilance'
  | 'focused-tension'
  | 'calm-readiness'
  | 'cognitive-depletion'
  | 'flat-disconnection'
  | 'reactive-activation';

export type TechniqueId =
  | 'breathing-4-6'
  | 'extended-exhale'
  | 'name-5-sensations'
  | '90-second-pause';

export type ReflectionType = 'post_outcome' | 'post_pattern';

export interface StateTemplate {
  id: CognitiveStateId;
  name: string;
  recognition: string;
  mechanism: string;
  effect: string;
  observer_note: string;
  halo_color: string;
}

export interface ReflectionTemplate {
  id: string;
  state_id: CognitiveStateId;
  type: ReflectionType;
  variation: number;
  template: string;
}

// ── 1. STATE_TEMPLATES ───────────────────────────────────────────────────────

export const STATE_TEMPLATES: StateTemplate[] = [
  {
    id: 'anxious-vigilance',
    name: 'Anxious Vigilance',
    recognition:
      'Your system is running threat-detection as a dominant process — scanning for risk, compressing time horizons, and inflating urgency signals.',
    mechanism:
      'Amygdala-driven salience network is overriding prefrontal evaluation. Cortisol elevation narrows the attentional window and biases processing toward worst-case scenarios.',
    effect:
      'Decision speed increases but accuracy degrades. Your system is likely to overweight immediate threats, discount long-term value, and commit prematurely to loss-avoidance strategies.',
    observer_note:
      'Decisions made under anxious vigilance tend to trade optionality for the illusion of control. Logging this state creates a useful reference point for post-outcome review.',
    halo_color: 'hsl(0, 85%, 60%)',
  },
  {
    id: 'focused-tension',
    name: 'Focused Tension',
    recognition:
      'Your system is operating at high engagement with narrowed attentional bandwidth — productive output is elevated, but cognitive flexibility is reduced.',
    mechanism:
      'Norepinephrine-driven arousal is concentrating executive resources on a single task frame. Peripheral processing is suppressed in favor of depth over breadth.',
    effect:
      'Task completion velocity increases. However, your system is brittle — interruption tolerance drops, and adjacent signals (new data, dissenting input) are more likely to be filtered out.',
    observer_note:
      'Focused tension produces strong output on known problems. It performs poorly when the problem itself needs reframing. Note whether the current decision requires convergence or divergence.',
    halo_color: 'hsl(35, 90%, 55%)',
  },
  {
    id: 'calm-readiness',
    name: 'Calm Readiness',
    recognition:
      'Your system is regulated, with a wide attentional field and balanced autonomic tone — the configuration most favorable for complex decision-making.',
    mechanism:
      'Parasympathetic dominance maintains low cortisol, enabling full prefrontal engagement. Default mode and executive networks are cycling fluidly, supporting both analytical and integrative processing.',
    effect:
      'Decision quality is at baseline or above. Your system can hold ambiguity, evaluate trade-offs across longer time horizons, and integrate novel information without defensive filtering.',
    observer_note:
      'This is the optimal window for high-stakes or irreversible decisions. If a major commitment can be deferred to this state, the expected outcome improves.',
    halo_color: 'hsl(160, 70%, 50%)',
  },
  {
    id: 'cognitive-depletion',
    name: 'Cognitive Depletion',
    recognition:
      'Your system is showing reduced executive function — decision quality is compromised by accumulated processing load and insufficient recovery.',
    mechanism:
      'Prefrontal glucose utilization is diminished after sustained cognitive demand. The system defaults to heuristic-based processing, reducing the cost of each decision but increasing error rate.',
    effect:
      'Your system is more susceptible to anchoring, status-quo bias, and satisficing. Novel alternatives are under-explored. Decisions feel adequate in the moment but often underperform on review.',
    observer_note:
      'Depleted systems reliably overestimate their own remaining capacity. The fact that a decision feels simple right now may itself be a depletion signal.',
    halo_color: 'hsl(220, 50%, 55%)',
  },
  {
    id: 'flat-disconnection',
    name: 'Flat Disconnection',
    recognition:
      'Your system is exhibiting emotional flatness and reduced motivational drive — processing is disengaged, and salience assignment is suppressed.',
    mechanism:
      'Dopaminergic reward signaling is attenuated. The system is not generating sufficient motivational charge to differentiate between high-value and low-value options.',
    effect:
      'Your system will tend toward inaction, deferred decisions, and passive agreement. Risk assessment becomes unreliable because neither upside nor downside registers with appropriate weight.',
    observer_note:
      'Flat disconnection is frequently misread as calm. The distinguishing feature: calm readiness holds active engagement with options; flat disconnection does not. Check for the difference.',
    halo_color: 'hsl(240, 20%, 60%)',
  },
  {
    id: 'reactive-activation',
    name: 'Reactive Activation',
    recognition:
      'Your system is operating in impulse-driven mode — the limbic system has overridden executive control, and fight-or-flight processing is active.',
    mechanism:
      'Amygdala hijack has rerouted processing away from prefrontal cortex. Adrenaline surge compresses deliberation time and amplifies the first available action impulse.',
    effect:
      'Your system will strongly favor immediate, decisive action regardless of whether action is warranted. Sunk-cost escalation, retaliatory responses, and premature commitment are the primary risks.',
    observer_note:
      'Reactive activation has the shortest useful decision window of any state. The neurochemical cycle resolves in approximately 90 seconds if no new trigger is introduced. Delay is the primary tool.',
    halo_color: 'hsl(340, 85%, 55%)',
  },
];

// ── 2. REFLECTION_TEMPLATES ──────────────────────────────────────────────────
// 36 total: 6 states × 2 types × 3 variations

export const REFLECTION_TEMPLATES: ReflectionTemplate[] = [
  // ─── Anxious Vigilance ─────────────────────────────────────────────────────
  // post_outcome
  {
    id: 'av-po-1',
    state_id: 'anxious-vigilance',
    type: 'post_outcome',
    variation: 1,
    template:
      'Your system was in anxious vigilance when this decision was made. It went {outcome}. Looking back, which inputs were genuine threat signals and which were urgency artifacts?',
  },
  {
    id: 'av-po-2',
    state_id: 'anxious-vigilance',
    type: 'post_outcome',
    variation: 2,
    template:
      'Your system was in anxious vigilance when this decision was made. It went {outcome}. Did the compressed time horizon match the actual deadline, or did your system manufacture urgency?',
  },
  {
    id: 'av-po-3',
    state_id: 'anxious-vigilance',
    type: 'post_outcome',
    variation: 3,
    template:
      'Your system was in anxious vigilance when this decision was made. It went {outcome}. What options were discarded under threat-detection that might have been worth evaluating?',
  },
  // post_pattern
  {
    id: 'av-pp-1',
    state_id: 'anxious-vigilance',
    type: 'post_pattern',
    variation: 1,
    template:
      'We noticed {pattern}. This decision went {outcome}. Is there a recurring trigger that activates threat-detection before your system has processed the full data set?',
  },
  {
    id: 'av-pp-2',
    state_id: 'anxious-vigilance',
    type: 'post_pattern',
    variation: 2,
    template:
      'We noticed {pattern}. This decision went {outcome}. When your system enters vigilance mode repeatedly in this context, what is it protecting against?',
  },
  {
    id: 'av-pp-3',
    state_id: 'anxious-vigilance',
    type: 'post_pattern',
    variation: 3,
    template:
      'We noticed {pattern}. This decision went {outcome}. Does the urgency inflation serve the decision, or does it serve the need to resolve discomfort faster?',
  },

  // ─── Focused Tension ───────────────────────────────────────────────────────
  // post_outcome
  {
    id: 'ft-po-1',
    state_id: 'focused-tension',
    type: 'post_outcome',
    variation: 1,
    template:
      'Your system was in focused tension when this decision was made. It went {outcome}. Was the narrowed attention appropriate for the problem, or did it filter out relevant peripheral data?',
  },
  {
    id: 'ft-po-2',
    state_id: 'focused-tension',
    type: 'post_outcome',
    variation: 2,
    template:
      'Your system was in focused tension when this decision was made. It went {outcome}. Did the high engagement produce genuine insight, or did it produce conviction without sufficient exploration?',
  },
  {
    id: 'ft-po-3',
    state_id: 'focused-tension',
    type: 'post_outcome',
    variation: 3,
    template:
      'Your system was in focused tension when this decision was made. It went {outcome}. What dissenting signals or alternative framings were suppressed by the depth-over-breadth configuration?',
  },
  // post_pattern
  {
    id: 'ft-pp-1',
    state_id: 'focused-tension',
    type: 'post_pattern',
    variation: 1,
    template:
      'We noticed {pattern}. This decision went {outcome}. When your system locks into focused tension on a recurring basis, is the problem type consistently one that rewards convergence?',
  },
  {
    id: 'ft-pp-2',
    state_id: 'focused-tension',
    type: 'post_pattern',
    variation: 2,
    template:
      'We noticed {pattern}. This decision went {outcome}. Does the brittleness of this state create downstream breakage when the plan meets unexpected resistance?',
  },
  {
    id: 'ft-pp-3',
    state_id: 'focused-tension',
    type: 'post_pattern',
    variation: 3,
    template:
      'We noticed {pattern}. This decision went {outcome}. Is the high-engagement signal coming from genuine problem importance, or from your system avoiding a less comfortable task?',
  },

  // ─── Calm Readiness ────────────────────────────────────────────────────────
  // post_outcome
  {
    id: 'cr-po-1',
    state_id: 'calm-readiness',
    type: 'post_outcome',
    variation: 1,
    template:
      'Your system was in calm readiness when this decision was made. It went {outcome}. Did the regulated state give your system access to information it typically filters under activation?',
  },
  {
    id: 'cr-po-2',
    state_id: 'calm-readiness',
    type: 'post_outcome',
    variation: 2,
    template:
      'Your system was in calm readiness when this decision was made. It went {outcome}. Was the wide attentional field a net advantage here, or did it introduce analysis paralysis?',
  },
  {
    id: 'cr-po-3',
    state_id: 'calm-readiness',
    type: 'post_outcome',
    variation: 3,
    template:
      'Your system was in calm readiness when this decision was made. It went {outcome}. What does this outcome suggest about the correlation between your system\'s regulatory state and decision quality in this domain?',
  },
  // post_pattern
  {
    id: 'cr-pp-1',
    state_id: 'calm-readiness',
    type: 'post_pattern',
    variation: 1,
    template:
      'We noticed {pattern}. This decision went {outcome}. Is there a structural factor enabling your system to reach calm readiness in this context that could be replicated elsewhere?',
  },
  {
    id: 'cr-pp-2',
    state_id: 'calm-readiness',
    type: 'post_pattern',
    variation: 2,
    template:
      'We noticed {pattern}. This decision went {outcome}. Does this pattern suggest that your system operates best in this domain when given sufficient processing time before commitment?',
  },
  {
    id: 'cr-pp-3',
    state_id: 'calm-readiness',
    type: 'post_pattern',
    variation: 3,
    template:
      'We noticed {pattern}. This decision went {outcome}. When your system is regulated, it tends to produce different option sets. What options appeared here that would not surface under activation?',
  },

  // ─── Cognitive Depletion ───────────────────────────────────────────────────
  // post_outcome
  {
    id: 'cd-po-1',
    state_id: 'cognitive-depletion',
    type: 'post_outcome',
    variation: 1,
    template:
      'Your system was in cognitive depletion when this decision was made. It went {outcome}. Did the heuristic-mode processing produce an adequate result, or did it miss complexity that mattered?',
  },
  {
    id: 'cd-po-2',
    state_id: 'cognitive-depletion',
    type: 'post_outcome',
    variation: 2,
    template:
      'Your system was in cognitive depletion when this decision was made. It went {outcome}. Was this a decision that could have been deferred to a higher-capacity window without meaningful cost?',
  },
  {
    id: 'cd-po-3',
    state_id: 'cognitive-depletion',
    type: 'post_outcome',
    variation: 3,
    template:
      'Your system was in cognitive depletion when this decision was made. It went {outcome}. What signals indicated reduced executive function at the time, and were they recognized or overridden?',
  },
  // post_pattern
  {
    id: 'cd-pp-1',
    state_id: 'cognitive-depletion',
    type: 'post_pattern',
    variation: 1,
    template:
      'We noticed {pattern}. This decision went {outcome}. Is there a recurring scheduling pattern that places high-stakes decisions in low-capacity time windows?',
  },
  {
    id: 'cd-pp-2',
    state_id: 'cognitive-depletion',
    type: 'post_pattern',
    variation: 2,
    template:
      'We noticed {pattern}. This decision went {outcome}. When your system defaults to satisficing under depletion, are the resulting commitments consistently revisited later at higher cost?',
  },
  {
    id: 'cd-pp-3',
    state_id: 'cognitive-depletion',
    type: 'post_pattern',
    variation: 3,
    template:
      'We noticed {pattern}. This decision went {outcome}. Does the depletion itself carry information — is it a signal that preceding tasks consumed more executive resource than budgeted?',
  },

  // ─── Flat Disconnection ────────────────────────────────────────────────────
  // post_outcome
  {
    id: 'fd-po-1',
    state_id: 'flat-disconnection',
    type: 'post_outcome',
    variation: 1,
    template:
      'Your system was in flat disconnection when this decision was made. It went {outcome}. Did the reduced motivational drive cause under-evaluation of upside, downside, or both?',
  },
  {
    id: 'fd-po-2',
    state_id: 'flat-disconnection',
    type: 'post_outcome',
    variation: 2,
    template:
      'Your system was in flat disconnection when this decision was made. It went {outcome}. Was the decision a genuine neutral assessment, or did disengagement masquerade as objectivity?',
  },
  {
    id: 'fd-po-3',
    state_id: 'flat-disconnection',
    type: 'post_outcome',
    variation: 3,
    template:
      'Your system was in flat disconnection when this decision was made. It went {outcome}. If motivational signaling had been at baseline, would the same option have been selected?',
  },
  // post_pattern
  {
    id: 'fd-pp-1',
    state_id: 'flat-disconnection',
    type: 'post_pattern',
    variation: 1,
    template:
      'We noticed {pattern}. This decision went {outcome}. When your system enters flat disconnection in this context repeatedly, is there an unresolved aversion driving the disengagement?',
  },
  {
    id: 'fd-pp-2',
    state_id: 'flat-disconnection',
    type: 'post_pattern',
    variation: 2,
    template:
      'We noticed {pattern}. This decision went {outcome}. Does the passive-agreement tendency in this state correlate with outcomes that require active correction later?',
  },
  {
    id: 'fd-pp-3',
    state_id: 'flat-disconnection',
    type: 'post_pattern',
    variation: 3,
    template:
      'We noticed {pattern}. This decision went {outcome}. Is the disconnection a protective response to sustained overload, or a signal that this decision domain has lost salience for your system?',
  },

  // ─── Reactive Activation ───────────────────────────────────────────────────
  // post_outcome
  {
    id: 'ra-po-1',
    state_id: 'reactive-activation',
    type: 'post_outcome',
    variation: 1,
    template:
      'Your system was in reactive activation when this decision was made. It went {outcome}. Was the speed of commitment warranted by the situation, or did the neurochemical surge compress deliberation unnecessarily?',
  },
  {
    id: 'ra-po-2',
    state_id: 'reactive-activation',
    type: 'post_outcome',
    variation: 2,
    template:
      'Your system was in reactive activation when this decision was made. It went {outcome}. Which aspect of the trigger — the content, the source, or the timing — produced the strongest activation?',
  },
  {
    id: 'ra-po-3',
    state_id: 'reactive-activation',
    type: 'post_outcome',
    variation: 3,
    template:
      'Your system was in reactive activation when this decision was made. It went {outcome}. If a 90-second delay had been introduced before commitment, what alternative actions become visible?',
  },
  // post_pattern
  {
    id: 'ra-pp-1',
    state_id: 'reactive-activation',
    type: 'post_pattern',
    variation: 1,
    template:
      'We noticed {pattern}. This decision went {outcome}. Is there a specific trigger category — interpersonal, financial, competitive — that reliably produces reactive activation in your system?',
  },
  {
    id: 'ra-pp-2',
    state_id: 'reactive-activation',
    type: 'post_pattern',
    variation: 2,
    template:
      'We noticed {pattern}. This decision went {outcome}. When your system enters fight-or-flight repeatedly around this type of decision, what is it interpreting as a survival-level threat?',
  },
  {
    id: 'ra-pp-3',
    state_id: 'reactive-activation',
    type: 'post_pattern',
    variation: 3,
    template:
      'We noticed {pattern}. This decision went {outcome}. Does the impulse-driven response in this context consistently produce escalation, and is there a decision architecture that could interrupt the loop?',
  },
];

// ── 3. STATE_TECHNIQUE_MAP ───────────────────────────────────────────────────

export const STATE_TECHNIQUE_MAP: Record<CognitiveStateId, TechniqueId | null> = {
  'anxious-vigilance': 'breathing-4-6',
  'focused-tension': 'extended-exhale',
  'calm-readiness': null,
  'cognitive-depletion': 'name-5-sensations',
  'flat-disconnection': 'name-5-sensations',
  'reactive-activation': '90-second-pause',
};

// ── 4. CLOSURE_STATEMENTS ────────────────────────────────────────────────────

export const CLOSURE_STATEMENTS: string[] = [
  'You created space between activation and action.',
  'The observation is the intervention.',
  'Your system state was logged. The data compounds over time.',
  'One decision recorded. Pattern resolution improves with each entry.',
  'State recognized, decision captured. The instrument is calibrating.',
  'Observation complete. Your system now has a reference point it did not have before.',
  'Signal distinguished from noise. That distinction is the product.',
];

// ── 5. SUB_PROMPTS ───────────────────────────────────────────────────────────

export const SUB_PROMPTS: string[] = [
  'What was your system optimizing for in that moment — and is that what needed to be optimized?',
  'If you were to re-enter this decision at a different activation level, what changes?',
  'What data did your system weight most heavily, and does that weighting hold under review?',
];

// ── Utility: lookup helpers ──────────────────────────────────────────────────

export function getStateTemplate(id: CognitiveStateId): StateTemplate | undefined {
  return STATE_TEMPLATES.find((s) => s.id === id);
}

export function getReflections(
  stateId: CognitiveStateId,
  type: ReflectionType
): ReflectionTemplate[] {
  return REFLECTION_TEMPLATES.filter((r) => r.state_id === stateId && r.type === type);
}

export function getRandomReflection(
  stateId: CognitiveStateId,
  type: ReflectionType
): ReflectionTemplate | undefined {
  const pool = getReflections(stateId, type);
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomClosure(): string {
  return CLOSURE_STATEMENTS[Math.floor(Math.random() * CLOSURE_STATEMENTS.length)];
}

export function getRecommendedTechnique(stateId: CognitiveStateId): TechniqueId | null {
  return STATE_TECHNIQUE_MAP[stateId];
}
