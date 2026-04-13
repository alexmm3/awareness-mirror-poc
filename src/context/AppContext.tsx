import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Mock data
export const MOCK_DATA = {
  user: { name: 'Sarah Chen', role: 'Founder', decisions: 'People & Strategy' },
  lastSession: '3h ago',
  currentState: 'ANXIOUS VIGILANCE',
  activationLevel: 4,
  observerStrength: 'RISING',
  cnrTrend: 'IMPROVING',
  dci: 'BUILDING...',
  lastDecision: 'Whether to hire Marcus, a senior engineer, at $180k — 30% above current band.',
  decisionOutcome: 'Harder than expected',
  detectedPattern: 'You tend to enter Anxious Vigilance before Investor Meetings.',
  patternDecisions: 2,
  completeLoops: 2,
  totalSessions: 12,
  stateFrequency: [
    { state: 'Anxious Vigilance', count: 8, color: 'var(--accent-amber)' },
    { state: 'Focused Tension', count: 6, color: 'var(--accent-blue)' },
    { state: 'Calm Readiness', count: 4, color: 'var(--accent-teal)' },
    { state: 'Cognitive Depletion', count: 3, color: 'var(--accent-soft-purple)' },
    { state: 'Flat Disconnection', count: 2, color: 'var(--text-secondary)' },
    { state: 'Reactive Activation', count: 1, color: 'var(--accent-red)' },
  ],
  cnrData: [-1, 0, 0, 1, 0, 1, 1, 1],
  recognition: 'Running the numbers repeatedly is your system searching for certainty in data when the real uncertainty is emotional.',
  mechanism: 'In Anxious Vigilance, the prefrontal cortex reduces its regulatory influence over the amygdala. Threat-detection becomes the dominant processing mode. The mind compresses time horizons and inflates urgency.',
  effect: 'From this state you tend to over-weight downside risk and under-weight opportunity. Options that require trust or delayed payoff feel more dangerous than they are. The analysis loop you are in is a symptom, not a solution.',
  observerNote: 'Notice whether the next decision you make is responsive to the real situation — or to the activated state your system is in.',
  reflectionPromptA: 'You were in Anxious Vigilance when you made this decision. It went harder than expected. What do you notice?',
  reflectionPromptB: 'We noticed you tend to enter Anxious Vigilance before Investor Meetings. This decision went harder than expected. What do you make of this?',
};

type AppState = {
  ctaState: 1 | 2 | 3 | 4;
};

type AppAction = 
  | { type: 'SET_CTA_STATE'; payload: 1 | 2 | 3 | 4 };

const initialState: AppState = {
  ctaState: 4,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CTA_STATE':
      return { ...state, ctaState: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
