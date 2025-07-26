'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, useAppActions } from '@/context/AppContext';
import { EDUCATIONAL_MODULES } from '@/data/educationalModules';
import EducationModule from '@/components/EducationModule';
import { EducationalModule } from '@/types/education';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  CheckCircle, 
  Lock,
  Star,
  TrendingUp,
  Award,
  Play,
  ArrowRight
} from 'lucide-react';

export default function EducationPage() {
  const router = useRouter();
  const { state } = useApp();
  const { updateReadingProgress } = useAppActions();
  
  const [selectedModule, setSelectedModule] = useState<EducationalModule | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  // Check if user has completed assessment
  useEffect(() => {
    if (!state.userProfile?.assessmentCompleted) {
      router.push('/assessment');
    }
  }, [state.userProfile, router]);

  if (!state.userProfile?.assessmentCompleted || !state.treatmentProgress) {
    return null;
  }

  const completedModules = state.treatmentProgress.readingProgress.completedSections;
  const comprehensionScores = state.treatmentProgress.readingProgress.comprehensionScores;

  const getModuleStatus = (module: EducationalModule) => {
    const isCompleted = completedModules.includes(module.id);
    const isAvailable = module.prerequisites.length === 0 || 
      module.prerequisites.every(prereq => completedModules.includes(prereq));
    
    return {
      isCompleted,
      isAvailable,
      score: comprehensionScores[module.id] || null
    };
  };

  const filteredModules = EDUCATIONAL_MODULES.filter(module => {
    const status = getModuleStatus(module);
    switch (filter) {
      case 'available':
        return status.isAvailable && !status.isCompleted;
      case 'completed':
        return status.isCompleted;
      default:
        return true;
    }
  });

  const handleModuleComplete = (moduleId: string, score?: number) => {
    setSelectedModule(null);
    // Progress is already updated in the EducationModule component
  };

  const overallProgress = {
    completed: completedModules.length,
    total: EDUCATIONAL_MODULES.length,
    percentage: Math.round((completedModules.length / EDUCATIONAL_MODULES.length) * 100)
  };

  const averageScore = Object.values(comprehensionScores).length > 0
    ? Math.round(Object.values(comprehensionScores).reduce((a, b) => a + b, 0) / Object.values(comprehensionScores).length)
    : 0;

  if (selectedModule) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <EducationModule
          module={selectedModule}
          onComplete={handleModuleComplete}
          onClose={() => setSelectedModule(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TMS Education Center</h1>
              <p className="text-gray-600 mt-1">
                Learn about Tension Myositis Syndrome and Dr. Sarno's approach to healing
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Modules Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {overallProgress.completed}/{overallProgress.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overall Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{overallProgress.percentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {averageScore > 0 ? `${averageScore}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Learning Streak</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {state.treatmentProgress.streaks.learning} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Learning Journey Progress</h3>
            <span className="text-sm text-gray-500">{overallProgress.percentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Getting Started</span>
            <span>Understanding TMS</span>
            <span>Active Recovery</span>
            <span>Mastery</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Modules', count: EDUCATIONAL_MODULES.length },
                { key: 'available', label: 'Available', count: filteredModules.length },
                { key: 'completed', label: 'Completed', count: completedModules.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.key === 'available' ? 
                    EDUCATIONAL_MODULES.filter(m => {
                      const status = getModuleStatus(m);
                      return status.isAvailable && !status.isCompleted;
                    }).length : tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const status = getModuleStatus(module);
            
            return (
              <div
                key={module.id}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                  !status.isAvailable ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {module.description}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {status.isCompleted ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          {status.score && (
                            <span className="text-sm font-medium text-green-600">
                              {status.score}%
                            </span>
                          )}
                        </div>
                      ) : !status.isAvailable ? (
                        <Lock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Play className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </div>

                  {/* Module Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.estimatedReadTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span className="capitalize">{module.difficulty}</span>
                    </div>
                    {module.quiz && (
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4" />
                        <span>Quiz</span>
                      </div>
                    )}
                  </div>

                  {/* Prerequisites */}
                  {module.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.prerequisites.map((prereqId) => {
                          const prereqModule = EDUCATIONAL_MODULES.find(m => m.id === prereqId);
                          const isPrereqCompleted = completedModules.includes(prereqId);
                          
                          return (
                            <span
                              key={prereqId}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isPrereqCompleted
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {isPrereqCompleted ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Lock className="h-3 w-3 mr-1" />
                              )}
                              {prereqModule?.title || prereqId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => status.isAvailable && setSelectedModule(module)}
                    disabled={!status.isAvailable}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                      !status.isAvailable
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : status.isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {!status.isAvailable ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Locked</span>
                      </>
                    ) : status.isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Review</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Start Module</span>
                      </>
                    )}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">
              {filter === 'available' 
                ? 'Complete prerequisite modules to unlock more content.'
                : filter === 'completed'
                ? 'You haven\'t completed any modules yet. Start learning!'
                : 'No educational modules available.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
