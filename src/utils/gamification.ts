import { 
  UserStats, 
  GamificationEvent, 
  Badge, 
  Achievement, 
  ActivityEntry, 
  ProgressStreak,
  WeeklyGoal,
  Milestone
} from '@/types/gamification';
import { 
  BADGES, 
  ACHIEVEMENTS, 
  GAMIFICATION_CONFIG, 
  calculateLevel, 
  getExperienceForNextLevel,
  calculateStreakMultiplier,
  checkBadgeUnlock
} from '@/data/gamification';

export class GamificationEngine {
  private stats: UserStats;

  constructor(initialStats?: Partial<UserStats>) {
    this.stats = {
      totalExperience: 0,
      currentLevel: 1,
      badges: [],
      achievements: [],
      streaks: {
        daily_checkin: { type: 'daily_checkin', current: 0, longest: 0 },
        journal_entry: { type: 'journal_entry', current: 0, longest: 0 },
        education: { type: 'education', current: 0, longest: 0 },
        pain_tracking: { type: 'pain_tracking', current: 0, longest: 0 },
        overall: { type: 'overall', current: 0, longest: 0 }
      },
      activityHistory: [],
      weeklyGoals: [],
      milestones: [],
      ...initialStats
    };
  }

  public getStats(): UserStats {
    return { ...this.stats };
  }

  public processEvent(event: GamificationEvent): {
    experienceGained: number;
    newBadges: Badge[];
    newAchievements: Achievement[];
    levelUp: boolean;
    newLevel?: number;
  } {
    const result = {
      experienceGained: 0,
      newBadges: [] as Badge[],
      newAchievements: [] as Achievement[],
      levelUp: false,
      newLevel: undefined as number | undefined
    };

    const previousLevel = this.stats.currentLevel;

    // Process the event and calculate experience
    switch (event.type) {
      case 'JOURNAL_ENTRY_CREATED':
        result.experienceGained = this.processJournalEntry(event.payload);
        break;
      case 'EDUCATION_MODULE_COMPLETED':
        result.experienceGained = this.processEducationModule(event.payload);
        break;
      case 'PAIN_LEVEL_LOGGED':
        result.experienceGained = this.processPainTracking(event.payload);
        break;
      case 'STREAK_MILESTONE':
        result.experienceGained = this.processStreakMilestone(event.payload);
        break;
      case 'WEEKLY_GOAL_COMPLETED':
        result.experienceGained = this.processWeeklyGoal(event.payload);
        break;
      case 'ASSESSMENT_COMPLETED':
        result.experienceGained = this.processAssessment(event.payload);
        break;
      case 'MILESTONE_ACHIEVED':
        result.experienceGained = this.processMilestone(event.payload);
        break;
    }

    // Update total experience and level
    this.stats.totalExperience += result.experienceGained;
    this.stats.currentLevel = calculateLevel(this.stats.totalExperience);
    
    if (this.stats.currentLevel > previousLevel) {
      result.levelUp = true;
      result.newLevel = this.stats.currentLevel;
    }

    // Check for new badge unlocks
    result.newBadges = this.checkNewBadges();
    
    // Check for new achievement unlocks
    result.newAchievements = this.checkNewAchievements();

    // Update streaks
    this.updateStreaks(event);

    return result;
  }

  private processJournalEntry(payload: { entryId: string; wordCount: number }): number {
    const baseExperience = GAMIFICATION_CONFIG.experienceRates.journalEntry;
    const wordBonus = Math.min(Math.floor(payload.wordCount / 100) * 5, 25); // Max 25 bonus for long entries
    const streakMultiplier = calculateStreakMultiplier(this.stats.streaks.journal_entry.current);
    
    const totalExperience = Math.round((baseExperience + wordBonus) * streakMultiplier);

    // Add to activity history
    this.stats.activityHistory.push({
      id: `journal_${payload.entryId}`,
      type: 'journal',
      timestamp: new Date(),
      experienceGained: totalExperience,
      description: `Wrote journal entry (${payload.wordCount} words)`,
      metadata: { wordCount: payload.wordCount }
    });

    return totalExperience;
  }

  private processEducationModule(payload: { moduleId: string; score: number; timeSpent: number }): number {
    const baseExperience = GAMIFICATION_CONFIG.experienceRates.educationModule;
    const scoreBonus = Math.round((payload.score / 100) * 20); // Up to 20 bonus for perfect score
    const speedBonus = payload.timeSpent < 15 ? 10 : 0; // Bonus for quick completion
    const streakMultiplier = calculateStreakMultiplier(this.stats.streaks.education.current);
    
    const totalExperience = Math.round((baseExperience + scoreBonus + speedBonus) * streakMultiplier);

    // Add to activity history
    this.stats.activityHistory.push({
      id: `education_${payload.moduleId}`,
      type: 'education',
      timestamp: new Date(),
      experienceGained: totalExperience,
      description: `Completed education module (${payload.score}% score)`,
      metadata: { 
        moduleId: payload.moduleId, 
        score: payload.score, 
        timeSpent: payload.timeSpent 
      }
    });

    return totalExperience;
  }

  private processPainTracking(payload: { level: number; improvement: boolean }): number {
    const baseExperience = GAMIFICATION_CONFIG.experienceRates.painTracking;
    const improvementBonus = payload.improvement ? 10 : 0;
    const streakMultiplier = calculateStreakMultiplier(this.stats.streaks.pain_tracking.current);
    
    const totalExperience = Math.round((baseExperience + improvementBonus) * streakMultiplier);

    // Add to activity history
    this.stats.activityHistory.push({
      id: `pain_${Date.now()}`,
      type: 'pain_tracker',
      timestamp: new Date(),
      experienceGained: totalExperience,
      description: `Logged pain level: ${payload.level}/10${payload.improvement ? ' (improvement noted)' : ''}`,
      metadata: { level: payload.level, improvement: payload.improvement }
    });

    return totalExperience;
  }

  private processStreakMilestone(payload: { streakType: string; count: number }): number {
    const baseBonus = GAMIFICATION_CONFIG.experienceRates.streakBonus;
    const milestoneMultiplier = Math.floor(payload.count / 7) + 1; // Bonus every 7 days
    
    return baseBonus * milestoneMultiplier;
  }

  private processWeeklyGoal(payload: { weekId: string; category: string }): number {
    // Find and update the weekly goal
    const goal = this.stats.weeklyGoals.find(g => g.id === payload.weekId);
    if (goal && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
      return goal.reward?.experience || 50;
    }
    return 0;
  }

  private processAssessment(payload: { assessmentType: string; score: number }): number {
    const baseExperience = 30;
    const scoreBonus = Math.round((payload.score / 100) * 20);
    
    const totalExperience = baseExperience + scoreBonus;

    // Add to activity history
    this.stats.activityHistory.push({
      id: `assessment_${Date.now()}`,
      type: 'assessment',
      timestamp: new Date(),
      experienceGained: totalExperience,
      description: `Completed ${payload.assessmentType} assessment (${payload.score}% score)`,
      metadata: { assessmentType: payload.assessmentType, score: payload.score }
    });

    return totalExperience;
  }

  private processMilestone(payload: { milestoneId: string; category: string }): number {
    const milestone = this.stats.milestones.find(m => m.id === payload.milestoneId);
    if (milestone && !milestone.isAchieved) {
      milestone.isAchieved = true;
      milestone.achievedAt = new Date();
      return milestone.reward.experience;
    }
    return GAMIFICATION_CONFIG.experienceRates.milestoneBonus;
  }

  private checkNewBadges(): Badge[] {
    const newBadges: Badge[] = [];
    const currentBadgeIds = this.stats.badges.map(b => b.id);

    for (const badge of BADGES) {
      if (!currentBadgeIds.includes(badge.id) && checkBadgeUnlock(badge.id, this.stats)) {
        const unlockedBadge = {
          ...badge,
          unlockedAt: new Date()
        };
        this.stats.badges.push(unlockedBadge);
        newBadges.push(unlockedBadge);
      }
    }

    return newBadges;
  }

  private checkNewAchievements(): Achievement[] {
    const newAchievements: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!achievement.isUnlocked && this.checkAchievementCriteria(achievement)) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
        
        // Process achievement reward
        if (achievement.reward.type === 'badge') {
          const badgeId = achievement.reward.value as string;
          const badge = BADGES.find(b => b.id === badgeId);
          if (badge && !this.stats.badges.some(b => b.id === badgeId)) {
            this.stats.badges.push({ ...badge, unlockedAt: new Date() });
          }
        }

        this.stats.achievements.push(achievement);
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  private checkAchievementCriteria(achievement: Achievement): boolean {
    const { criteria } = achievement;
    
    switch (criteria.metric) {
      case 'journal_streak':
        return this.evaluateCondition(
          this.stats.streaks.journal_entry.current,
          criteria.operator,
          criteria.value
        );
      
      case 'education_average_score':
        const educationActivities = this.stats.activityHistory.filter(a => a.type === 'education');
        if (educationActivities.length === 0) return false;
        const avgScore = educationActivities.reduce((sum, a) => sum + (a.metadata?.score || 0), 0) / educationActivities.length;
        return this.evaluateCondition(avgScore, criteria.operator, criteria.value);
      
      case 'pain_reduction_percentage':
        // This would require more complex pain tracking analysis
        return false; // Placeholder
      
      case 'modules_completion_time':
        const recentModules = this.stats.activityHistory
          .filter(a => a.type === 'education')
          .slice(-3);
        if (recentModules.length < 3) return false;
        const totalTime = recentModules.reduce((sum, a) => sum + (a.metadata?.timeSpent || 0), 0);
        return this.evaluateCondition(totalTime, criteria.operator, criteria.value);
      
      default:
        return false;
    }
  }

  private evaluateCondition(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case 'equals': return value === target;
      case 'greater_than': return value > target;
      case 'less_than': return value < target;
      case 'greater_equal': return value >= target;
      case 'less_equal': return value <= target;
      default: return false;
    }
  }

  private updateStreaks(event: GamificationEvent): void {
    const today = new Date().toDateString();
    
    // Update specific streak based on event type
    switch (event.type) {
      case 'JOURNAL_ENTRY_CREATED':
        this.updateStreak('journal_entry', today);
        break;
      case 'EDUCATION_MODULE_COMPLETED':
        this.updateStreak('education', today);
        break;
      case 'PAIN_LEVEL_LOGGED':
        this.updateStreak('pain_tracking', today);
        break;
    }

    // Update overall streak if any activity happened today
    this.updateStreak('overall', today);
  }

  private updateStreak(streakType: string, today: string): void {
    const streak = this.stats.streaks[streakType];
    if (!streak) return;

    const lastActivity = streak.lastActivity?.toDateString();
    
    if (lastActivity === today) {
      // Already counted today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity === yesterday.toDateString()) {
      // Continue streak
      streak.current += 1;
      streak.longest = Math.max(streak.longest, streak.current);
    } else if (!lastActivity || lastActivity !== today) {
      // Start new streak or reset
      streak.current = 1;
    }

    streak.lastActivity = new Date();
  }

  public createWeeklyGoals(): WeeklyGoal {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getWeekNumber(now);
    const weekId = `${year}-W${week.toString().padStart(2, '0')}`;

    const weeklyGoal: WeeklyGoal = {
      id: weekId,
      week: weekId,
      goals: {
        journalEntries: { target: 5, current: 0 },
        educationModules: { target: 2, current: 0 },
        painTracking: { target: 7, current: 0 },
        overallEngagement: { target: 10, current: 0 }
      },
      isCompleted: false,
      reward: {
        experience: 100,
        badge: 'week_warrior'
      }
    };

    this.stats.weeklyGoals.push(weeklyGoal);
    return weeklyGoal;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  public getProgressToNextLevel(): { current: number; required: number; percentage: number } {
    const required = getExperienceForNextLevel(this.stats.totalExperience);
    const currentLevelExp = this.stats.totalExperience;
    const previousLevelExp = this.stats.currentLevel > 1 ? 
      GAMIFICATION_CONFIG.levelThresholds[this.stats.currentLevel - 2] : 0;
    const current = currentLevelExp - previousLevelExp;
    const levelRange = GAMIFICATION_CONFIG.levelThresholds[this.stats.currentLevel - 1] - previousLevelExp;
    
    return {
      current,
      required: levelRange,
      percentage: Math.round((current / levelRange) * 100)
    };
  }
}
