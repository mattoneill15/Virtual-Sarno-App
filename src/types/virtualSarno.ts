export interface VirtualSarnoMessage {
  id: string;
  role: 'user' | 'sarno';
  content: string;
  timestamp: Date;
  context?: {
    userProfile?: any;
    currentPhase?: 'assessment' | 'education' | 'treatment' | 'maintenance';
    painLevel?: number;
    recentSymptoms?: string[];
    emotionalState?: string;
    sessionType?: 'consultation' | 'follow_up' | 'crisis' | 'general';
  };
  metadata?: {
    confidence?: number;
    sources?: string[];
    redFlags?: string[];
    recommendations?: string[];
  };
}

export interface VirtualSarnoPersonality {
  traits: {
    authoritative: number; // 0-1 scale
    compassionate: number;
    direct: number;
    educational: number;
    reassuring: number;
  };
  communicationStyle: {
    tone: 'professional' | 'warm' | 'direct' | 'encouraging';
    formality: 'formal' | 'conversational' | 'friendly';
    responseLength: 'concise' | 'detailed' | 'comprehensive';
  };
  expertise: {
    primaryFocus: string[];
    specializations: string[];
    limitations: string[];
  };
}

export interface SarnoKnowledgeBase {
  coreTeachings: {
    tmsTheory: string[];
    mindBodyConnection: string[];
    psychologicalFactors: string[];
    treatmentApproach: string[];
  };
  commonQuestions: {
    question: string;
    response: string;
    category: string;
    keywords: string[];
  }[];
  casesAndExamples: {
    scenario: string;
    sarnoResponse: string;
    category: string;
    applicableConditions: string[];
  }[];
  contraindications: {
    condition: string;
    response: string;
    referralNeeded: boolean;
  }[];
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  startTime: Date;
  currentPhase: 'assessment' | 'education' | 'treatment' | 'maintenance';
  userProfile: {
    name?: string;
    painHistory: any;
    psychologicalProfile: any;
    treatmentProgress: any;
  };
  conversationHistory: VirtualSarnoMessage[];
  currentTopics: string[];
  emotionalState: 'calm' | 'anxious' | 'frustrated' | 'hopeful' | 'discouraged';
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
}

export interface SarnoResponse {
  message: string;
  confidence: number;
  reasoning: string;
  recommendations?: string[];
  followUpQuestions?: string[];
  redFlags?: string[];
  resources?: {
    type: 'book' | 'exercise' | 'technique' | 'referral';
    title: string;
    description: string;
    url?: string;
  }[];
}

export interface VirtualSarnoConfig {
  personality: VirtualSarnoPersonality;
  responseSettings: {
    maxResponseLength: number;
    includeReferences: boolean;
    personalizeResponses: boolean;
    detectEmotions: boolean;
    providePracticalAdvice: boolean;
  };
  safetySettings: {
    detectCrisisLanguage: boolean;
    flagMedicalConcerns: boolean;
    requireDisclaimers: boolean;
    limitAdviceScope: boolean;
  };
  learningSettings: {
    adaptToUser: boolean;
    rememberPreferences: boolean;
    trackProgress: boolean;
    improveResponses: boolean;
  };
}
