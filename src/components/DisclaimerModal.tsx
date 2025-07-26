'use client';

import { useState, useEffect } from 'react';
import { DisclaimerContent } from '@/types/safety';
import { DISCLAIMERS } from '@/data/safety';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Heart,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: (disclaimerIds: string[]) => void;
  onDecline: () => void;
  requiredDisclaimers?: string[];
  pageContext?: string;
}

export default function DisclaimerModal({ 
  isOpen, 
  onAccept, 
  onDecline, 
  requiredDisclaimers = ['general_medical_disclaimer', 'liability_disclaimer'],
  pageContext = 'all'
}: DisclaimerModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [acknowledgedDisclaimers, setAcknowledgedDisclaimers] = useState<Set<string>>(new Set());
  const [hasReadCurrent, setHasReadCurrent] = useState(false);

  // Filter disclaimers based on page context and requirements
  const relevantDisclaimers = DISCLAIMERS.filter(disclaimer => 
    requiredDisclaimers.includes(disclaimer.id) ||
    (disclaimer.applicablePages?.includes(pageContext) || disclaimer.applicablePages?.includes('all'))
  );

  const currentDisclaimer = relevantDisclaimers[currentStep];
  const isLastStep = currentStep === relevantDisclaimers.length - 1;
  const canProceed = hasReadCurrent && (currentDisclaimer?.requiresAcknowledgment ? acknowledgedDisclaimers.has(currentDisclaimer.id) : true);
  const allAcknowledged = relevantDisclaimers.every(d => 
    !d.requiresAcknowledgment || acknowledgedDisclaimers.has(d.id)
  );

  useEffect(() => {
    setHasReadCurrent(false);
  }, [currentStep]);

  useEffect(() => {
    // Simulate reading time - user must spend at least 10 seconds reading
    const timer = setTimeout(() => {
      setHasReadCurrent(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleAcknowledge = (disclaimerId: string) => {
    setAcknowledgedDisclaimers(prev => new Set([...prev, disclaimerId]));
  };

  const handleNext = () => {
    if (isLastStep) {
      if (allAcknowledged) {
        onAccept(Array.from(acknowledgedDisclaimers));
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getDisclaimerIcon = (type: string) => {
    switch (type) {
      case 'medical': return <Heart className="h-6 w-6 text-red-600" />;
      case 'educational': return <FileText className="h-6 w-6 text-blue-600" />;
      case 'liability': return <Shield className="h-6 w-6 text-yellow-600" />;
      case 'privacy': return <Lock className="h-6 w-6 text-purple-600" />;
      default: return <AlertTriangle className="h-6 w-6 text-gray-600" />;
    }
  };

  if (!isOpen || !currentDisclaimer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getDisclaimerIcon(currentDisclaimer.type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentDisclaimer.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  Step {currentStep + 1} of {relevantDisclaimers.length}
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              {relevantDisclaimers.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep 
                      ? 'bg-indigo-600' 
                      : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {currentDisclaimer.content}
            </div>
          </div>

          {/* Version and Date Info */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between items-center">
              <span>Version {currentDisclaimer.version}</span>
              <span>Last updated: {currentDisclaimer.lastUpdated.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Reading Progress Indicator */}
          {!hasReadCurrent && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 text-sm">
                  Please take time to read this important information carefully...
                </span>
              </div>
            </div>
          )}

          {/* Acknowledgment Checkbox */}
          {currentDisclaimer.requiresAcknowledgment && hasReadCurrent && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledgedDisclaimers.has(currentDisclaimer.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAcknowledge(currentDisclaimer.id);
                    } else {
                      setAcknowledgedDisclaimers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(currentDisclaimer.id);
                        return newSet;
                      });
                    }
                  }}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    I have read and understand this {currentDisclaimer.type} disclaimer
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    By checking this box, you acknowledge that you have read, understood, and agree to the terms outlined above.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Important Notice for Medical Disclaimer */}
          {currentDisclaimer.type === 'medical' && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Important Medical Notice</h4>
                  <p className="text-red-800 text-sm mb-3">
                    This application is not a substitute for professional medical care. If you are experiencing:
                  </p>
                  <ul className="text-red-800 text-sm space-y-1 mb-3">
                    <li>• Severe or worsening pain</li>
                    <li>• Neurological symptoms (weakness, numbness, tingling)</li>
                    <li>• Bowel or bladder problems</li>
                    <li>• Fever with back pain</li>
                    <li>• Thoughts of self-harm</li>
                  </ul>
                  <p className="text-red-800 text-sm font-medium">
                    Seek immediate medical attention. Do not delay professional care.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Resources Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.open('tel:911')}
              className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency? Call 911</span>
            </button>
            <span className="mx-3 text-gray-300">|</span>
            <button
              onClick={() => window.open('tel:988')}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Heart className="h-4 w-4" />
              <span>Crisis Support: 988</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={currentStep === 0 ? onDecline : handlePrevious}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
            >
              {currentStep === 0 ? 'Decline' : 'Previous'}
            </button>

            <div className="flex items-center space-x-4">
              {!hasReadCurrent && (
                <span className="text-sm text-gray-500">
                  Please read the full disclaimer before proceeding
                </span>
              )}
              
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLastStep ? 'Accept & Continue' : 'Next'}
              </button>
            </div>
          </div>

          {/* Final Acceptance Summary */}
          {isLastStep && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Ready to Continue</h4>
                    <p className="text-green-800 text-sm">
                      You have acknowledged all required disclaimers. By clicking "Accept & Continue", 
                      you confirm that you understand the limitations and responsibilities outlined above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for managing disclaimer state
export function useDisclaimerManager() {
  const [acknowledgedDisclaimers, setAcknowledgedDisclaimers] = useState<string[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const checkDisclaimerRequirement = (pageContext: string, requiredDisclaimers: string[] = []) => {
    const relevantDisclaimers = DISCLAIMERS.filter(disclaimer => 
      requiredDisclaimers.includes(disclaimer.id) ||
      (disclaimer.applicablePages?.includes(pageContext) || disclaimer.applicablePages?.includes('all'))
    );

    const unacknowledged = relevantDisclaimers.filter(disclaimer => 
      disclaimer.requiresAcknowledgment && !acknowledgedDisclaimers.includes(disclaimer.id)
    );

    if (unacknowledged.length > 0) {
      setShowDisclaimer(true);
      return false;
    }

    return true;
  };

  const handleDisclaimerAccept = (disclaimerIds: string[]) => {
    setAcknowledgedDisclaimers(prev => [...new Set([...prev, ...disclaimerIds])]);
    setShowDisclaimer(false);
    
    // Store in localStorage for persistence
    localStorage.setItem('acknowledgedDisclaimers', JSON.stringify([...new Set([...acknowledgedDisclaimers, ...disclaimerIds])]));
  };

  const handleDisclaimerDecline = () => {
    setShowDisclaimer(false);
    // Redirect to home or show alternative content
  };

  // Load acknowledged disclaimers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('acknowledgedDisclaimers');
    if (stored) {
      try {
        setAcknowledgedDisclaimers(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading acknowledged disclaimers:', error);
      }
    }
  }, []);

  return {
    acknowledgedDisclaimers,
    showDisclaimer,
    checkDisclaimerRequirement,
    handleDisclaimerAccept,
    handleDisclaimerDecline,
    setShowDisclaimer
  };
}
