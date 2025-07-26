'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, UserProfile, TreatmentProgress } from '@/types';

// Initial state
const initialState: AppState = {
  user: null,
  treatmentProgress: null,
  currentPhase: 'assessment',
  isLoading: false,
  error: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        error: null,
      };

    case 'SET_TREATMENT_PROGRESS':
      return {
        ...state,
        treatmentProgress: action.payload,
        error: null,
      };

    case 'ADD_SESSION':
      return {
        ...state,
        treatmentProgress: state.treatmentProgress
          ? {
              ...state.treatmentProgress,
              sessions: [...state.treatmentProgress.sessions, action.payload],
            }
          : null,
        error: null,
      };

    case 'ADD_JOURNAL_ENTRY':
      return {
        ...state,
        treatmentProgress: state.treatmentProgress
          ? {
              ...state.treatmentProgress,
              journalEntries: [...state.treatmentProgress.journalEntries, action.payload],
            }
          : null,
        error: null,
      };

    case 'ADD_MILESTONE':
      return {
        ...state,
        treatmentProgress: state.treatmentProgress
          ? {
              ...state.treatmentProgress,
              milestones: [...state.treatmentProgress.milestones, action.payload],
            }
          : null,
        error: null,
      };

    case 'UPDATE_READING_PROGRESS':
      return {
        ...state,
        treatmentProgress: state.treatmentProgress
          ? {
              ...state.treatmentProgress,
              readingProgress: {
                ...state.treatmentProgress.readingProgress,
                ...action.payload,
              },
            }
          : null,
        error: null,
      };

    case 'SET_PHASE':
      return {
        ...state,
        currentPhase: action.payload,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_DATA':
      return initialState;

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper hooks for specific actions
export function useAppActions() {
  const { dispatch } = useApp();

  return {
    setUser: (user: UserProfile) => dispatch({ type: 'SET_USER', payload: user }),
    updateUser: (updates: Partial<UserProfile>) => dispatch({ type: 'UPDATE_USER', payload: updates }),
    setTreatmentProgress: (progress: TreatmentProgress) => dispatch({ type: 'SET_TREATMENT_PROGRESS', payload: progress }),
    addSession: (session: TreatmentProgress['sessions'][0]) => dispatch({ type: 'ADD_SESSION', payload: session }),
    addJournalEntry: (entry: TreatmentProgress['journalEntries'][0]) => dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry }),
    addMilestone: (milestone: TreatmentProgress['milestones'][0]) => dispatch({ type: 'ADD_MILESTONE', payload: milestone }),
    updateReadingProgress: (progress: Partial<TreatmentProgress['readingProgress']>) => dispatch({ type: 'UPDATE_READING_PROGRESS', payload: progress }),
    setPhase: (phase: AppState['currentPhase']) => dispatch({ type: 'SET_PHASE', payload: phase }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearData: () => dispatch({ type: 'CLEAR_DATA' }),
  };
}
