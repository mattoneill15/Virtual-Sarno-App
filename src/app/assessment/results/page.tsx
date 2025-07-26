'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, useAppActions } from '@/context/AppContext';
import { TMSAssessment } from '@/utils/tmsAssessment';
import { localStorage } from '@/utils/storage';
import { Brain, CheckCircle, AlertTriangle, TrendingUp, ArrowRight, Home } from 'lucide-react';

export default function AssessmentResults() {
  const router = useRouter();
  const { state } = useApp();
  const { setPhase } = useAppActions();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Redirect if no user data
    if (!state.user) {
      router.push('/');
      return;
    }

    // Generate recommendations
    const recs = TMSAssessment.generateRecommendations(state.user);
    setRecommendations(recs);
  }, [state.user, router]);

  if (!state.user) {
    return <div>Loading...</div>;
  }

  const { tmsAssessment } = state.user;
  const hasRedFlags = tmsAssessment.redFlags.length > 0;

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood >= 70) return 'text-green-600';
    if (likelihood >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLikelihoodBgColor = (likelihood: number) => {
    if (likelihood >= 70) return 'bg-green-50 border-green-200';
    if (likelihood >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getLikelihoodText = (likelihood: number) => {
    if (likelihood >= 70) return 'High';
    if (likelihood >= 40) return 'Moderate';
    return 'Low';
  };

  const startEducation = () => {
    setPhase('education');
    router.push('/education');
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
            </div>
            <button
              onClick={goHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your TMS Assessment Results
            </h2>
            <p className="text-gray-600">
              Based on Dr. John Sarno's clinical criteria and your responses
            </p>
          </div>

          {/* Red Flags Warning */}
          {hasRedFlags && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Medical Attention Recommended</h3>
                  <p className="text-red-800 mb-3">
                    Your assessment indicates some factors that may require medical evaluation:
                  </p>
                  <ul className="text-red-800 space-y-1">
                    {tmsAssessment.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-red-800 mt-3 font-medium">
                    Please consult with a healthcare provider before proceeding with TMS treatment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TMS Likelihood */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className={`rounded-lg border p-6 ${getLikelihoodBgColor(tmsAssessment.tmsLikelihood)}`}>
              <div className="text-center">
                <TrendingUp className={`h-12 w-12 mx-auto mb-4 ${getLikelihoodColor(tmsAssessment.tmsLikelihood)}`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">TMS Likelihood</h3>
                <div className={`text-4xl font-bold mb-2 ${getLikelihoodColor(tmsAssessment.tmsLikelihood)}`}>
                  {tmsAssessment.tmsLikelihood}%
                </div>
                <p className={`font-medium ${getLikelihoodColor(tmsAssessment.tmsLikelihood)}`}>
                  {getLikelihoodText(tmsAssessment.tmsLikelihood)} Probability
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <div className="text-center">
                <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sarno Compatibility</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {tmsAssessment.sarnoCompatibility}%
                </div>
                <p className="font-medium text-indigo-600">
                  Profile Match
                </p>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What This Means</h3>
            <div className="prose text-gray-700">
              {tmsAssessment.tmsLikelihood >= 70 && (
                <p>
                  Your symptoms and profile strongly align with Tension Myositis Syndrome as described by Dr. Sarno. 
                  You exhibit many of the personality traits and pain patterns commonly seen in TMS patients. 
                  This suggests that your pain may be psychosomatic in nature, caused by emotional tension rather than structural problems.
                </p>
              )}
              {tmsAssessment.tmsLikelihood >= 40 && tmsAssessment.tmsLikelihood < 70 && (
                <p>
                  Your symptoms show some alignment with TMS patterns, but there are mixed indicators. 
                  While psychological factors may be contributing to your pain, it's important to rule out 
                  any structural issues through proper medical evaluation before fully committing to TMS treatment.
                </p>
              )}
              {tmsAssessment.tmsLikelihood < 40 && (
                <p>
                  Your symptoms and profile show limited alignment with typical TMS patterns. 
                  This doesn't rule out TMS entirely, but suggests that other factors may be more significant 
                  in your case. Medical evaluation is recommended to explore other potential causes.
                </p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            
            {!hasRedFlags && tmsAssessment.tmsLikelihood >= 40 ? (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Based on your results, you're ready to begin the TMS education and treatment program. 
                  This will help you understand the mind-body connection and start your recovery journey.
                </p>
                <button
                  onClick={startEducation}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <span>Start TMS Education</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700">
                  {hasRedFlags 
                    ? "Please consult with a healthcare provider before proceeding. Once you have medical clearance, you can return to continue with TMS education."
                    : "Consider getting a medical evaluation to rule out structural causes before proceeding with TMS treatment. You can always return to continue your assessment later."
                  }
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={goHome}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Return Home
                  </button>
                  {!hasRedFlags && (
                    <button
                      onClick={startEducation}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Continue Anyway
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Disclaimer</p>
              <p>
                This assessment is for educational purposes only and should not be considered a medical diagnosis. 
                TMS treatment works best when structural causes have been ruled out by a qualified healthcare provider. 
                Always consult with a medical professional for proper diagnosis and treatment of persistent pain.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
