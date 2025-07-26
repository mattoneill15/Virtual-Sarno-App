// Core data types for Virtual Dr. Sarno TMS Application

export interface UserProfile {
  id: string;
  createdAt: Date;
  lastActive: Date;
  personalInfo: {
    name: string;
    age: number;
    occupation: string;
    lifestyle: 'sedentary' | 'active' | 'very active';
  };
  psychologicalProfile: {
    personalityType: string[]; // perfectionist, people-pleaser, highly responsible, etc.
    stressFactors: string[]; // work, relationships, finances, health anxiety, etc.
    copingMechanisms: string[]; // exercise, alcohol, workaholism, etc.
    traumaHistory: boolean;
    currentLifeStressors: string[];
  };
  painHistory: {
    primarySymptoms: string[];
    painLocations: string[];
    painIntensity: number; // 1-10 scale
    painFrequency: 'constant' | 'intermittent' | 'episodic';
    onsetDate: Date;
    triggers: string[]; // physical activity, stress, weather, etc.
    previousDiagnoses: string[];
    previousTreatments: string[];
    medicalHistory: string[];
  };
  tmsAssessment: {
    tmsLikelihood: number; // 0-100%
    sarnoCompatibility: number; // how well they fit TMS profile
    redFlags: string[]; // serious medical conditions to rule out
    assessmentDate: Date;
  };
}

export interface TreatmentSession {
  date: Date;
  painLevel: number; // 1-10
  emotionalState: string;
  insights: string;
  activities: string[];
  breakthroughs: string;
}

export interface Milestone {
  date: Date;
  type: string; // first pain-free day, emotional breakthrough, etc.
  description: string;
}

export interface JournalEntry {
  date: Date;
  prompt: string;
  response: string;
  emotionalTags: string[];
}

export interface ReadingProgress {
  completedSections: string[];
  currentSection: string;
  comprehensionScores: Record<string, number>;
}

export interface TreatmentProgress {
  userId: string;
  sessions: TreatmentSession[];
  milestones: Milestone[];
  journalEntries: JournalEntry[];
  readingProgress: ReadingProgress;
}

// Application state types
export interface AppState {
  user: UserProfile | null;
  treatmentProgress: TreatmentProgress | null;
  currentPhase: 'assessment' | 'education' | 'treatment' | 'maintenance';
  isLoading: boolean;
  error: string | null;
}

// Action types for state management
export type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'UPDATE_USER'; payload: Partial<UserProfile> }
  | { type: 'SET_TREATMENT_PROGRESS'; payload: TreatmentProgress }
  | { type: 'ADD_SESSION'; payload: TreatmentSession }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'ADD_MILESTONE'; payload: Milestone }
  | { type: 'UPDATE_READING_PROGRESS'; payload: Partial<ReadingProgress> }
  | { type: 'SET_PHASE'; payload: AppState['currentPhase'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_DATA' };

// Constants for TMS assessment
export const PERSONALITY_TYPES = [
  'perfectionist',
  'people-pleaser',
  'highly responsible',
  'goodist',
  'self-critical',
  'achievement-oriented'
] as const;

export const STRESS_FACTORS = [
  'work pressure',
  'relationship issues',
  'financial stress',
  'health anxiety',
  'family responsibilities',
  'perfectionism',
  'time pressure',
  'social expectations'
] as const;

export const PAIN_LOCATIONS = [
  'lower back',
  'upper back',
  'neck',
  'shoulders',
  'hips',
  'knees',
  'headaches',
  'jaw (TMJ)',
  'arms',
  'legs',
  'chest',
  'abdomen'
] as const;

export const COMMON_SYMPTOMS = [
  'chronic pain',
  'muscle tension',
  'headaches',
  'fatigue',
  'insomnia',
  'digestive issues',
  'anxiety',
  'depression',
  'irritability',
  'brain fog'
] as const;
