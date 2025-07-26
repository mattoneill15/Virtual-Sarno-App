'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import ProgressDashboard from '@/components/ProgressDashboard';

export default function ProgressPage() {
  const router = useRouter();
  const { state } = useApp();

  // Check if user has completed assessment
  useEffect(() => {
    if (!state.user) {
      router.push('/');
    }
  }, [state.user, router]);

  if (!state.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
              <p className="text-gray-600 mt-1">
                Track your TMS recovery journey with detailed analytics and achievements
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
        <ProgressDashboard />
      </div>
    </div>
  );
}
