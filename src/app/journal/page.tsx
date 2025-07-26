'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Journal from '@/components/Journal';
import { Brain, Home, ArrowLeft } from 'lucide-react';

export default function JournalPage() {
  const router = useRouter();
  const { state } = useApp();

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please complete your assessment to access journaling features.</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">TMS Journal</h1>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Your TMS Journal
              </h2>
              <div className="prose text-gray-700 space-y-3">
                <p>
                  Journaling is a cornerstone of TMS recovery. Dr. Sarno emphasized that becoming aware 
                  of repressed emotions is essential for healing. This journal will help you:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Identify and express emotions you may be suppressing</li>
                  <li>Recognize patterns between stress and physical symptoms</li>
                  <li>Explore perfectionist tendencies and people-pleasing behaviors</li>
                  <li>Process childhood experiences that may influence current pain</li>
                  <li>Track your emotional and physical progress over time</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Remember:</strong> There are no right or wrong answers. Write honestly and 
                  without judgment. Your entries are private and stored securely on your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Component */}
        <Journal />
      </main>
    </div>
  );
}
