'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, useAppActions } from '@/context/AppContext';
import PainMapper from '@/components/PainMapper';
import { TreatmentSession } from '@/types';
import { localStorage } from '@/utils/storage';
import { Brain, Home, ArrowLeft, Save, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function PainTrackerPage() {
  const router = useRouter();
  const { state } = useApp();
  const { addSession } = useAppActions();

  const [painLocations, setPainLocations] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(5);
  const [emotionalState, setEmotionalState] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [insights, setInsights] = useState('');
  const [breakthroughs, setBreakthroughs] = useState('');
  const [recentSessions, setRecentSessions] = useState<TreatmentSession[]>([]);

  const emotionalStates = [
    'calm', 'stressed', 'anxious', 'frustrated', 'sad', 'angry', 
    'hopeful', 'peaceful', 'overwhelmed', 'content', 'worried', 'energized'
  ];

  const commonActivities = [
    'work', 'exercise', 'relaxation', 'social time', 'household tasks',
    'reading', 'meditation', 'therapy', 'journaling', 'sleep'
  ];

  useEffect(() => {
    if (!state.user) {
      router.push('/');
      return;
    }

    // Load recent sessions
    if (state.treatmentProgress?.sessions) {
      setRecentSessions(state.treatmentProgress.sessions.slice(-10).reverse());
    }

    // Load current pain locations from user profile
    if (state.user.painHistory.painLocations) {
      setPainLocations(state.user.painHistory.painLocations);
    }
  }, [state.user, state.treatmentProgress, router]);

  const handleSaveSession = () => {
    if (!state.user) return;

    const newSession: TreatmentSession = {
      date: new Date(),
      painLevel,
      emotionalState,
      insights,
      activities,
      breakthroughs
    };

    // Add to state
    addSession(newSession);

    // Update recent sessions
    setRecentSessions(prev => [newSession, ...prev.slice(0, 9)]);

    // Reset form
    setEmotionalState('');
    setActivities([]);
    setInsights('');
    setBreakthroughs('');
    
    // Show success message or redirect
    alert('Session saved successfully!');
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please complete your assessment to access pain tracking.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pain Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Current Session */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Check-in */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Check-in</h2>
              
              {/* Pain Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Pain Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>1 (No Pain)</span>
                  <span className="font-medium text-lg">{painLevel}</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              {/* Emotional State */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling emotionally?
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotionalStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => setEmotionalState(state)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        emotionalState === state
                          ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What activities have you done today? (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonActivities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activities.includes(activity)
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any insights about your pain or emotions today?
                </label>
                <textarea
                  value={insights}
                  onChange={(e) => setInsights(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="What patterns do you notice? What triggers or relieves your pain?"
                />
              </div>

              {/* Breakthroughs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any breakthroughs or progress today?
                </label>
                <textarea
                  value={breakthroughs}
                  onChange={(e) => setBreakthroughs(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Moments of understanding, pain-free periods, emotional releases, etc."
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSession}
                disabled={!emotionalState}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-5 w-5" />
                <span>Save Today's Session</span>
              </button>
            </div>

            {/* Pain Mapper */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <PainMapper
                selectedPains={painLocations}
                onPainChange={setPainLocations}
                showIntensity={true}
              />
            </div>
          </div>

          {/* Right Column - History & Stats */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold text-gray-900">{recentSessions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Pain Level</span>
                  <span className="font-semibold text-gray-900">{painLevel}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pain Locations</span>
                  <span className="font-semibold text-gray-900">{painLocations.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.slice(0, 5).map((session, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {format(session.date, 'MMM d')}
                        </span>
                        <span className="text-sm text-gray-600">
                          Pain: {session.painLevel}/10
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 capitalize">
                        Feeling: {session.emotionalState}
                      </p>
                      {session.activities.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Activities: {session.activities.slice(0, 2).join(', ')}
                          {session.activities.length > 2 && '...'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No sessions recorded yet</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/journal')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📝 Write in Journal
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📊 View Dashboard
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📚 Educational Content
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📈 Progress Charts
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
