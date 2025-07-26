'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { GamificationEngine } from '@/utils/gamification';
import { Badge, UserStats, ProgressStreak } from '@/types/gamification';
import { USER_LEVELS } from '@/data/gamification';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Flame,
  BarChart3,
  Clock,
  Zap,
  Crown,
  Medal,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';

interface ProgressDashboardProps {
  onClose?: () => void;
}

export default function ProgressDashboard({ onClose }: ProgressDashboardProps) {
  const { state } = useApp();
  const [gamificationEngine] = useState(() => new GamificationEngine());
  const [stats, setStats] = useState<UserStats>(gamificationEngine.getStats());
  const [selectedTab, setSelectedTab] = useState<'overview' | 'badges' | 'achievements' | 'streaks'>('overview');

  useEffect(() => {
    // Initialize with some sample data for demonstration
    // In a real app, this would come from persistent storage
    const sampleEvents = [
      { type: 'ASSESSMENT_COMPLETED' as const, payload: { assessmentType: 'initial', score: 85 } },
      { type: 'JOURNAL_ENTRY_CREATED' as const, payload: { entryId: '1', wordCount: 250 } },
      { type: 'EDUCATION_MODULE_COMPLETED' as const, payload: { moduleId: 'tms-fundamentals', score: 95, timeSpent: 20 } }
    ];

    sampleEvents.forEach(event => {
      gamificationEngine.processEvent(event);
    });

    setStats(gamificationEngine.getStats());
  }, [gamificationEngine]);

  const currentLevel = USER_LEVELS.find(level => level.level === stats.currentLevel) || USER_LEVELS[0];
  const nextLevel = USER_LEVELS.find(level => level.level === stats.currentLevel + 1);
  const progressToNext = gamificationEngine.getProgressToNextLevel();

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStreakIcon = (streakType: string) => {
    switch (streakType) {
      case 'journal_entry': return <Award className="h-5 w-5" />;
      case 'education': return <Star className="h-5 w-5" />;
      case 'pain_tracking': return <BarChart3 className="h-5 w-5" />;
      case 'overall': return <Flame className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const formatStreakName = (streakType: string) => {
    switch (streakType) {
      case 'journal_entry': return 'Journal Writing';
      case 'education': return 'Learning';
      case 'pain_tracking': return 'Pain Tracking';
      case 'overall': return 'Overall Activity';
      default: return streakType.replace('_', ' ');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Progress Dashboard</h2>
            <p className="text-indigo-100 mt-1">Track your TMS recovery journey</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-indigo-200 hover:text-white text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Level Progress */}
        <div className="mt-6 bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`} 
                   style={{ backgroundColor: currentLevel.color }}>
                {stats.currentLevel}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentLevel.title}</h3>
                <p className="text-indigo-100 text-sm">{currentLevel.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.totalExperience.toLocaleString()}</p>
              <p className="text-indigo-100 text-sm">Total XP</p>
            </div>
          </div>

          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm text-indigo-100 mb-1">
                <span>Progress to {nextLevel.title}</span>
                <span>{progressToNext.percentage}%</span>
              </div>
              <div className="w-full bg-indigo-500 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNext.percentage}%` }}
                />
              </div>
              <p className="text-indigo-100 text-xs mt-1">
                {progressToNext.current.toLocaleString()} / {progressToNext.required.toLocaleString()} XP
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {[
            { key: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { key: 'badges', label: 'Badges', icon: <Medal className="h-4 w-4" /> },
            { key: 'achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
            { key: 'streaks', label: 'Streaks', icon: <Flame className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Badges Earned</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.badges.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Achievements</p>
                    <p className="text-2xl font-bold text-green-900">{stats.achievements.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <div className="flex items-center">
                  <Flame className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-900">Longest Streak</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {Math.max(...Object.values(stats.streaks).map(s => s.longest))} days
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">Activities</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.activityHistory.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats.activityHistory.slice(-5).reverse().map((activity, index) => (
                  <div key={activity.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'journal' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'education' ? 'bg-green-100 text-green-600' :
                        activity.type === 'pain_tracker' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'journal' ? <Award className="h-4 w-4" /> :
                         activity.type === 'education' ? <Star className="h-4 w-4" /> :
                         activity.type === 'pain_tracker' ? <BarChart3 className="h-4 w-4" /> :
                         <Target className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-indigo-600">+{activity.experienceGained} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'badges' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Badge Collection</h3>
              <p className="text-gray-600 mt-1">Earn badges by completing activities and reaching milestones</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stats.badges.map((badge) => (
                <div key={badge.id} className={`border-2 rounded-lg p-4 text-center ${getBadgeRarityColor(badge.rarity)}`}>
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold mb-1">{badge.name}</h4>
                  <p className="text-xs mb-2">{badge.description}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span className="text-xs font-medium capitalize">{badge.rarity}</span>
                  </div>
                  {badge.unlockedAt && (
                    <p className="text-xs mt-1 opacity-75">
                      Earned {badge.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {stats.badges.length === 0 && (
              <div className="text-center py-12">
                <Medal className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No badges yet</h3>
                <p className="text-gray-600">Start your TMS journey to earn your first badge!</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'achievements' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Achievements</h3>
              <p className="text-gray-600 mt-1">Complete specific challenges to unlock achievements</p>
            </div>

            <div className="space-y-4">
              {stats.achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">{achievement.name}</h4>
                        <p className="text-sm text-green-700">{achievement.description}</p>
                        {achievement.unlockedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Unlock className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.achievements.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                <p className="text-gray-600">Keep working on your recovery to unlock achievements!</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'streaks' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Activity Streaks</h3>
              <p className="text-gray-600 mt-1">Build consistency with daily activities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(stats.streaks).map(([key, streak]) => (
                <div key={key} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        streak.current > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {getStreakIcon(key)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{formatStreakName(key)}</h4>
                        <p className="text-sm text-gray-500">Current streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">{streak.current}</p>
                      <p className="text-sm text-gray-500">days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Longest streak:</span>
                    <span className="font-semibold text-gray-900">{streak.longest} days</span>
                  </div>
                  
                  {streak.lastActivity && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last activity: {streak.lastActivity.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
