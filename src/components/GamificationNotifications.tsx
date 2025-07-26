'use client';

import { useState, useEffect } from 'react';
import { Badge, Achievement } from '@/types/gamification';
import { USER_LEVELS } from '@/data/gamification';
import { 
  Trophy, 
  Star, 
  Award, 
  Zap, 
  X,
  Crown,
  TrendingUp
} from 'lucide-react';

interface NotificationData {
  id: string;
  type: 'badge' | 'achievement' | 'level_up' | 'experience';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  data?: any;
}

interface GamificationNotificationsProps {
  newBadges?: Badge[];
  newAchievements?: Achievement[];
  levelUp?: boolean;
  newLevel?: number;
  experienceGained?: number;
  onNotificationDismiss?: (id: string) => void;
}

export default function GamificationNotifications({
  newBadges = [],
  newAchievements = [],
  levelUp = false,
  newLevel,
  experienceGained = 0,
  onNotificationDismiss
}: GamificationNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const newNotifications: NotificationData[] = [];

    // Experience gained notification
    if (experienceGained > 0) {
      newNotifications.push({
        id: `exp_${Date.now()}`,
        type: 'experience',
        title: `+${experienceGained} XP`,
        description: 'Experience gained!',
        icon: <Zap className="h-6 w-6" />,
        color: 'from-yellow-400 to-orange-500'
      });
    }

    // Badge notifications
    newBadges.forEach((badge, index) => {
      newNotifications.push({
        id: `badge_${badge.id}_${Date.now()}_${index}`,
        type: 'badge',
        title: 'New Badge Unlocked!',
        description: badge.name,
        icon: <span className="text-2xl">{badge.icon}</span>,
        color: getBadgeNotificationColor(badge.rarity),
        data: badge
      });
    });

    // Achievement notifications
    newAchievements.forEach((achievement, index) => {
      newNotifications.push({
        id: `achievement_${achievement.id}_${Date.now()}_${index}`,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        description: achievement.name,
        icon: <Trophy className="h-6 w-6" />,
        color: 'from-green-400 to-emerald-500',
        data: achievement
      });
    });

    // Level up notification
    if (levelUp && newLevel) {
      const levelData = USER_LEVELS.find(level => level.level === newLevel);
      newNotifications.push({
        id: `level_${newLevel}_${Date.now()}`,
        type: 'level_up',
        title: 'Level Up!',
        description: levelData ? `You are now a ${levelData.title}` : `Level ${newLevel}`,
        icon: <Crown className="h-6 w-6" />,
        color: 'from-purple-400 to-pink-500',
        data: { level: newLevel, levelData }
      });
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);

      // Auto-dismiss notifications after 5 seconds
      newNotifications.forEach(notification => {
        setTimeout(() => {
          dismissNotification(notification.id);
        }, 5000);
      });
    }
  }, [newBadges, newAchievements, levelUp, newLevel, experienceGained]);

  const getBadgeNotificationColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'uncommon': return 'from-green-400 to-green-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    onNotificationDismiss?.(id);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-gradient-to-r ${notification.color} text-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 animate-slide-in-right`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">
                    {notification.title}
                  </h4>
                  <p className="text-sm opacity-90 truncate">
                    {notification.description}
                  </p>
                  
                  {/* Additional details for specific notification types */}
                  {notification.type === 'badge' && notification.data && (
                    <p className="text-xs opacity-75 mt-1 capitalize">
                      {notification.data.rarity} • {notification.data.category}
                    </p>
                  )}
                  
                  {notification.type === 'level_up' && notification.data?.levelData && (
                    <p className="text-xs opacity-75 mt-1">
                      {notification.data.levelData.description}
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => dismissNotification(notification.id)}
                className="flex-shrink-0 ml-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Progress bar for auto-dismiss */}
          <div className="h-1 bg-white/20">
            <div 
              className="h-full bg-white/40 transition-all duration-5000 ease-linear"
              style={{ 
                animation: 'progress-bar 5s linear forwards',
                width: '0%'
              }}
            />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .duration-5000 {
          transition-duration: 5000ms;
        }
      `}</style>
    </div>
  );
}

// Hook for managing gamification notifications
export function useGamificationNotifications() {
  const [notifications, setNotifications] = useState<{
    newBadges: Badge[];
    newAchievements: Achievement[];
    levelUp: boolean;
    newLevel?: number;
    experienceGained: number;
  }>({
    newBadges: [],
    newAchievements: [],
    levelUp: false,
    experienceGained: 0
  });

  const showNotifications = (data: {
    newBadges?: Badge[];
    newAchievements?: Achievement[];
    levelUp?: boolean;
    newLevel?: number;
    experienceGained?: number;
  }) => {
    setNotifications({
      newBadges: data.newBadges || [],
      newAchievements: data.newAchievements || [],
      levelUp: data.levelUp || false,
      newLevel: data.newLevel,
      experienceGained: data.experienceGained || 0
    });

    // Clear notifications after showing
    setTimeout(() => {
      setNotifications({
        newBadges: [],
        newAchievements: [],
        levelUp: false,
        experienceGained: 0
      });
    }, 100);
  };

  const clearNotifications = () => {
    setNotifications({
      newBadges: [],
      newAchievements: [],
      levelUp: false,
      experienceGained: 0
    });
  };

  return {
    notifications,
    showNotifications,
    clearNotifications
  };
}
