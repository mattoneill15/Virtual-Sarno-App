import { UserProfile, PERSONALITY_TYPES, STRESS_FACTORS } from '@/types';

// TMS Assessment Logic based on Dr. Sarno's criteria
export class TMSAssessment {
  
  /**
   * Calculate TMS likelihood based on Sarno's criteria
   */
  static calculateTMSLikelihood(profile: UserProfile): number {
    let score = 0;
    let maxScore = 0;

    // Personality factors (40% weight)
    const personalityScore = this.assessPersonalityFactors(profile.psychologicalProfile);
    score += personalityScore * 0.4;
    maxScore += 100 * 0.4;

    // Pain characteristics (30% weight)
    const painScore = this.assessPainCharacteristics(profile.painHistory);
    score += painScore * 0.3;
    maxScore += 100 * 0.3;

    // Stress factors (20% weight)
    const stressScore = this.assessStressFactors(profile.psychologicalProfile);
    score += stressScore * 0.2;
    maxScore += 100 * 0.2;

    // Medical history (10% weight)
    const medicalScore = this.assessMedicalHistory(profile.painHistory);
    score += medicalScore * 0.1;
    maxScore += 100 * 0.1;

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Assess personality factors that predispose to TMS
   */
  private static assessPersonalityFactors(psychProfile: UserProfile['psychologicalProfile']): number {
    let score = 0;
    const maxScore = 100;

    // High-risk personality types
    const highRiskTypes = ['perfectionist', 'people-pleaser', 'highly responsible', 'goodist'];
    const userHighRiskTypes = psychProfile.personalityType.filter(type => 
      highRiskTypes.includes(type)
    );
    
    // Score based on number of high-risk personality traits
    score += (userHighRiskTypes.length / highRiskTypes.length) * 60;

    // Additional factors
    if (psychProfile.personalityType.includes('self-critical')) score += 15;
    if (psychProfile.personalityType.includes('achievement-oriented')) score += 10;
    
    // Coping mechanisms that suggest repression
    const repressionIndicators = ['workaholism', 'people-pleasing', 'perfectionism'];
    const userRepressionIndicators = psychProfile.copingMechanisms.filter(mechanism =>
      repressionIndicators.some(indicator => mechanism.toLowerCase().includes(indicator))
    );
    score += (userRepressionIndicators.length / repressionIndicators.length) * 15;

    return Math.min(score, maxScore);
  }

  /**
   * Assess pain characteristics typical of TMS
   */
  private static assessPainCharacteristics(painHistory: UserProfile['painHistory']): number {
    let score = 0;
    const maxScore = 100;

    // TMS-typical pain locations
    const tmsLocations = ['lower back', 'upper back', 'neck', 'shoulders'];
    const userTMSLocations = painHistory.painLocations.filter(location =>
      tmsLocations.includes(location)
    );
    score += (userTMSLocations.length / tmsLocations.length) * 30;

    // Pain frequency patterns
    if (painHistory.painFrequency === 'intermittent') score += 25;
    if (painHistory.painFrequency === 'episodic') score += 20;
    if (painHistory.painFrequency === 'constant') score += 10;

    // Trigger patterns
    const tmsTriggers = ['stress', 'emotional events', 'work pressure', 'relationship issues'];
    const userTMSTriggers = painHistory.triggers.filter(trigger =>
      tmsTriggers.some(tmsTrigger => trigger.toLowerCase().includes(tmsTrigger.toLowerCase()))
    );
    score += (userTMSTriggers.length / tmsTriggers.length) * 25;

    // Pain intensity variability (TMS often fluctuates)
    if (painHistory.painIntensity >= 6) score += 10; // Significant pain
    
    // Multiple pain locations (TMS often migrates)
    if (painHistory.painLocations.length > 1) score += 10;

    return Math.min(score, maxScore);
  }

  /**
   * Assess current stress factors
   */
  private static assessStressFactors(psychProfile: UserProfile['psychologicalProfile']): number {
    let score = 0;
    const maxScore = 100;

    // High-stress factors
    const highStressFactors = ['work pressure', 'relationship issues', 'financial stress', 'perfectionism'];
    const userHighStressFactors = psychProfile.stressFactors.filter(factor =>
      highStressFactors.includes(factor)
    );
    score += (userHighStressFactors.length / highStressFactors.length) * 50;

    // Current life stressors
    score += Math.min(psychProfile.currentLifeStressors.length * 10, 30);

    // Trauma history
    if (psychProfile.traumaHistory) score += 20;

    return Math.min(score, maxScore);
  }

  /**
   * Assess medical history for TMS indicators
   */
  private static assessMedicalHistory(painHistory: UserProfile['painHistory']): number {
    let score = 0;
    const maxScore = 100;

    // Multiple failed treatments suggest non-structural cause
    if (painHistory.previousTreatments.length > 2) score += 30;

    // Vague or inconsistent diagnoses
    const vagueTerms = ['chronic pain', 'fibromyalgia', 'tension', 'strain', 'spasm'];
    const vageDiagnoses = painHistory.previousDiagnoses.filter(diagnosis =>
      vagueTerms.some(term => diagnosis.toLowerCase().includes(term))
    );
    score += (vageDiagnoses.length / Math.max(painHistory.previousDiagnoses.length, 1)) * 40;

    // No clear structural findings
    if (painHistory.previousDiagnoses.length === 0) score += 30;

    return Math.min(score, maxScore);
  }

  /**
   * Calculate Sarno compatibility score
   */
  static calculateSarnoCompatibility(profile: UserProfile): number {
    let score = 0;
    const maxScore = 100;

    // Age factor (TMS more common in working adults)
    if (profile.personalInfo.age >= 25 && profile.personalInfo.age <= 65) score += 20;

    // Occupation stress
    const stressfulOccupations = ['executive', 'manager', 'doctor', 'lawyer', 'teacher', 'healthcare'];
    if (stressfulOccupations.some(occ => 
      profile.personalInfo.occupation.toLowerCase().includes(occ)
    )) score += 15;

    // Lifestyle factors
    if (profile.personalInfo.lifestyle === 'very active') score += 10;
    if (profile.personalInfo.lifestyle === 'active') score += 15;

    // Personality alignment with Sarno's typical patient
    const sarnoPersonality = ['perfectionist', 'people-pleaser', 'highly responsible'];
    const matches = profile.psychologicalProfile.personalityType.filter(type =>
      sarnoPersonality.includes(type)
    );
    score += (matches.length / sarnoPersonality.length) * 35;

    // Pain pattern alignment
    if (profile.painHistory.painFrequency !== 'constant') score += 10;
    if (profile.painHistory.triggers.some(trigger => 
      trigger.toLowerCase().includes('stress')
    )) score += 10;

    return Math.min(score, maxScore);
  }

  /**
   * Identify red flags that require medical attention
   */
  static identifyRedFlags(profile: UserProfile): string[] {
    const redFlags: string[] = [];

    // Age-related red flags
    if (profile.personalInfo.age > 70) {
      redFlags.push('Age over 70 - increased risk of serious conditions');
    }

    // Pain characteristics red flags
    if (profile.painHistory.painIntensity >= 9) {
      redFlags.push('Severe pain intensity - rule out serious pathology');
    }

    if (profile.painHistory.painFrequency === 'constant' && 
        profile.painHistory.painIntensity >= 7) {
      redFlags.push('Constant severe pain - requires medical evaluation');
    }

    // Symptom red flags
    const seriousSymptoms = ['numbness', 'weakness', 'bowel', 'bladder', 'fever'];
    const userSeriousSymptoms = profile.painHistory.primarySymptoms.filter(symptom =>
      seriousSymptoms.some(serious => symptom.toLowerCase().includes(serious))
    );
    
    if (userSeriousSymptoms.length > 0) {
      redFlags.push('Neurological symptoms present - medical clearance required');
    }

    // Recent onset with severe symptoms
    const onsetRecent = new Date().getTime() - profile.painHistory.onsetDate.getTime() < 30 * 24 * 60 * 60 * 1000; // 30 days
    if (onsetRecent && profile.painHistory.painIntensity >= 8) {
      redFlags.push('Recent onset of severe pain - rule out acute conditions');
    }

    return redFlags;
  }

  /**
   * Generate personalized recommendations
   */
  static generateRecommendations(profile: UserProfile): string[] {
    const recommendations: string[] = [];
    const tmsLikelihood = this.calculateTMSLikelihood(profile);

    if (tmsLikelihood >= 70) {
      recommendations.push('High likelihood of TMS - begin education phase immediately');
      recommendations.push('Focus on understanding the mind-body connection');
      recommendations.push('Start daily journaling to explore emotional patterns');
    } else if (tmsLikelihood >= 40) {
      recommendations.push('Moderate likelihood of TMS - continue assessment');
      recommendations.push('Consider medical evaluation to rule out structural issues');
      recommendations.push('Begin stress management techniques');
    } else {
      recommendations.push('Lower likelihood of TMS - medical evaluation recommended');
      recommendations.push('Focus on conventional treatment approaches');
      recommendations.push('Monitor for psychological factors');
    }

    // Personality-specific recommendations
    if (profile.psychologicalProfile.personalityType.includes('perfectionist')) {
      recommendations.push('Address perfectionist tendencies through cognitive work');
    }

    if (profile.psychologicalProfile.personalityType.includes('people-pleaser')) {
      recommendations.push('Practice setting boundaries and expressing needs');
    }

    return recommendations;
  }
}
