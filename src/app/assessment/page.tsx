'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, useAppActions } from '@/context/AppContext';
import { UserProfile, PERSONALITY_TYPES, STRESS_FACTORS, PAIN_LOCATIONS, COMMON_SYMPTOMS } from '@/types';
import { TMSAssessment } from '@/utils/tmsAssessment';
import { SafetyMonitoringSystem } from '@/utils/safetyMonitoring';
import { localStorage } from '@/utils/storage';
import DisclaimerModal, { useDisclaimerManager } from '@/components/DisclaimerModal';
import SafetyAlert from '@/components/SafetyAlert';
import { RedFlag } from '@/types/safety';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, ArrowRight, Brain, AlertTriangle } from 'lucide-react';

interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export default function AssessmentPage() {
  const router = useRouter();
  const { state } = useApp();
  const { setUser, setPhase } = useAppActions();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Partial<UserProfile>>({
    id: uuidv4(),
    createdAt: new Date(),
    lastActive: new Date(),
    personalInfo: {
      name: '',
      age: 0,
      occupation: '',
      lifestyle: 'active'
    },
    psychologicalProfile: {
      personalityType: [],
      stressFactors: [],
      copingMechanisms: [],
      traumaHistory: false,
      currentLifeStressors: []
    },
    painHistory: {
      primarySymptoms: [],
      painLocations: [],
      painIntensity: 5,
      painFrequency: 'intermittent',
      onsetDate: new Date(),
      triggers: [],
      previousDiagnoses: [],
      previousTreatments: [],
      medicalHistory: []
    },
    tmsAssessment: {
      tmsLikelihood: 0,
      sarnoCompatibility: 0,
      redFlags: [],
      assessmentDate: new Date()
    }
  });

  const updateAssessmentData = (updates: Partial<UserProfile>) => {
    setAssessmentData(prev => ({
      ...prev,
      ...updates,
      personalInfo: { ...prev.personalInfo, ...updates.personalInfo },
      psychologicalProfile: { ...prev.psychologicalProfile, ...updates.psychologicalProfile },
      painHistory: { ...prev.painHistory, ...updates.painHistory },
      tmsAssessment: { ...prev.tmsAssessment, ...updates.tmsAssessment }
    }));
  };

  const completeAssessment = () => {
    const completeProfile = assessmentData as UserProfile;
    
    // Calculate TMS assessment scores
    const tmsLikelihood = TMSAssessment.calculateTMSLikelihood(completeProfile);
    const sarnoCompatibility = TMSAssessment.calculateSarnoCompatibility(completeProfile);
    const redFlags = TMSAssessment.identifyRedFlags(completeProfile);
    
    const finalProfile: UserProfile = {
      ...completeProfile,
      tmsAssessment: {
        tmsLikelihood,
        sarnoCompatibility,
        redFlags,
        assessmentDate: new Date()
      }
    };

    // Save to storage and update state
    localStorage.saveUserProfile(finalProfile);
    setUser(finalProfile);
    setPhase('education');
    
    // Navigate to results
    router.push('/assessment/results');
  };

  const steps: AssessmentStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your TMS Assessment',
      description: 'Let\'s begin your journey to understanding TMS',
      component: WelcomeStep
    },
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      component: PersonalInfoStep
    },
    {
      id: 'pain',
      title: 'Pain History',
      description: 'Describe your current symptoms',
      component: PainHistoryStep
    },
    {
      id: 'psychological',
      title: 'Psychological Profile',
      description: 'Understanding your personality and stress patterns',
      component: PsychologicalStep
    },
    {
      id: 'medical',
      title: 'Medical History',
      description: 'Previous treatments and diagnoses',
      component: MedicalHistoryStep
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeAssessment();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">TMS Assessment</h1>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {steps[currentStep].title}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <CurrentStepComponent 
            data={assessmentData}
            updateData={updateAssessmentData}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Step Components
function WelcomeStep() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <Brain className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Understanding TMS Assessment
            </h3>
            <p className="text-blue-800 mb-4">
              This comprehensive assessment will help determine if your symptoms align with 
              Tension Myositis Syndrome (TMS) as described by Dr. John Sarno.
            </p>
            <ul className="text-blue-800 space-y-2">
              <li>• Takes approximately 15-20 minutes to complete</li>
              <li>• Based on Dr. Sarno's clinical criteria</li>
              <li>• Completely confidential and stored locally</li>
              <li>• Not a substitute for medical diagnosis</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Important Notice</h4>
            <p className="text-yellow-800 text-sm">
              This assessment is for educational purposes only. If you have severe symptoms, 
              recent onset of pain, or any concerning symptoms, please consult with a 
              healthcare provider before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoStep({ data, updateData }: { data: Partial<UserProfile>, updateData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={data.personalInfo?.name || ''}
            onChange={(e) => updateData({
              personalInfo: { ...data.personalInfo!, name: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={data.personalInfo?.age || ''}
            onChange={(e) => updateData({
              personalInfo: { ...data.personalInfo!, age: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your age"
            min="1"
            max="120"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Occupation
        </label>
        <input
          type="text"
          value={data.personalInfo?.occupation || ''}
          onChange={(e) => updateData({
            personalInfo: { ...data.personalInfo!, occupation: e.target.value }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="What is your current occupation?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lifestyle Activity Level
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(['sedentary', 'active', 'very active'] as const).map((level) => (
            <button
              key={level}
              onClick={() => updateData({
                personalInfo: { ...data.personalInfo!, lifestyle: level }
              })}
              className={`p-4 rounded-lg border-2 transition-colors ${
                data.personalInfo?.lifestyle === level
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium capitalize">{level}</div>
              <div className="text-sm text-gray-600 mt-1">
                {level === 'sedentary' && 'Mostly desk work, minimal exercise'}
                {level === 'active' && 'Regular exercise, moderate activity'}
                {level === 'very active' && 'High activity, frequent exercise'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PainHistoryStep({ data, updateData }: { data: Partial<UserProfile>, updateData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Symptoms (select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {COMMON_SYMPTOMS.map((symptom) => (
            <label key={symptom} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.painHistory?.primarySymptoms?.includes(symptom) || false}
                onChange={(e) => {
                  const current = data.painHistory?.primarySymptoms || [];
                  const updated = e.target.checked
                    ? [...current, symptom]
                    : current.filter(s => s !== symptom);
                  updateData({
                    painHistory: { ...data.painHistory!, primarySymptoms: updated }
                  });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700 capitalize">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pain Locations (select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {PAIN_LOCATIONS.map((location) => (
            <label key={location} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.painHistory?.painLocations?.includes(location) || false}
                onChange={(e) => {
                  const current = data.painHistory?.painLocations || [];
                  const updated = e.target.checked
                    ? [...current, location]
                    : current.filter(l => l !== location);
                  updateData({
                    painHistory: { ...data.painHistory!, painLocations: updated }
                  });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700 capitalize">{location}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pain Intensity (1-10 scale)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={data.painHistory?.painIntensity || 5}
            onChange={(e) => updateData({
              painHistory: { ...data.painHistory!, painIntensity: parseInt(e.target.value) }
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>1 (Mild)</span>
            <span className="font-medium">{data.painHistory?.painIntensity || 5}</span>
            <span>10 (Severe)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pain Frequency
          </label>
          <select
            value={data.painHistory?.painFrequency || 'intermittent'}
            onChange={(e) => updateData({
              painHistory: { ...data.painHistory!, painFrequency: e.target.value as any }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="constant">Constant</option>
            <option value="intermittent">Intermittent</option>
            <option value="episodic">Episodic</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When did your pain begin?
        </label>
        <input
          type="date"
          value={data.painHistory?.onsetDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => updateData({
            painHistory: { ...data.painHistory!, onsetDate: new Date(e.target.value) }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

function PsychologicalStep({ data, updateData }: { data: Partial<UserProfile>, updateData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Personality Traits (select all that apply to you)
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {PERSONALITY_TYPES.map((type) => (
            <label key={type} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.psychologicalProfile?.personalityType?.includes(type) || false}
                onChange={(e) => {
                  const current = data.psychologicalProfile?.personalityType || [];
                  const updated = e.target.checked
                    ? [...current, type]
                    : current.filter(t => t !== type);
                  updateData({
                    psychologicalProfile: { ...data.psychologicalProfile!, personalityType: updated }
                  });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700 capitalize">{type.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Current Stress Factors (select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {STRESS_FACTORS.map((factor) => (
            <label key={factor} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.psychologicalProfile?.stressFactors?.includes(factor) || false}
                onChange={(e) => {
                  const current = data.psychologicalProfile?.stressFactors || [];
                  const updated = e.target.checked
                    ? [...current, factor]
                    : current.filter(f => f !== factor);
                  updateData({
                    psychologicalProfile: { ...data.psychologicalProfile!, stressFactors: updated }
                  });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700 capitalize">{factor}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have a history of trauma or significant emotional events?
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="traumaHistory"
              checked={data.psychologicalProfile?.traumaHistory === true}
              onChange={() => updateData({
                psychologicalProfile: { ...data.psychologicalProfile!, traumaHistory: true }
              })}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="traumaHistory"
              checked={data.psychologicalProfile?.traumaHistory === false}
              onChange={() => updateData({
                psychologicalProfile: { ...data.psychologicalProfile!, traumaHistory: false }
              })}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Life Stressors (describe any current challenges)
        </label>
        <textarea
          value={data.psychologicalProfile?.currentLifeStressors?.join(', ') || ''}
          onChange={(e) => updateData({
            psychologicalProfile: { 
              ...data.psychologicalProfile!, 
              currentLifeStressors: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Describe any current sources of stress in your life..."
        />
      </div>
    </div>
  );
}

function MedicalHistoryStep({ data, updateData }: { data: Partial<UserProfile>, updateData: (updates: Partial<UserProfile>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Previous Diagnoses
        </label>
        <textarea
          value={data.painHistory?.previousDiagnoses?.join(', ') || ''}
          onChange={(e) => updateData({
            painHistory: { 
              ...data.painHistory!, 
              previousDiagnoses: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="List any previous diagnoses you've received for your pain..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Previous Treatments
        </label>
        <textarea
          value={data.painHistory?.previousTreatments?.join(', ') || ''}
          onChange={(e) => updateData({
            painHistory: { 
              ...data.painHistory!, 
              previousTreatments: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="List treatments you've tried (physical therapy, medications, surgery, etc.)..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other Medical History
        </label>
        <textarea
          value={data.painHistory?.medicalHistory?.join(', ') || ''}
          onChange={(e) => updateData({
            painHistory: { 
              ...data.painHistory!, 
              medicalHistory: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Any other relevant medical conditions or history..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pain Triggers (what seems to make your pain worse?)
        </label>
        <textarea
          value={data.painHistory?.triggers?.join(', ') || ''}
          onChange={(e) => updateData({
            painHistory: { 
              ...data.painHistory!, 
              triggers: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Stress, physical activity, weather, emotions, etc..."
        />
      </div>
    </div>
  );
}
