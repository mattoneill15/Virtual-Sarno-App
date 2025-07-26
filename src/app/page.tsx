'use client';

import { useApp, useAppActions } from '@/context/AppContext';
import { Heart, Brain, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { localStorage } from '@/utils/storage';

export default function Home() {
  const router = useRouter();
  const { state } = useApp();
  const { setUser, setTreatmentProgress } = useAppActions();

  useEffect(() => {
    // Load existing user data on app start
    const savedUser = localStorage.getUserProfile();
    const savedProgress = localStorage.getTreatmentProgress();
    
    if (savedUser) {
      setUser(savedUser);
    }
    if (savedProgress) {
      setTreatmentProgress(savedProgress);
    }
  }, [setUser, setTreatmentProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Virtual Dr. Sarno</h1>
            </div>
            <div className="text-sm text-gray-600">
              TMS Recovery Program
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your TMS Recovery Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on Dr. John Sarno's groundbreaking work, this application will guide you 
            through understanding and overcoming Tension Myositis Syndrome (TMS).
          </p>
        </div>

        {/* Dr. Sarno Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Dr. John Sarno's Message
              </h3>
              <div className="prose text-gray-700 space-y-4">
                <p>
                  "The pain is real, but it's not caused by a structural abnormality. 
                  It's caused by your unconscious mind to distract you from emotional issues 
                  that your conscious mind finds unacceptable."
                </p>
                <p>
                  This application will help you understand the mind-body connection and 
                  guide you through the process of recovery through knowledge and awareness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Personalized Assessment
            </h3>
            <p className="text-gray-600">
              Complete a comprehensive evaluation to determine your TMS likelihood 
              and create a personalized treatment plan.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Brain className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Educational Journey
            </h3>
            <p className="text-gray-600">
              Learn about TMS through interactive modules covering the mind-body 
              connection and Dr. Sarno's proven approach.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-600">
              Monitor your recovery with daily check-ins, journaling, 
              and milestone celebrations.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          {state.user ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome back, {state.user.personalInfo.name}!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  View Dashboard
                </button>
                <button 
                  onClick={() => router.push('/assessment/results')}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  View Assessment Results
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Ready to begin your path to recovery?
              </p>
              <button 
                onClick={() => router.push('/assessment')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start Your Assessment
              </button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 text-sm font-bold">!</span>
              </div>
            </div>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Medical Disclaimer</p>
              <p>
                This application is for educational purposes only and is not a substitute 
                for professional medical advice, diagnosis, or treatment. Always consult 
                with a qualified healthcare provider before making any changes to your 
                treatment plan.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
