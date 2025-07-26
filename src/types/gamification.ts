export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'consistency' | 'progress' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'completion' | 'score' | 'time' | 'special';
  criteria: {
    metric: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal';
    value: number;
    timeframe?: 'day' | 'week' | 'month' | 'all_time';
  };
  reward: {
    type: 'badge' | 'points' | 'title' | 'feature_unlock';
    value: string | number;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface UserLevel {
  level: number;
  title: string;
  description: string;
  experienceRequired: number;
  benefits: string[];
  color: string;
}

export interface ProgressStreak {
  type: 'daily_checkin' | 'journal_entry' | 'education' | 'pain_tracking' | 'overall';
  current: number;
  longest: number;
  lastActivity?: Date;
}

export interface UserStats {
  totalExperience: number;
  currentLevel: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: Record<string, ProgressStreak>;
  activityHistory: ActivityEntry[];
  weeklyGoals: WeeklyGoal[];
  milestones: Milestone[];
}

export interface ActivityEntry {
  id: string;
  type: 'journal' | 'education' | 'pain_tracker' | 'assessment' | 'milestone';
  timestamp: Date;
  experienceGained: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface WeeklyGoal {
  id: string;
  week: string; // YYYY-WW format
  goals: {
    journalEntries: { target: number; current: number };
    educationModules: { target: number; current: number };
    painTracking: { target: number; current: number };
    overallEngagement: { target: number; current: number };
  };
  isCompleted: boolean;
  completedAt?: Date;
  reward?: {
    experience: number;
    badge?: string;
  };
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  category: 'recovery' | 'learning' | 'engagement' | 'time';
  criteria: {
    type: 'pain_reduction' | 'education_completion' | 'streak_achievement' | 'time_milestone';
    value: number;
    unit: string;
  };
  isAchieved: boolean;
  achievedAt?: Date;
  reward: {
    experience: number;
    badge?: string;
    title?: string;
  };
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  experience: number;
  badges: number;
  streaks: Record<string, number>;
  joinedAt: Date;
}

// Gamification Events
export type GamificationEvent = 
  | { type: 'JOURNAL_ENTRY_CREATED'; payload: { entryId: string; wordCount: number } }
  | { type: 'EDUCATION_MODULE_COMPLETED'; payload: { moduleId: string; score: number; timeSpent: number } }
  | { type: 'PAIN_LEVEL_LOGGED'; payload: { level: number; improvement: boolean } }
  | { type: 'STREAK_MILESTONE'; payload: { streakType: string; count: number } }
  | { type: 'WEEKLY_GOAL_COMPLETED'; payload: { weekId: string; category: string } }
  | { type: 'ASSESSMENT_COMPLETED'; payload: { assessmentType: string; score: number } }
  | { type: 'MILESTONE_ACHIEVED'; payload: { milestoneId: string; category: string } };

export interface GamificationConfig {
  experienceRates: {
    journalEntry: number;
    educationModule: number;
    painTracking: number;
    streakBonus: number;
    milestoneBonus: number;
  };
  levelThresholds: number[];
  streakMultipliers: {
    [key: number]: number; // streak length -> multiplier
  };
  badgeUnlockCriteria: Record<string, (stats: UserStats) => boolean>;
}
