import { RedFlag, SafetyCheck, DisclaimerContent, ClinicalGuidelines } from '@/types/safety';

export const RED_FLAGS: RedFlag[] = [
  // Critical Medical Red Flags
  {
    id: 'progressive_neurological',
    category: 'medical',
    severity: 'critical',
    title: 'Progressive Neurological Symptoms',
    description: 'Weakness, numbness, or loss of function that is worsening over time',
    recommendation: 'Seek immediate medical evaluation. Do not delay.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true,
    contraindications: ['TMS treatment should be suspended until medical clearance']
  },
  {
    id: 'bowel_bladder_dysfunction',
    category: 'medical',
    severity: 'critical',
    title: 'Bowel or Bladder Dysfunction',
    description: 'New onset incontinence or retention of urine/stool',
    recommendation: 'This may indicate cauda equina syndrome. Seek emergency medical care immediately.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true,
    contraindications: ['Emergency medical evaluation required']
  },
  {
    id: 'fever_with_pain',
    category: 'medical',
    severity: 'high',
    title: 'Fever with Back Pain',
    description: 'Fever accompanying back pain, especially with night sweats',
    recommendation: 'May indicate infection or other serious condition. Consult physician promptly.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true
  },
  {
    id: 'trauma_history',
    category: 'medical',
    severity: 'high',
    title: 'Recent Trauma or Injury',
    description: 'Pain following recent accident, fall, or physical trauma',
    recommendation: 'Physical causes must be ruled out before considering TMS approach.',
    requiresImmediateAttention: false,
    medicalConsultationRequired: true
  },
  {
    id: 'cancer_history',
    category: 'medical',
    severity: 'high',
    title: 'History of Cancer',
    description: 'Personal history of cancer, especially with new or changing pain patterns',
    recommendation: 'Medical evaluation required to rule out metastases or recurrence.',
    requiresImmediateAttention: false,
    medicalConsultationRequired: true
  },

  // Psychological Red Flags
  {
    id: 'suicidal_ideation',
    category: 'psychological',
    severity: 'critical',
    title: 'Suicidal Thoughts or Plans',
    description: 'Thoughts of self-harm or suicide',
    recommendation: 'Contact emergency services (988 Suicide & Crisis Lifeline) or go to nearest emergency room.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true,
    contraindications: ['Requires immediate professional mental health intervention']
  },
  {
    id: 'severe_depression',
    category: 'psychological',
    severity: 'high',
    title: 'Severe Depression',
    description: 'Persistent feelings of hopelessness, inability to function daily',
    recommendation: 'Professional mental health evaluation recommended before continuing TMS approach.',
    requiresImmediateAttention: false,
    medicalConsultationRequired: true
  },
  {
    id: 'psychosis_symptoms',
    category: 'psychological',
    severity: 'critical',
    title: 'Psychotic Symptoms',
    description: 'Hallucinations, delusions, or severe confusion',
    recommendation: 'Immediate psychiatric evaluation required.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true
  },

  // Symptom-Based Red Flags
  {
    id: 'saddle_anesthesia',
    category: 'symptom',
    severity: 'critical',
    title: 'Saddle Anesthesia',
    description: 'Numbness in the groin, buttocks, or inner thighs',
    recommendation: 'May indicate cauda equina syndrome. Seek emergency care immediately.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true
  },
  {
    id: 'bilateral_leg_weakness',
    category: 'symptom',
    severity: 'critical',
    title: 'Bilateral Leg Weakness',
    description: 'Weakness in both legs, difficulty walking',
    recommendation: 'Requires immediate neurological evaluation.',
    requiresImmediateAttention: true,
    medicalConsultationRequired: true
  },
  {
    id: 'unexplained_weight_loss',
    category: 'symptom',
    severity: 'high',
    title: 'Unexplained Weight Loss',
    description: 'Significant weight loss without trying to lose weight',
    recommendation: 'May indicate underlying medical condition. Consult physician.',
    requiresImmediateAttention: false,
    medicalConsultationRequired: true
  },

  // Duration-Based Red Flags
  {
    id: 'worsening_despite_treatment',
    category: 'duration',
    severity: 'medium',
    title: 'Worsening Despite TMS Treatment',
    description: 'Symptoms getting worse after 4+ weeks of consistent TMS approach',
    recommendation: 'Consider medical re-evaluation and alternative approaches.',
    requiresImmediateAttention: false,
    medicalConsultationRequired: true
  }
];

export const SAFETY_CHECKS: SafetyCheck[] = [
  {
    id: 'pre_assessment_screening',
    type: 'pre_assessment',
    triggers: ['initial_assessment_start'],
    questions: [
      {
        id: 'recent_trauma',
        question: 'Have you experienced any physical trauma, accident, or injury in the past 6 months that could be related to your pain?',
        type: 'yes_no',
        required: true,
        redFlagTriggers: [
          { condition: 'yes', flagId: 'trauma_history' }
        ]
      },
      {
        id: 'neurological_symptoms',
        question: 'Are you experiencing any of the following: progressive weakness, numbness that is getting worse, loss of coordination, or difficulty with balance?',
        type: 'yes_no',
        required: true,
        redFlagTriggers: [
          { condition: 'yes', flagId: 'progressive_neurological' }
        ]
      },
      {
        id: 'bowel_bladder',
        question: 'Have you experienced any new problems with bowel or bladder control?',
        type: 'yes_no',
        required: true,
        redFlagTriggers: [
          { condition: 'yes', flagId: 'bowel_bladder_dysfunction' }
        ]
      },
      {
        id: 'fever_symptoms',
        question: 'Do you currently have fever, chills, or night sweats along with your pain?',
        type: 'yes_no',
        required: true,
        redFlagTriggers: [
          { condition: 'yes', flagId: 'fever_with_pain' }
        ]
      },
      {
        id: 'cancer_history',
        question: 'Do you have a personal history of cancer?',
        type: 'yes_no',
        required: true,
        redFlagTriggers: [
          { condition: 'yes', flagId: 'cancer_history' }
        ]
      },
      {
        id: 'mental_health_screening',
        question: 'In the past two weeks, have you had thoughts of hurting yourself or that you would be better off dead?',
        type: 'yes_no',
        required: true,
        redFlagTriggers: [
          { condition: 'yes', flagId: 'suicidal_ideation' }
        ]
      }
    ],
    actions: [
      {
        id: 'red_flag_medical_referral',
        type: 'redirect_to_medical',
        priority: 'critical',
        message: 'Based on your responses, we recommend consulting with a healthcare provider before proceeding with the TMS approach.',
        actionRequired: true
      }
    ]
  },
  {
    id: 'ongoing_symptom_monitoring',
    type: 'ongoing_monitoring',
    triggers: ['weekly_checkin', 'symptom_change_reported'],
    questions: [
      {
        id: 'symptom_progression',
        question: 'How have your symptoms changed in the past week?',
        type: 'multiple_choice',
        options: ['Significantly improved', 'Somewhat improved', 'No change', 'Somewhat worse', 'Significantly worse'],
        required: true,
        redFlagTriggers: [
          { condition: 'Significantly worse', flagId: 'worsening_despite_treatment' }
        ]
      },
      {
        id: 'new_symptoms',
        question: 'Have you developed any new symptoms since starting the TMS approach?',
        type: 'yes_no',
        required: true
      },
      {
        id: 'functional_status',
        question: 'How is your ability to perform daily activities?',
        type: 'scale',
        required: true
      }
    ],
    actions: [
      {
        id: 'symptom_worsening_warning',
        type: 'show_warning',
        priority: 'medium',
        message: 'Your symptoms appear to be worsening. Consider consulting with a healthcare provider.',
        actionRequired: false
      }
    ]
  }
];

export const DISCLAIMERS: DisclaimerContent[] = [
  {
    id: 'general_medical_disclaimer',
    type: 'medical',
    title: 'Medical Disclaimer',
    content: `This application is for educational purposes only and is not intended to provide medical advice, diagnosis, or treatment. The information provided should not replace professional medical consultation.

The Virtual Dr. Sarno app is based on the work of Dr. John Sarno and the concept of Tension Myositis Syndrome (TMS). While many people have found relief using Dr. Sarno's approach, it is not appropriate for everyone and should not be used as a substitute for proper medical evaluation.

You should always consult with a qualified healthcare provider before making any decisions about your health or treatment. If you are experiencing severe or worsening symptoms, seek immediate medical attention.

By using this application, you acknowledge that you understand these limitations and agree to use the information provided responsibly.`,
    requiresAcknowledgment: true,
    version: '1.0',
    lastUpdated: new Date('2024-01-01'),
    applicablePages: ['all']
  },
  {
    id: 'educational_disclaimer',
    type: 'educational',
    title: 'Educational Content Disclaimer',
    content: `The educational content in this application is based on Dr. John Sarno's books and research, as well as current understanding of mind-body medicine. This information is provided for educational purposes only.

Individual results may vary, and what works for one person may not work for another. The TMS approach is not scientifically proven to work for all types of pain, and some conditions require medical treatment.

This application does not provide personalized medical advice. All content should be considered general information that may or may not apply to your specific situation.`,
    requiresAcknowledgment: true,
    version: '1.0',
    lastUpdated: new Date('2024-01-01'),
    applicablePages: ['education', 'assessment']
  },
  {
    id: 'liability_disclaimer',
    type: 'liability',
    title: 'Limitation of Liability',
    content: `The creators and distributors of this application shall not be liable for any damages arising from the use or inability to use this application or its content.

This includes, but is not limited to, any direct, indirect, incidental, consequential, or punitive damages, even if we have been advised of the possibility of such damages.

Your use of this application is at your own risk. You are responsible for your own health decisions and should always consult with qualified healthcare providers.`,
    requiresAcknowledgment: true,
    version: '1.0',
    lastUpdated: new Date('2024-01-01'),
    applicablePages: ['all']
  },
  {
    id: 'privacy_disclaimer',
    type: 'privacy',
    title: 'Privacy and Data Security',
    content: `Your privacy is important to us. All personal health information you enter into this application is stored locally on your device and is not transmitted to external servers without your explicit consent.

However, no digital system is completely secure. You should be aware that there are inherent risks in storing personal health information digitally.

We recommend that you do not include highly sensitive medical information in your journal entries or other app content. Always maintain copies of important health information in secure, offline formats.`,
    requiresAcknowledgment: true,
    version: '1.0',
    lastUpdated: new Date('2024-01-01'),
    applicablePages: ['journal', 'pain-tracker', 'assessment']
  }
];

export const CLINICAL_GUIDELINES: ClinicalGuidelines = {
  tmsEligibilityCriteria: {
    included: [
      'Chronic back pain without clear structural cause',
      'Neck and shoulder tension',
      'Tension headaches',
      'Fibromyalgia-like symptoms',
      'Repetitive strain injuries',
      'Chronic fatigue syndrome',
      'Irritable bowel syndrome',
      'Chronic pelvic pain'
    ],
    excluded: [
      'Acute trauma or injury',
      'Confirmed structural abnormalities requiring treatment',
      'Active infection or inflammation',
      'Cancer-related pain',
      'Autoimmune conditions in active flare',
      'Severe psychiatric conditions requiring immediate treatment'
    ],
    requiresMedicalClearance: [
      'History of cancer',
      'Previous spinal surgery',
      'Significant trauma history',
      'Neurological symptoms',
      'Chronic medical conditions',
      'Current use of pain medications'
    ]
  },
  symptomMonitoring: {
    redFlagSymptoms: [
      'Progressive neurological deficits',
      'Bowel or bladder dysfunction',
      'Saddle anesthesia',
      'Bilateral leg weakness',
      'Fever with back pain',
      'Severe night pain',
      'Unexplained weight loss'
    ],
    progressionConcerns: [
      'Worsening pain after 4 weeks of TMS approach',
      'New neurological symptoms',
      'Functional decline',
      'Inability to perform activities of daily living',
      'Severe sleep disruption'
    ],
    emergencySymptoms: [
      'Cauda equina syndrome signs',
      'Acute neurological changes',
      'Signs of spinal infection',
      'Suicidal ideation',
      'Severe psychiatric symptoms'
    ]
  },
  treatmentLimitations: {
    maxDurationWeeks: 12,
    requiredBreaks: [
      'Medical evaluation if no improvement after 4 weeks',
      'Psychiatric consultation if psychological symptoms worsen',
      'Immediate cessation if red flag symptoms develop'
    ],
    contraindicatedConditions: [
      'Active psychosis',
      'Severe untreated depression with suicidal ideation',
      'Active substance abuse',
      'Acute medical conditions requiring immediate treatment',
      'Inability to understand or consent to treatment approach'
    ]
  },
  professionalReferralCriteria: [
    'No improvement after 6 weeks of consistent TMS approach',
    'Worsening of symptoms',
    'Development of new symptoms',
    'Psychological distress that interferes with daily functioning',
    'Patient request for professional consultation',
    'Any red flag symptoms or conditions'
  ]
};

// Emergency Resources
export const EMERGENCY_RESOURCES = {
  crisis: {
    suicidePreventionLifeline: {
      name: 'Suicide & Crisis Lifeline',
      phone: '988',
      description: '24/7 free and confidential support for people in distress'
    },
    emergencyServices: {
      name: 'Emergency Services',
      phone: '911',
      description: 'For immediate medical emergencies'
    }
  },
  medical: {
    findADoctor: 'https://www.healthgrades.com',
    tmsPractitioners: 'https://www.tmswiki.org/ppd/Find_a_TMS_Doctor',
    painManagementSpecialists: 'Contact your primary care physician for referrals'
  },
  mentalHealth: {
    psychologyToday: 'https://www.psychologytoday.com',
    nami: 'https://www.nami.org',
    samhsa: 'https://www.samhsa.gov/find-help/national-helpline'
  }
};
