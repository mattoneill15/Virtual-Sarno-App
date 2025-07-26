import { 
  VirtualSarnoMessage, 
  ConversationContext, 
  SarnoResponse,
  VirtualSarnoConfig 
} from '@/types/virtualSarno';
import { 
  SARNO_KNOWLEDGE_BASE, 
  VIRTUAL_SARNO_CONFIG, 
  SARNO_EXPRESSIONS,
  SARNO_TECHNIQUES 
} from '@/data/virtualSarno';
import { SafetyMonitoringSystem } from './safetyMonitoring';

export class VirtualSarnoAI {
  private config: VirtualSarnoConfig;
  private safetyMonitor: SafetyMonitoringSystem;
  private conversationHistory: Map<string, VirtualSarnoMessage[]> = new Map();

  constructor(config: VirtualSarnoConfig = VIRTUAL_SARNO_CONFIG) {
    this.config = config;
    this.safetyMonitor = new SafetyMonitoringSystem();
  }

  async generateResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<SarnoResponse> {
    // Safety check first
    const safetyCheck = await this.checkSafety(userMessage, context);
    if (safetyCheck.requiresIntervention) {
      return this.generateSafetyResponse(safetyCheck);
    }

    // Analyze user message
    const analysis = this.analyzeUserMessage(userMessage, context);
    
    // Find relevant knowledge
    const relevantKnowledge = this.findRelevantKnowledge(analysis);
    
    // Generate personalized response
    const response = this.craftSarnoResponse(
      userMessage,
      analysis,
      relevantKnowledge,
      context
    );

    // Store conversation
    this.storeConversation(context.sessionId, {
      id: this.generateId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      context: {
        currentPhase: context.currentPhase,
        emotionalState: context.emotionalState,
        sessionType: this.determineSessionType(userMessage, context)
      }
    });

    this.storeConversation(context.sessionId, {
      id: this.generateId(),
      role: 'sarno',
      content: response.message,
      timestamp: new Date(),
      context: {
        currentPhase: context.currentPhase,
        emotionalState: context.emotionalState
      },
      metadata: {
        confidence: response.confidence,
        recommendations: response.recommendations,
        redFlags: response.redFlags
      }
    });

    return response;
  }

  private async checkSafety(
    message: string,
    context: ConversationContext
  ): Promise<{ requiresIntervention: boolean; type?: string; message?: string }> {
    // Check for crisis language
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living',
      'hurt myself', 'self-harm', 'overdose', 'can\'t go on'
    ];
    
    const hasCrisisLanguage = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (hasCrisisLanguage) {
      return {
        requiresIntervention: true,
        type: 'crisis',
        message: 'I\'m very concerned about what you\'ve shared. These feelings are serious and require immediate professional help.'
      };
    }

    // Check for medical red flags
    const medicalKeywords = [
      'fever', 'infection', 'bladder', 'bowel', 'weakness getting worse',
      'can\'t walk', 'numbness spreading', 'emergency', 'accident'
    ];

    const hasMedicalConcerns = medicalKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (hasMedicalConcerns) {
      return {
        requiresIntervention: true,
        type: 'medical',
        message: 'Based on what you\'ve described, this may require immediate medical attention.'
      };
    }

    return { requiresIntervention: false };
  }

  private generateSafetyResponse(safetyCheck: any): SarnoResponse {
    if (safetyCheck.type === 'crisis') {
      return {
        message: `${safetyCheck.message} Please reach out for help immediately:

🆘 **Crisis Resources:**
• **988 Suicide & Crisis Lifeline**: Call or text 988
• **Emergency Services**: Call 911
• **Crisis Text Line**: Text HOME to 741741

While TMS and emotional healing are important, your immediate safety comes first. Please contact one of these resources right now. You don't have to face this alone, and there are people who want to help you through this difficult time.

I care about your wellbeing, and I want you to get the support you need right now.`,
        confidence: 1.0,
        reasoning: 'Crisis intervention required - immediate professional help needed',
        redFlags: ['crisis_language', 'suicide_risk'],
        resources: [
          {
            type: 'referral',
            title: '988 Suicide & Crisis Lifeline',
            description: 'Free and confidential emotional support 24/7',
            url: 'tel:988'
          }
        ]
      };
    }

    if (safetyCheck.type === 'medical') {
      return {
        message: `${safetyCheck.message} While I believe strongly in the mind-body connection and TMS, certain symptoms require immediate medical evaluation to rule out serious conditions.

🏥 **Please seek medical attention if you have:**
• Fever with back pain (possible infection)
• Progressive weakness or numbness
• Bowel or bladder problems
• Severe pain after trauma/injury

You can explore TMS after ensuring there's no structural emergency. Your safety comes first, and a proper medical evaluation will give you peace of mind to focus on TMS healing if appropriate.`,
        confidence: 1.0,
        reasoning: 'Medical red flags detected - professional evaluation needed',
        redFlags: ['medical_emergency'],
        resources: [
          {
            type: 'referral',
            title: 'Emergency Medical Care',
            description: 'Seek immediate medical evaluation',
            url: 'tel:911'
          }
        ]
      };
    }

    return {
      message: 'I want to ensure your safety first before we continue our discussion.',
      confidence: 1.0,
      reasoning: 'Safety concern identified'
    };
  }

  private analyzeUserMessage(
    message: string,
    context: ConversationContext
  ): {
    intent: string;
    emotions: string[];
    keywords: string[];
    urgency: 'low' | 'medium' | 'high';
    category: string;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Detect intent
    let intent = 'general_question';
    if (lowerMessage.includes('how') || lowerMessage.includes('what')) {
      intent = 'information_seeking';
    } else if (lowerMessage.includes('should i') || lowerMessage.includes('what do')) {
      intent = 'advice_seeking';
    } else if (lowerMessage.includes('pain') && lowerMessage.includes('worse')) {
      intent = 'symptom_concern';
    } else if (lowerMessage.includes('afraid') || lowerMessage.includes('scared')) {
      intent = 'fear_expression';
    }

    // Detect emotions
    const emotions: string[] = [];
    if (lowerMessage.includes('frustrated') || lowerMessage.includes('angry')) emotions.push('anger');
    if (lowerMessage.includes('scared') || lowerMessage.includes('afraid')) emotions.push('fear');
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) emotions.push('sadness');
    if (lowerMessage.includes('hopeless') || lowerMessage.includes('giving up')) emotions.push('despair');
    if (lowerMessage.includes('better') || lowerMessage.includes('improving')) emotions.push('hope');

    // Extract keywords
    const keywords = message.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['that', 'this', 'with', 'have', 'been', 'will'].includes(word)
    );

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) urgency = 'high';
    else if (lowerMessage.includes('worried') || lowerMessage.includes('concerned')) urgency = 'medium';

    // Categorize
    let category = 'general';
    if (lowerMessage.includes('pain') || lowerMessage.includes('symptom')) category = 'symptoms';
    else if (lowerMessage.includes('exercise') || lowerMessage.includes('activity')) category = 'treatment';
    else if (lowerMessage.includes('emotion') || lowerMessage.includes('angry')) category = 'emotions';
    else if (lowerMessage.includes('doctor') || lowerMessage.includes('medical')) category = 'medical';

    return { intent, emotions, keywords, urgency, category };
  }

  private findRelevantKnowledge(analysis: any): any {
    const { category, keywords } = analysis;
    
    // Find matching common questions
    const relevantQuestions = SARNO_KNOWLEDGE_BASE.commonQuestions.filter(q => 
      q.category === category || 
      q.keywords.some(keyword => keywords.includes(keyword))
    );

    // Find relevant core teachings
    const relevantTeachings = Object.entries(SARNO_KNOWLEDGE_BASE.coreTeachings)
      .filter(([key]) => 
        keywords.some(keyword => key.includes(keyword) || keyword.includes(key))
      );

    // Find relevant cases
    const relevantCases = SARNO_KNOWLEDGE_BASE.casesAndExamples.filter(example =>
      example.category === category ||
      keywords.some(keyword => example.scenario.toLowerCase().includes(keyword))
    );

    return {
      questions: relevantQuestions.slice(0, 2),
      teachings: relevantTeachings.slice(0, 3),
      cases: relevantCases.slice(0, 1)
    };
  }

  private craftSarnoResponse(
    userMessage: string,
    analysis: any,
    knowledge: any,
    context: ConversationContext
  ): SarnoResponse {
    let response = '';
    let confidence = 0.7;
    const recommendations: string[] = [];

    // Start with empathy and validation
    if (analysis.emotions.includes('fear')) {
      response += "I understand your fear - it's completely natural when dealing with chronic pain. ";
      confidence += 0.1;
    } else if (analysis.emotions.includes('anger')) {
      response += "Your frustration is understandable, and actually, that anger you're feeling is very important to acknowledge. ";
      confidence += 0.1;
    } else if (analysis.emotions.includes('despair')) {
      response += "I hear the discouragement in your words. Many of my patients have felt exactly as you do right now. ";
      confidence += 0.1;
    }

    // Add personalized greeting if first interaction
    if (context.conversationHistory.length === 0) {
      response += `Hello${context.userProfile.name ? ` ${context.userProfile.name}` : ''}. `;
    }

    // Use relevant knowledge to craft response
    if (knowledge.questions.length > 0) {
      const bestMatch = knowledge.questions[0];
      response += bestMatch.response + ' ';
      confidence += 0.2;
    } else if (knowledge.teachings.length > 0) {
      const [teachingKey, teachings] = knowledge.teachings[0];
      response += teachings[0] + ' ';
      confidence += 0.15;
    }

    // Add case example if relevant
    if (knowledge.cases.length > 0) {
      response += '\n\n' + knowledge.cases[0].sarnoResponse;
      confidence += 0.1;
    }

    // Add practical recommendations based on analysis
    if (analysis.category === 'symptoms') {
      recommendations.push('Resume normal physical activities gradually');
      recommendations.push('Practice daily emotional awareness exercises');
      response += '\n\nRemember: the pain is real, but it\'s not structural. Your body is not damaged.';
    } else if (analysis.category === 'emotions') {
      recommendations.push('Start a daily emotion journal');
      recommendations.push('Practice the "talking to your brain" technique');
      response += '\n\nWhat you\'re feeling is the key to your healing. Don\'t push these emotions away - acknowledge them.';
    } else if (analysis.category === 'treatment') {
      recommendations.push('Stop treatments that reinforce structural thinking');
      recommendations.push('Focus on psychological approaches instead');
    }

    // Add a signature Sarno expression
    const randomExpression = SARNO_EXPRESSIONS[Math.floor(Math.random() * SARNO_EXPRESSIONS.length)];
    response += '\n\n' + randomExpression;

    // Suggest follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(analysis, context);

    return {
      message: response.trim(),
      confidence: Math.min(confidence, 1.0),
      reasoning: `Responded to ${analysis.intent} about ${analysis.category} with ${knowledge.questions.length + knowledge.teachings.length} relevant knowledge pieces`,
      recommendations,
      followUpQuestions,
      resources: this.suggestResources(analysis)
    };
  }

  private generateFollowUpQuestions(analysis: any, context: ConversationContext): string[] {
    const questions: string[] = [];
    
    if (analysis.category === 'symptoms') {
      questions.push('What emotions were you experiencing when the pain first started?');
      questions.push('Have you noticed if the pain changes with stress levels?');
    } else if (analysis.category === 'emotions') {
      questions.push('What situations make you feel most angry or frustrated?');
      questions.push('Do you consider yourself a perfectionist or people-pleaser?');
    } else if (analysis.category === 'treatment') {
      questions.push('What activities have you stopped doing because of the pain?');
      questions.push('How do you feel about the idea of resuming normal activities?');
    }

    return questions.slice(0, 2);
  }

  private suggestResources(analysis: any): any[] {
    const resources: any[] = [];

    if (analysis.category === 'emotions') {
      resources.push({
        type: 'technique',
        title: 'Emotion Journaling',
        description: 'Daily practice to identify and process repressed emotions',
        url: '/techniques/emotion-journaling'
      });
    }

    if (analysis.category === 'symptoms') {
      resources.push({
        type: 'exercise',
        title: 'Talking to Your Brain',
        description: 'Direct communication with your unconscious mind',
        url: '/techniques/talking-to-brain'
      });
    }

    return resources;
  }

  private determineSessionType(message: string, context: ConversationContext): string {
    if (context.urgencyLevel === 'high') return 'crisis';
    if (context.conversationHistory.length === 0) return 'consultation';
    if (message.toLowerCase().includes('follow up') || message.toLowerCase().includes('update')) return 'follow_up';
    return 'general';
  }

  private storeConversation(sessionId: string, message: VirtualSarnoMessage): void {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    this.conversationHistory.get(sessionId)!.push(message);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public method to get conversation history
  getConversationHistory(sessionId: string): VirtualSarnoMessage[] {
    return this.conversationHistory.get(sessionId) || [];
  }

  // Public method to clear conversation history
  clearConversationHistory(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
  }
}
