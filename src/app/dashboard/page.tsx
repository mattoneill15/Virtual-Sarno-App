'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, useAppActions } from '@/context/AppContext';
import { localStorage } from '@/utils/storage';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Heart, 
  Target,
  Plus,
  ArrowRight,
  Home
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { state } = useApp();
  const { setTreatmentProgress } = useAppActions();
  const [currentPainLevel, setCurrentPainLevel] = useState(5);

  useEffect(() => {
    // Redirect if no user
    if (!state.user) {
      router.push('/');
      return;
    }

    // Load treatment progress if not already loaded
    if (!state.treatmentProgress) {
      const savedProgress = localStorage.getTreatmentProgress();
      if (savedProgress) {
        setTreatmentProgress(savedProgress);
      } else {
        // Initialize empty progress
        const initialProgress = {
          userId: state.user.id,
          sessions: [],
          milestones: [],
          journalEntries: [],
          readingProgress: {
            completedSections: [],
            currentSection: 'tms-fundamentals-1',
            comprehensionScores: {}
          }
        };
        setTreatmentProgress(initialProgress);
        localStorage.saveTreatmentProgress(initialProgress);
      }
    }
  }, [state.user, state.treatmentProgress, setTreatmentProgress, router]);

  if (!state.user) {
    return <div>Loading...</div>;
  }

  const progress = state.treatmentProgress;
  const recentSessions = progress?.sessions.slice(-5) || [];
  const totalSessions = progress?.sessions.length || 0;
  const completedSections = progress?.readingProgress.completedSections.length || 0;
  const totalSections = 19; // Total educational sections
  const readingProgress = Math.round((completedSections / totalSections) * 100);

  const getPhaseDisplay = (phase: string) => {
    switch (phase) {
      case 'assessment': return 'Initial Assessment';
      case 'education': return 'Education & Learning';
      case 'treatment': return 'Active Treatment';
      case 'maintenance': return 'Maintenance';
      default: return 'Getting Started';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'assessment': return 'bg-blue-100 text-blue-800';
      case 'education': return 'bg-yellow-100 text-yellow-800';
      case 'treatment': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Recovery Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor(state.currentPhase)}`}>
                {getPhaseDisplay(state.currentPhase)}
              </span>
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {state.user.personalInfo.name}!
          </h2>
          <p className="text-gray-600">
            Track your TMS recovery progress and continue your healing journey.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">TMS Likelihood</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.user.tmsAssessment.tmsLikelihood}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reading Progress</p>
                <p className="text-2xl font-bold text-gray-900">{readingProgress}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Pain Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentSessions.length > 0 ? recentSessions[recentSessions.length - 1].painLevel : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Check-in */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Check-in</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Pain Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentPainLevel}
                    onChange={(e) => setCurrentPainLevel(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>1 (No Pain)</span>
                    <span className="font-medium">{currentPainLevel}</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                  Log Today's Session
                </button>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.date.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Pain Level: {session.painLevel}/10
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 capitalize">
                          {session.emotionalState}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No sessions recorded yet</p>
                  <p className="text-sm">Start your first check-in above</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                {state.currentPhase === 'assessment' && (
                  <button 
                    onClick={() => router.push('/assessment/results')}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">View Assessment Results</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </button>
                )}
                
                {state.currentPhase === 'education' && (
                  <button 
                    onClick={() => router.push('/education')}
                    className="w-full flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Continue Learning</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-yellow-600" />
                  </button>
                )}

                <button className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">New Journal Entry</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Educational Content</span>
                    <span className="font-medium">{readingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Daily Sessions</span>
                    <span className="font-medium">{totalSessions} completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((totalSessions / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/assessment/results')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Assessment Results
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Journal Entries
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Educational Library
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Progress Charts
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
