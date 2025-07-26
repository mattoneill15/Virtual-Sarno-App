export interface RedFlag {
  id: string;
  category: 'medical' | 'psychological' | 'symptom' | 'duration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  requiresImmediateAttention: boolean;
  medicalConsultationRequired: boolean;
  contraindications?: string[];
}

export interface SafetyCheck {
  id: string;
  type: 'pre_assessment' | 'ongoing_monitoring' | 'symptom_change' | 'emergency';
  triggers: string[];
  questions: SafetyQuestion[];
  actions: SafetyAction[];
}

export interface SafetyQuestion {
  id: string;
  question: string;
  type: 'yes_no' | 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  redFlagTriggers?: {
    condition: string;
    flagId: string;
  }[];
  required: true;
}

export interface SafetyAction {
  id: string;
  type: 'show_warning' | 'require_acknowledgment' | 'redirect_to_medical' | 'disable_features' | 'emergency_contact';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired: boolean;
  timeoutMinutes?: number;
}

export interface DisclaimerContent {
  id: string;
  type: 'general' | 'medical' | 'educational' | 'liability' | 'privacy';
  title: string;
  content: string;
  requiresAcknowledgment: boolean;
  version: string;
  lastUpdated: Date;
  applicablePages?: string[];
}

export interface UserSafetyProfile {
  userId: string;
  acknowledgedDisclaimers: string[];
  redFlagsTriggered: {
    flagId: string;
    triggeredAt: Date;
    acknowledged: boolean;
    medicalConsultationSought?: boolean;
  }[];
  safetyChecksCompleted: {
    checkId: string;
    completedAt: Date;
    responses: Record<string, any>;
    outcome: 'safe' | 'caution' | 'medical_required' | 'emergency';
  }[];
  emergencyContacts: EmergencyContact[];
  medicalClearance?: {
    providedBy: string;
    date: Date;
    notes: string;
    validUntil?: Date;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  isHealthcareProvider: boolean;
}

export interface SafetyAlert {
  id: string;
  type: 'warning' | 'caution' | 'info' | 'emergency';
  title: string;
  message: string;
  actions: {
    label: string;
    action: 'acknowledge' | 'contact_doctor' | 'call_emergency' | 'dismiss';
    isPrimary: boolean;
  }[];
  persistent: boolean;
  expiresAt?: Date;
}

export interface ClinicalGuidelines {
  tmsEligibilityCriteria: {
    included: string[];
    excluded: string[];
    requiresMedicalClearance: string[];
  };
  symptomMonitoring: {
    redFlagSymptoms: string[];
    progressionConcerns: string[];
    emergencySymptoms: string[];
  };
  treatmentLimitations: {
    maxDurationWeeks: number;
    requiredBreaks: string[];
    contraindicatedConditions: string[];
  };
  professionalReferralCriteria: string[];
}
