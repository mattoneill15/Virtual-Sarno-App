import { RedFlag, SafetyCheck, UserSafetyProfile, SafetyAlert } from '@/types/safety';
import { RED_FLAGS, SAFETY_CHECKS, CLINICAL_GUIDELINES } from '@/data/safety';
import { UserProfile, TreatmentProgress } from '@/types';

export class SafetyMonitoringSystem {
  private userSafetyProfile: UserSafetyProfile;

  constructor(userId: string, initialProfile?: Partial<UserSafetyProfile>) {
    this.userSafetyProfile = {
      userId,
      acknowledgedDisclaimers: [],
      redFlagsTriggered: [],
      safetyChecksCompleted: [],
      emergencyContacts: [],
      ...initialProfile
    };
  }

  public getUserSafetyProfile(): UserSafetyProfile {
    return { ...this.userSafetyProfile };
  }

  public updateSafetyProfile(updates: Partial<UserSafetyProfile>): void {
    this.userSafetyProfile = { ...this.userSafetyProfile, ...updates };
  }

  // Check for red flags based on assessment responses
  public checkAssessmentRedFlags(assessmentResponses: Record<string, any>): RedFlag[] {
    const triggeredFlags: RedFlag[] = [];

    // Check pre-assessment safety questions
    const preAssessmentCheck = SAFETY_CHECKS.find(check => check.id === 'pre_assessment_screening');
    if (preAssessmentCheck) {
      for (const question of preAssessmentCheck.questions) {
        const response = assessmentResponses[question.id];
        
        if (question.redFlagTriggers) {
          for (const trigger of question.redFlagTriggers) {
            if (this.evaluateCondition(response, trigger.condition)) {
              const redFlag = RED_FLAGS.find(flag => flag.id === trigger.flagId);
              if (redFlag) {
                triggeredFlags.push(redFlag);
                this.recordRedFlag(redFlag.id);
              }
            }
          }
        }
      }
    }

    // Additional red flag checks based on specific assessment data
    this.checkMedicalHistoryFlags(assessmentResponses, triggeredFlags);
    this.checkSymptomFlags(assessmentResponses, triggeredFlags);
    this.checkPsychologicalFlags(assessmentResponses, triggeredFlags);

    return triggeredFlags;
  }

  // Monitor ongoing symptoms and progress
  public monitorOngoingSymptoms(
    painLevels: number[], 
    symptomChanges: string[], 
    treatmentProgress: TreatmentProgress
  ): SafetyAlert[] {
    const alerts: SafetyAlert[] = [];

    // Check for worsening symptoms
    if (this.isSymptomWorsening(painLevels)) {
      alerts.push(this.createWorseningSymptomAlert());
    }

    // Check for new concerning symptoms
    const concerningSymptoms = this.identifyConcerningSymptoms(symptomChanges);
    if (concerningSymptoms.length > 0) {
      alerts.push(this.createNewSymptomAlert(concerningSymptoms));
    }

    // Check treatment duration limits
    if (this.exceedsTreatmentLimits(treatmentProgress)) {
      alerts.push(this.createTreatmentLimitAlert());
    }

    // Check for lack of progress
    if (this.lacksProgress(treatmentProgress)) {
      alerts.push(this.createNoProgressAlert());
    }

    return alerts;
  }

  // Evaluate emergency situations
  public evaluateEmergencyStatus(symptoms: string[], responses: Record<string, any>): {
    isEmergency: boolean;
    emergencyType: 'medical' | 'psychological' | null;
    recommendedAction: string;
    redFlags: RedFlag[];
  } {
    const emergencyRedFlags: RedFlag[] = [];

    // Check for critical medical red flags
    const criticalMedicalFlags = RED_FLAGS.filter(flag => 
      flag.severity === 'critical' && 
      flag.category === 'medical' &&
      flag.requiresImmediateAttention
    );

    // Check for psychological emergencies
    const psychologicalEmergencyFlags = RED_FLAGS.filter(flag =>
      flag.severity === 'critical' &&
      flag.category === 'psychological'
    );

    // Evaluate symptoms against emergency criteria
    for (const symptom of symptoms) {
      if (CLINICAL_GUIDELINES.symptomMonitoring.emergencySymptoms.includes(symptom)) {
        const relatedFlag = RED_FLAGS.find(flag => 
          flag.description.toLowerCase().includes(symptom.toLowerCase()) ||
          flag.title.toLowerCase().includes(symptom.toLowerCase())
        );
        if (relatedFlag) {
          emergencyRedFlags.push(relatedFlag);
        }
      }
    }

    // Check specific emergency responses
    if (responses.suicidal_ideation === 'yes' || responses.suicidal_thoughts === true) {
      const suicidalFlag = RED_FLAGS.find(flag => flag.id === 'suicidal_ideation');
      if (suicidalFlag) emergencyRedFlags.push(suicidalFlag);
    }

    const isEmergency = emergencyRedFlags.length > 0;
    const hasMedicalEmergency = emergencyRedFlags.some(flag => flag.category === 'medical');
    const hasPsychologicalEmergency = emergencyRedFlags.some(flag => flag.category === 'psychological');

    return {
      isEmergency,
      emergencyType: hasMedicalEmergency ? 'medical' : hasPsychologicalEmergency ? 'psychological' : null,
      recommendedAction: this.getEmergencyRecommendation(emergencyRedFlags),
      redFlags: emergencyRedFlags
    };
  }

  // Check if user meets TMS eligibility criteria
  public checkTMSEligibility(userProfile: UserProfile): {
    isEligible: boolean;
    concerns: string[];
    requiresMedicalClearance: boolean;
    excludedReasons: string[];
  } {
    const concerns: string[] = [];
    const excludedReasons: string[] = [];
    let requiresMedicalClearance = false;

    // Check exclusion criteria
    const medicalHistory = userProfile.medicalHistory || {};
    
    if (medicalHistory.recentTrauma) {
      excludedReasons.push('Recent trauma or injury');
    }

    if (medicalHistory.structuralAbnormalities) {
      excludedReasons.push('Confirmed structural abnormalities requiring treatment');
    }

    if (medicalHistory.activeInfection) {
      excludedReasons.push('Active infection or inflammation');
    }

    if (medicalHistory.cancerHistory) {
      concerns.push('History of cancer - requires medical clearance');
      requiresMedicalClearance = true;
    }

    if (medicalHistory.previousSpinalSurgery) {
      concerns.push('Previous spinal surgery - requires medical clearance');
      requiresMedicalClearance = true;
    }

    // Check psychological eligibility
    const psychProfile = userProfile.psychologicalProfile || {};
    
    if (psychProfile.severeMentalIllness) {
      excludedReasons.push('Severe psychiatric conditions requiring immediate treatment');
    }

    if (psychProfile.activeSubstanceAbuse) {
      excludedReasons.push('Active substance abuse');
    }

    const isEligible = excludedReasons.length === 0;

    return {
      isEligible,
      concerns,
      requiresMedicalClearance,
      excludedReasons
    };
  }

  // Generate safety recommendations
  public generateSafetyRecommendations(
    userProfile: UserProfile,
    treatmentProgress: TreatmentProgress
  ): string[] {
    const recommendations: string[] = [];

    // Check for medical clearance needs
    const eligibility = this.checkTMSEligibility(userProfile);
    if (eligibility.requiresMedicalClearance) {
      recommendations.push('Obtain medical clearance before continuing with TMS approach');
    }

    // Check for professional referral needs
    if (this.needsProfessionalReferral(treatmentProgress)) {
      recommendations.push('Consider consultation with a healthcare provider familiar with TMS');
    }

    // Check for mental health support needs
    if (this.needsMentalHealthSupport(userProfile)) {
      recommendations.push('Consider additional mental health support alongside TMS approach');
    }

    // Check for treatment modifications
    if (this.needsTreatmentModification(treatmentProgress)) {
      recommendations.push('Consider modifying treatment approach or taking a break');
    }

    return recommendations;
  }

  private evaluateCondition(value: any, condition: string): boolean {
    switch (condition) {
      case 'yes':
        return value === 'yes' || value === true;
      case 'no':
        return value === 'no' || value === false;
      default:
        return value === condition;
    }
  }

  private recordRedFlag(flagId: string): void {
    const existingFlag = this.userSafetyProfile.redFlagsTriggered.find(rf => rf.flagId === flagId);
    if (!existingFlag) {
      this.userSafetyProfile.redFlagsTriggered.push({
        flagId,
        triggeredAt: new Date(),
        acknowledged: false
      });
    }
  }

  private checkMedicalHistoryFlags(responses: Record<string, any>, triggeredFlags: RedFlag[]): void {
    if (responses.cancer_history === 'yes') {
      const flag = RED_FLAGS.find(f => f.id === 'cancer_history');
      if (flag) triggeredFlags.push(flag);
    }

    if (responses.recent_trauma === 'yes') {
      const flag = RED_FLAGS.find(f => f.id === 'trauma_history');
      if (flag) triggeredFlags.push(flag);
    }
  }

  private checkSymptomFlags(responses: Record<string, any>, triggeredFlags: RedFlag[]): void {
    if (responses.neurological_symptoms === 'yes') {
      const flag = RED_FLAGS.find(f => f.id === 'progressive_neurological');
      if (flag) triggeredFlags.push(flag);
    }

    if (responses.bowel_bladder === 'yes') {
      const flag = RED_FLAGS.find(f => f.id === 'bowel_bladder_dysfunction');
      if (flag) triggeredFlags.push(flag);
    }

    if (responses.fever_symptoms === 'yes') {
      const flag = RED_FLAGS.find(f => f.id === 'fever_with_pain');
      if (flag) triggeredFlags.push(flag);
    }
  }

  private checkPsychologicalFlags(responses: Record<string, any>, triggeredFlags: RedFlag[]): void {
    if (responses.mental_health_screening === 'yes' || responses.suicidal_thoughts === true) {
      const flag = RED_FLAGS.find(f => f.id === 'suicidal_ideation');
      if (flag) triggeredFlags.push(flag);
    }

    if (responses.severe_depression === 'yes') {
      const flag = RED_FLAGS.find(f => f.id === 'severe_depression');
      if (flag) triggeredFlags.push(flag);
    }
  }

  private isSymptomWorsening(painLevels: number[]): boolean {
    if (painLevels.length < 7) return false;
    
    const recent = painLevels.slice(-7);
    const previous = painLevels.slice(-14, -7);
    
    if (previous.length === 0) return false;
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    return recentAvg > previousAvg + 1; // Significant worsening
  }

  private identifyConcerningSymptoms(symptoms: string[]): string[] {
    return symptoms.filter(symptom => 
      CLINICAL_GUIDELINES.symptomMonitoring.redFlagSymptoms.some(redFlag =>
        symptom.toLowerCase().includes(redFlag.toLowerCase())
      )
    );
  }

  private exceedsTreatmentLimits(progress: TreatmentProgress): boolean {
    const startDate = progress.startDate;
    const weeksSinceStart = Math.floor((Date.now() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return weeksSinceStart > CLINICAL_GUIDELINES.treatmentLimitations.maxDurationWeeks;
  }

  private lacksProgress(progress: TreatmentProgress): boolean {
    // Check if there's been no improvement after 4 weeks
    const weeksSinceStart = Math.floor((Date.now() - progress.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    if (weeksSinceStart < 4) return false;

    // Check pain level trends
    const painEntries = progress.painEntries || [];
    if (painEntries.length < 14) return false;

    const recent = painEntries.slice(-7);
    const initial = painEntries.slice(0, 7);

    const recentAvg = recent.reduce((sum, entry) => sum + entry.level, 0) / recent.length;
    const initialAvg = initial.reduce((sum, entry) => sum + entry.level, 0) / initial.length;

    return recentAvg >= initialAvg; // No improvement
  }

  private needsProfessionalReferral(progress: TreatmentProgress): boolean {
    return CLINICAL_GUIDELINES.professionalReferralCriteria.some(criteria => {
      // Implement specific criteria checking logic
      return false; // Placeholder
    });
  }

  private needsMentalHealthSupport(profile: UserProfile): boolean {
    const psych = profile.psychologicalProfile;
    return psych?.depressionScore > 15 || psych?.anxietyScore > 15;
  }

  private needsTreatmentModification(progress: TreatmentProgress): boolean {
    return this.lacksProgress(progress) || this.exceedsTreatmentLimits(progress);
  }

  private getEmergencyRecommendation(redFlags: RedFlag[]): string {
    const hasCritical = redFlags.some(flag => flag.severity === 'critical');
    const hasMedical = redFlags.some(flag => flag.category === 'medical');
    const hasPsychological = redFlags.some(flag => flag.category === 'psychological');

    if (hasCritical && hasMedical) {
      return 'Call 911 or go to the nearest emergency room immediately';
    }
    
    if (hasCritical && hasPsychological) {
      return 'Call 988 (Suicide & Crisis Lifeline) or go to the nearest emergency room';
    }

    return 'Consult with a healthcare provider as soon as possible';
  }

  private createWorseningSymptomAlert(): SafetyAlert {
    return {
      id: `worsening_${Date.now()}`,
      type: 'warning',
      title: 'Symptoms Worsening',
      message: 'Your pain levels appear to be increasing. This may indicate that the TMS approach is not suitable for your condition, or that there may be other factors to consider.',
      actions: [
        { label: 'Contact Healthcare Provider', action: 'contact_doctor', isPrimary: true },
        { label: 'Acknowledge', action: 'acknowledge', isPrimary: false }
      ],
      persistent: true
    };
  }

  private createNewSymptomAlert(symptoms: string[]): SafetyAlert {
    return {
      id: `new_symptoms_${Date.now()}`,
      type: 'caution',
      title: 'New Concerning Symptoms',
      message: `You have reported new symptoms that may require medical evaluation: ${symptoms.join(', ')}`,
      actions: [
        { label: 'Seek Medical Evaluation', action: 'contact_doctor', isPrimary: true },
        { label: 'Acknowledge', action: 'acknowledge', isPrimary: false }
      ],
      persistent: true
    };
  }

  private createTreatmentLimitAlert(): SafetyAlert {
    return {
      id: `treatment_limit_${Date.now()}`,
      type: 'info',
      title: 'Treatment Duration Limit',
      message: 'You have been using the TMS approach for an extended period. Consider taking a break and consulting with a healthcare provider.',
      actions: [
        { label: 'Schedule Consultation', action: 'contact_doctor', isPrimary: true },
        { label: 'Continue with Caution', action: 'acknowledge', isPrimary: false }
      ],
      persistent: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
  }

  private createNoProgressAlert(): SafetyAlert {
    return {
      id: `no_progress_${Date.now()}`,
      type: 'caution',
      title: 'Limited Progress',
      message: 'You have not seen significant improvement after several weeks. The TMS approach may not be suitable for your condition.',
      actions: [
        { label: 'Consult Healthcare Provider', action: 'contact_doctor', isPrimary: true },
        { label: 'Continue Current Approach', action: 'acknowledge', isPrimary: false }
      ],
      persistent: false
    };
  }
}
