'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import VirtualSarnoChat from '@/components/VirtualSarnoChat';
import { ArrowLeft, Brain, MessageCircle, Shield } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { state } = useApp();

  useEffect(() => {
    // Redirect to welcome if no user exists
    if (!state.user) {
      router.push('/');
      return;
    }
  }, [state.user, router]);

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getPersonalizedGreeting = () => {
    const name = state.user?.personalInfo?.name;
    const phase = state.currentPhase;
    
    let greeting = `Hello${name ? ` ${name}` : ''}! I'm Dr. John Sarno. `;
    
    switch (phase) {
      case 'assessment':
        greeting += "I understand you're exploring whether you might have TMS. I'm here to help you understand your symptoms and guide you through this process. What brings you to see me today?";
        break;
      case 'education':
        greeting += "I see you're in the learning phase of your TMS journey. This is crucial - knowledge truly is the cure. What aspects of TMS would you like to explore together?";
        break;
      case 'treatment':
        greeting += "You're actively working on your TMS healing - excellent! I'm here to support you through any challenges or questions that arise. How are you feeling about your progress?";
        break;
      case 'maintenance':
        greeting += "It's wonderful to see you maintaining your TMS recovery. I'm here whenever you need guidance or reassurance. What would you like to discuss today?";
        break;
      default:
        greeting += "I'm here to help you understand your pain and guide you toward healing through the mind-body approach. What would you like to discuss?";
    }
    
    return greeting;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Virtual Dr. John Sarno
                  </h1>
                  <p className="text-sm text-gray-600">
                    Personal TMS Consultation
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <VirtualSarnoChat 
              className="h-[600px]"
              initialMessage={getPersonalizedGreeting()}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Dr. Sarno */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                About Dr. Sarno
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Dr. John Sarno (1923-2017) was a pioneering physician who revolutionized 
                  the understanding of chronic pain through his work on Tension Myositis Syndrome (TMS).
                </p>
                <p>
                  This virtual consultation is based on his decades of clinical experience 
                  and the principles outlined in his groundbreaking books.
                </p>
              </div>
            </div>

            {/* Quick Topics */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Common Topics
              </h3>
              <div className="space-y-2">
                {[
                  'Is my pain TMS?',
                  'How to overcome fear of movement',
                  'Identifying repressed emotions',
                  'When to stop physical treatments',
                  'Dealing with setbacks',
                  'Return to normal activities'
                ].map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                    onClick={() => {
                      // This would send the topic as a message
                      // For now, it's just a visual element
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">
                    Important Notice
                  </p>
                  <p className="text-amber-700">
                    This virtual consultation is for educational purposes only. 
                    It cannot replace proper medical evaluation or emergency care.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Resources */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Emergency Resources</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium text-red-700">Crisis:</span>
                  <a href="tel:988" className="text-red-600 hover:underline ml-1">
                    988 Lifeline
                  </a>
                </div>
                <div>
                  <span className="font-medium text-red-700">Emergency:</span>
                  <a href="tel:911" className="text-red-600 hover:underline ml-1">
                    911
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
