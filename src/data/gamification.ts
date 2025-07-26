import { Badge, Achievement, UserLevel, GamificationConfig, UserStats } from '@/types/gamification';

export const BADGES: Badge[] = [
  // Learning Badges
  {
    id: 'first_module',
    name: 'Knowledge Seeker',
    description: 'Complete your first educational module',
    icon: '📚',
    category: 'learning',
    rarity: 'common'
  },
  {
    id: 'education_complete',
    name: 'TMS Scholar',
    description: 'Complete all educational modules',
    icon: '🎓',
    category: 'learning',
    rarity: 'epic'
  },
  {
    id: 'perfect_quiz',
    name: 'Quiz Master',
    description: 'Score 100% on any educational quiz',
    icon: '🏆',
    category: 'learning',
    rarity: 'uncommon'
  },
  {
    id: 'speed_learner',
    name: 'Speed Learner',
    description: 'Complete 3 modules in one day',
    icon: '⚡',
    category: 'learning',
    rarity: 'rare'
  },

  // Consistency Badges
  {
    id: 'first_journal',
    name: 'Journal Starter',
    description: 'Write your first journal entry',
    icon: '✍️',
    category: 'consistency',
    rarity: 'common'
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: '🔥',
    category: 'consistency',
    rarity: 'uncommon'
  },
  {
    id: 'month_streak',
    name: 'Consistency Champion',
    description: 'Maintain a 30-day activity streak',
    icon: '💪',
    category: 'consistency',
    rarity: 'rare'
  },
  {
    id: 'hundred_days',
    name: 'Centurion',
    description: 'Maintain a 100-day activity streak',
    icon: '👑',
    category: 'consistency',
    rarity: 'legendary'
  },

  // Progress Badges
  {
    id: 'pain_tracker',
    name: 'Pain Tracker',
    description: 'Log your pain levels for 7 consecutive days',
    icon: '📊',
    category: 'progress',
    rarity: 'common'
  },
  {
    id: 'improvement_noted',
    name: 'Progress Pioneer',
    description: 'Record your first pain level improvement',
    icon: '📈',
    category: 'progress',
    rarity: 'uncommon'
  },
  {
    id: 'significant_improvement',
    name: 'Healing Hero',
    description: 'Achieve a 50% reduction in average pain levels',
    icon: '🌟',
    category: 'progress',
    rarity: 'epic'
  },

  // Milestone Badges
  {
    id: 'assessment_complete',
    name: 'Self-Aware',
    description: 'Complete the initial TMS assessment',
    icon: '🧠',
    category: 'milestone',
    rarity: 'common'
  },
  {
    id: 'month_journey',
    name: 'Monthly Milestone',
    description: 'Complete one month of TMS recovery work',
    icon: '📅',
    category: 'milestone',
    rarity: 'uncommon'
  },
  {
    id: 'recovery_graduate',
    name: 'Recovery Graduate',
    description: 'Complete the full TMS recovery program',
    icon: '🎖️',
    category: 'milestone',
    rarity: 'legendary'
  },

  // Special Badges
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join the Virtual Sarno community',
    icon: '🚀',
    category: 'special',
    rarity: 'rare'
  },
  {
    id: 'breakthrough',
    name: 'Breakthrough Moment',
    description: 'Record a significant emotional breakthrough',
    icon: '💡',
    category: 'special',
    rarity: 'epic'
  },
  {
    id: 'helper',
    name: 'Community Helper',
    description: 'Help another user in their recovery journey',
    icon: '🤝',
    category: 'special',
    rarity: 'rare'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'journal_streak_7',
    name: 'Weekly Journalist',
    description: 'Write journal entries for 7 consecutive days',
    type: 'streak',
    criteria: {
      metric: 'journal_streak',
      operator: 'greater_equal',
      value: 7
    },
    reward: {
      type: 'badge',
      value: 'week_streak'
    },
    isUnlocked: false
  },
  {
    id: 'education_master',
    name: 'Education Master',
    description: 'Complete all educational modules with 90%+ average score',
    type: 'completion',
    criteria: {
      metric: 'education_average_score',
      operator: 'greater_equal',
      value: 90
    },
    reward: {
      type: 'badge',
      value: 'education_complete'
    },
    isUnlocked: false
  },
  {
    id: 'pain_improvement',
    name: 'Pain Reducer',
    description: 'Achieve 25% reduction in average pain levels over 2 weeks',
    type: 'score',
    criteria: {
      metric: 'pain_reduction_percentage',
      operator: 'greater_equal',
      value: 25,
      timeframe: 'week'
    },
    reward: {
      type: 'badge',
      value: 'improvement_noted'
    },
    isUnlocked: false
  },
  {
    id: 'speed_completion',
    name: 'Quick Learner',
    description: 'Complete 3 educational modules in under 2 hours total',
    type: 'time',
    criteria: {
      metric: 'modules_completion_time',
      operator: 'less_than',
      value: 120 // minutes
    },
    reward: {
      type: 'badge',
      value: 'speed_learner'
    },
    isUnlocked: false
  }
];

export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    title: 'TMS Newcomer',
    description: 'Just beginning your TMS recovery journey',
    experienceRequired: 0,
    benefits: ['Access to basic features', 'Initial assessment'],
    color: '#94a3b8'
  },
  {
    level: 2,
    title: 'Pain Explorer',
    description: 'Learning about the mind-body connection',
    experienceRequired: 100,
    benefits: ['Pain tracking tools', 'Basic educational content'],
    color: '#60a5fa'
  },
  {
    level: 3,
    title: 'Mindful Student',
    description: 'Actively engaging with TMS concepts',
    experienceRequired: 300,
    benefits: ['Advanced journaling prompts', 'Progress analytics'],
    color: '#34d399'
  },
  {
    level: 4,
    title: 'Recovery Practitioner',
    description: 'Consistently applying TMS principles',
    experienceRequired: 600,
    benefits: ['Personalized insights', 'Advanced tracking'],
    color: '#fbbf24'
  },
  {
    level: 5,
    title: 'Healing Advocate',
    description: 'Experienced in TMS recovery methods',
    experienceRequired: 1000,
    benefits: ['Community features', 'Mentor tools'],
    color: '#f472b6'
  },
  {
    level: 6,
    title: 'TMS Master',
    description: 'Expert practitioner of Dr. Sarno\'s methods',
    experienceRequired: 1500,
    benefits: ['All features unlocked', 'Master insights'],
    color: '#a855f7'
  },
  {
    level: 7,
    title: 'Recovery Guru',
    description: 'Achieved mastery in mind-body healing',
    experienceRequired: 2500,
    benefits: ['Guru status', 'Special recognition'],
    color: '#ef4444'
  }
];

export const GAMIFICATION_CONFIG: GamificationConfig = {
  experienceRates: {
    journalEntry: 10,
    educationModule: 50,
    painTracking: 5,
    streakBonus: 5,
    milestoneBonus: 100
  },
  levelThresholds: USER_LEVELS.map(level => level.experienceRequired),
  streakMultipliers: {
    7: 1.2,   // 20% bonus for week streak
    14: 1.4,  // 40% bonus for 2-week streak
    30: 1.6,  // 60% bonus for month streak
    60: 1.8,  // 80% bonus for 2-month streak
    100: 2.0  // 100% bonus for 100-day streak
  },
  badgeUnlockCriteria: {
    'first_module': (stats: UserStats) => 
      stats.activityHistory.some(activity => activity.type === 'education'),
    
    'education_complete': (stats: UserStats) => {
      const educationActivities = stats.activityHistory.filter(a => a.type === 'education');
      return educationActivities.length >= 5; // Assuming 5 total modules
    },
    
    'perfect_quiz': (stats: UserStats) => 
      stats.activityHistory.some(activity => 
        activity.type === 'education' && 
        activity.metadata?.score === 100
      ),
    
    'week_streak': (stats: UserStats) => 
      Object.values(stats.streaks).some(streak => streak.current >= 7),
    
    'month_streak': (stats: UserStats) => 
      Object.values(stats.streaks).some(streak => streak.current >= 30),
    
    'hundred_days': (stats: UserStats) => 
      Object.values(stats.streaks).some(streak => streak.current >= 100),
    
    'pain_tracker': (stats: UserStats) => {
      const painActivities = stats.activityHistory.filter(a => a.type === 'pain_tracker');
      return painActivities.length >= 7;
    },
    
    'improvement_noted': (stats: UserStats) => 
      stats.milestones.some(milestone => 
        milestone.category === 'recovery' && milestone.isAchieved
      ),
    
    'assessment_complete': (stats: UserStats) => 
      stats.activityHistory.some(activity => activity.type === 'assessment'),
    
    'first_journal': (stats: UserStats) => 
      stats.activityHistory.some(activity => activity.type === 'journal'),
    
    'early_adopter': (stats: UserStats) => true, // Awarded to all initial users
    
    'breakthrough': (stats: UserStats) => 
      stats.activityHistory.some(activity => 
        activity.type === 'journal' && 
        activity.metadata?.breakthrough === true
      )
  }
};

// Helper functions for gamification
export const calculateLevel = (experience: number): number => {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (experience >= USER_LEVELS[i].experienceRequired) {
      return USER_LEVELS[i].level;
    }
  }
  return 1;
};

export const getExperienceForNextLevel = (currentExperience: number): number => {
  const currentLevel = calculateLevel(currentExperience);
  const nextLevel = USER_LEVELS.find(level => level.level === currentLevel + 1);
  return nextLevel ? nextLevel.experienceRequired - currentExperience : 0;
};

export const calculateStreakMultiplier = (streakLength: number): number => {
  const thresholds = Object.keys(GAMIFICATION_CONFIG.streakMultipliers)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const threshold of thresholds) {
    if (streakLength >= threshold) {
      return GAMIFICATION_CONFIG.streakMultipliers[threshold];
    }
  }
  return 1.0;
};

export const checkBadgeUnlock = (badgeId: string, stats: UserStats): boolean => {
  const criteria = GAMIFICATION_CONFIG.badgeUnlockCriteria[badgeId];
  return criteria ? criteria(stats) : false;
};
