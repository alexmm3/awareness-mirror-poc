import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Classification result from the Edge Function
export interface ClassificationResult {
  session_id: string;
  detected_state: string;
  activation_level: number;
  confidence_score: number;
  recognition_sentence: string;
  alternative_states: { state: string; description: string }[];
}

// In-flight session data (lives during a single session flow)
export interface ActiveSession {
  id: string | null; // DB session ID (set after classification)
  type: 'state_capture' | 'decision_capture' | 'high_pressure_signal';
  rawText: string;
  contextTags: string[];
  classification: ClassificationResult | null;
  userCorrectedState: string | null;
  techniqueUsed: string | null;
  recheckClarity: 'clearer' | 'same' | 'cloudier' | null;
  decisionId: string | null; // If a decision was logged in this session
  sessionStartedAt: string;
}

type AppState = {
  activeSession: ActiveSession | null;
};

type AppAction =
  | { type: 'START_SESSION'; payload: { type: ActiveSession['type']; rawText?: string; contextTags?: string[] } }
  | { type: 'SET_CLASSIFICATION'; payload: ClassificationResult }
  | { type: 'SET_CORRECTED_STATE'; payload: string }
  | { type: 'SET_TECHNIQUE'; payload: string }
  | { type: 'SET_RECHECK'; payload: 'clearer' | 'same' | 'cloudier' }
  | { type: 'SET_DECISION_ID'; payload: string }
  | { type: 'CLEAR_SESSION' };

const initialState: AppState = {
  activeSession: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        activeSession: {
          id: null,
          type: action.payload.type,
          rawText: action.payload.rawText || '',
          contextTags: action.payload.contextTags || [],
          classification: null,
          userCorrectedState: null,
          techniqueUsed: null,
          recheckClarity: null,
          decisionId: null,
          sessionStartedAt: new Date().toISOString(),
        },
      };
    case 'SET_CLASSIFICATION':
      return {
        ...state,
        activeSession: state.activeSession
          ? { ...state.activeSession, id: action.payload.session_id, classification: action.payload }
          : null,
      };
    case 'SET_CORRECTED_STATE':
      return {
        ...state,
        activeSession: state.activeSession
          ? { ...state.activeSession, userCorrectedState: action.payload }
          : null,
      };
    case 'SET_TECHNIQUE':
      return {
        ...state,
        activeSession: state.activeSession
          ? { ...state.activeSession, techniqueUsed: action.payload }
          : null,
      };
    case 'SET_RECHECK':
      return {
        ...state,
        activeSession: state.activeSession
          ? { ...state.activeSession, recheckClarity: action.payload }
          : null,
      };
    case 'SET_DECISION_ID':
      return {
        ...state,
        activeSession: state.activeSession
          ? { ...state.activeSession, decisionId: action.payload }
          : null,
      };
    case 'CLEAR_SESSION':
      return { ...state, activeSession: null };
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
