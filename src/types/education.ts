// Educational content types for TMS learning modules

export interface EducationalModule {
  id: string;
  title: string;
  category: 'fundamentals' | 'personality' | 'emotional' | 'recovery';
  description: string;
  estimatedReadTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisiteModules?: string[];
  content: ModuleContent;
  quiz?: Quiz;
  isCompleted?: boolean;
  completedAt?: Date;
  comprehensionScore?: number;
}

export interface ModuleContent {
  sections: ContentSection[];
  keyTakeaways: string[];
  practicalExercises?: Exercise[];
  reflectionQuestions?: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'quote' | 'example' | 'warning' | 'tip';
  imageUrl?: string;
  videoUrl?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  type: 'reflection' | 'breathing' | 'visualization' | 'journaling' | 'physical';
  estimatedTime: number; // in minutes
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[]; // for multiple choice
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface UserProgress {
  moduleId: string;
  startedAt: Date;
  completedAt?: Date;
  currentSection: number;
  timeSpent: number; // in minutes
  quizAttempts: QuizAttempt[];
  exercisesCompleted: string[];
  notes: string;
}

export interface QuizAttempt {
  attemptNumber: number;
  score: number;
  answers: Record<string, string | number>;
  completedAt: Date;
}

// Educational content categories
export const EDUCATION_CATEGORIES = {
  fundamentals: {
    name: 'TMS Fundamentals',
    description: 'Core concepts of Tension Myositis Syndrome',
    color: 'blue'
  },
  personality: {
    name: 'Personality & TMS',
    description: 'Understanding personality traits that predispose to TMS',
    color: 'purple'
  },
  emotional: {
    name: 'Emotional Exploration',
    description: 'Identifying and processing repressed emotions',
    color: 'green'
  },
  recovery: {
    name: 'Recovery Process',
    description: 'Practical steps for healing and prevention',
    color: 'orange'
  }
} as const;

// Learning path recommendations
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
  estimatedDuration: number; // in days
  targetAudience: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'beginner-path',
    name: 'TMS Beginner Journey',
    description: 'Perfect for those new to TMS concepts',
    moduleIds: ['tms-intro', 'mind-body-connection', 'personality-basics', 'getting-started'],
    estimatedDuration: 7,
    targetAudience: 'New to TMS'
  },
  {
    id: 'deep-dive-path',
    name: 'Comprehensive Understanding',
    description: 'In-depth exploration of all TMS concepts',
    moduleIds: ['tms-intro', 'mind-body-connection', 'personality-deep', 'emotional-patterns', 'recovery-advanced'],
    estimatedDuration: 14,
    targetAudience: 'Committed learners'
  },
  {
    id: 'quick-start-path',
    name: 'Quick Start Guide',
    description: 'Essential concepts for immediate application',
    moduleIds: ['tms-intro', 'quick-relief', 'daily-practices'],
    estimatedDuration: 3,
    targetAudience: 'Need immediate help'
  }
];

// Achievement system for education
export interface EducationalAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirements: {
    modulesCompleted?: number;
    quizScoreAverage?: number;
    streakDays?: number;
    specificModules?: string[];
  };
  unlockedAt?: Date;
}

export const EDUCATIONAL_ACHIEVEMENTS: EducationalAchievement[] = [
  {
    id: 'first-module',
    title: 'Knowledge Seeker',
    description: 'Complete your first educational module',
    icon: '📚',
    requirements: { modulesCompleted: 1 }
  },
  {
    id: 'fundamentals-master',
    title: 'TMS Fundamentals Master',
    description: 'Complete all fundamental modules with 80%+ quiz scores',
    icon: '🎓',
    requirements: { 
      specificModules: ['tms-intro', 'mind-body-connection', 'sarno-method'],
      quizScoreAverage: 80
    }
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    requirements: { streakDays: 7 }
  },
  {
    id: 'scholar',
    title: 'TMS Scholar',
    description: 'Complete 10 educational modules',
    icon: '🏆',
    requirements: { modulesCompleted: 10 }
  }
];
