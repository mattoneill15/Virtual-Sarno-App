import { EducationalModule } from '@/types/education';

export const EDUCATIONAL_MODULES: EducationalModule[] = [
  {
    id: 'tms-intro',
    title: 'Introduction to TMS',
    category: 'fundamentals',
    description: 'Understanding what Tension Myositis Syndrome is and how it affects the body',
    estimatedReadTime: 15,
    difficulty: 'beginner',
    content: {
      sections: [
        {
          id: 'what-is-tms',
          title: 'What is TMS?',
          type: 'text',
          content: `Tension Myositis Syndrome (TMS) is a condition in which unconscious emotional tensions cause physical pain and other symptoms. Dr. John Sarno discovered that many chronic pain conditions are not caused by structural abnormalities, but by the mind's attempt to distract us from uncomfortable emotions.

The key insight is that the pain is real, but it's not caused by physical damage. Instead, it's caused by reduced blood flow to muscles, nerves, and tendons, triggered by the unconscious mind.`
        },
        {
          id: 'sarno-quote',
          title: 'Dr. Sarno\'s Core Message',
          type: 'quote',
          content: `"The pain is real, but it's not caused by a structural abnormality. It's caused by your unconscious mind to distract you from emotional issues that your conscious mind finds unacceptable." - Dr. John Sarno`
        },
        {
          id: 'how-tms-works',
          title: 'How TMS Works',
          type: 'text',
          content: `TMS operates through a process Dr. Sarno called "the distraction mechanism." When we have emotions that our conscious mind finds unacceptable (like rage, fear, or sadness), our unconscious mind creates physical symptoms to distract us from these feelings.

This happens because many of us have learned that certain emotions are "bad" or "dangerous." Rather than feel these emotions, our unconscious mind redirects our attention to physical pain.`
        },
        {
          id: 'common-tms-conditions',
          title: 'Common TMS Conditions',
          type: 'text',
          content: `TMS can manifest as many different conditions:
          
• Back pain (most common)
• Neck and shoulder pain
• Headaches and migraines
• Fibromyalgia
• Chronic fatigue syndrome
• Irritable bowel syndrome
• Tension headaches
• TMJ (jaw pain)
• Carpal tunnel syndrome
• Plantar fasciitis

The key is that these conditions often have no clear structural cause or don't respond well to physical treatments.`
        },
        {
          id: 'good-news',
          title: 'The Good News',
          type: 'tip',
          content: `The wonderful news about TMS is that once you understand what's happening and address the underlying emotional issues, the pain often resolves completely. Many people experience significant improvement or complete recovery simply through knowledge and emotional awareness.`
        }
      ],
      keyTakeaways: [
        'TMS is real physical pain caused by unconscious emotional tensions',
        'The pain serves as a distraction from uncomfortable emotions',
        'Understanding this mechanism is the first step toward healing',
        'Many chronic pain conditions may actually be TMS',
        'Recovery is possible through knowledge and emotional awareness'
      ],
      reflectionQuestions: [
        'When did your pain first begin? What was happening in your life at that time?',
        'Do you notice any patterns between stress and your pain levels?',
        'What emotions do you find most difficult to experience or express?'
      ]
    },
    quiz: {
      id: 'tms-intro-quiz',
      questions: [
        {
          id: 'q1',
          question: 'What causes TMS according to Dr. Sarno?',
          type: 'multiple-choice',
          options: [
            'Structural abnormalities in the spine',
            'Unconscious emotional tensions',
            'Poor posture and ergonomics',
            'Genetic predisposition'
          ],
          correctAnswer: 1,
          explanation: 'TMS is caused by unconscious emotional tensions that create physical symptoms as a distraction mechanism.',
          points: 10
        },
        {
          id: 'q2',
          question: 'TMS pain is not real pain.',
          type: 'true-false',
          correctAnswer: 'false',
          explanation: 'TMS pain is absolutely real. The difference is that it\'s caused by emotional factors rather than structural damage.',
          points: 10
        },
        {
          id: 'q3',
          question: 'What is the primary purpose of TMS symptoms?',
          type: 'multiple-choice',
          options: [
            'To punish us for bad behavior',
            'To distract us from uncomfortable emotions',
            'To make us rest and recover',
            'To signal structural damage'
          ],
          correctAnswer: 1,
          explanation: 'TMS symptoms serve as a distraction mechanism to keep our attention away from emotions the unconscious mind finds threatening.',
          points: 10
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'mind-body-connection',
    title: 'The Mind-Body Connection',
    category: 'fundamentals',
    description: 'Exploring how emotions and thoughts directly affect physical health',
    estimatedReadTime: 20,
    difficulty: 'beginner',
    prerequisiteModules: ['tms-intro'],
    content: {
      sections: [
        {
          id: 'connection-overview',
          title: 'Understanding the Connection',
          type: 'text',
          content: `The mind and body are not separate entities—they are intimately connected. Every emotion you feel has a physical component, and every physical sensation can influence your emotional state.

Dr. Sarno's revolutionary insight was recognizing that this connection could create real physical symptoms without any structural damage. The autonomic nervous system, which controls unconscious bodily functions, can be influenced by our emotional state.`
        },
        {
          id: 'autonomic-nervous-system',
          title: 'The Autonomic Nervous System',
          type: 'text',
          content: `The autonomic nervous system controls functions like:
• Heart rate and blood pressure
• Breathing
• Digestion
• Blood flow to muscles and organs
• Muscle tension

When we're stressed or experiencing strong emotions, this system can reduce blood flow to certain areas, causing pain, tension, and other symptoms.`
        },
        {
          id: 'emotional-repression',
          title: 'The Role of Emotional Repression',
          type: 'text',
          content: `Many of us learned early in life that certain emotions are unacceptable:
• Anger might have been discouraged or punished
• Sadness might have been seen as weakness
• Fear might have been dismissed

When we can't express these emotions, they don't disappear—they get pushed into the unconscious mind, where they can manifest as physical symptoms.`
        },
        {
          id: 'perfectionist-example',
          title: 'Example: The Perfectionist',
          type: 'example',
          content: `Sarah is a perfectionist who never allows herself to feel angry. When her boss gives her unrealistic deadlines, instead of acknowledging her frustration, she pushes harder. Her unconscious mind, overwhelmed by repressed anger, creates back pain that forces her to slow down and rest.

The pain serves two purposes: it distracts her from the "unacceptable" anger and forces her to take a break she wouldn't otherwise allow herself.`
        },
        {
          id: 'breaking-the-cycle',
          title: 'Breaking the Cycle',
          type: 'tip',
          content: `The key to breaking this cycle is awareness. When you understand that your symptoms might be emotionally driven, you can:
• Acknowledge your true feelings
• Express emotions in healthy ways
• Reduce the need for physical distraction
• Allow your body to heal naturally`
        }
      ],
      keyTakeaways: [
        'Mind and body are intimately connected through the nervous system',
        'Emotions can create real physical symptoms',
        'Repressed emotions often manifest as physical pain',
        'The autonomic nervous system responds to emotional stress',
        'Awareness and emotional expression can break the pain cycle'
      ],
      practicalExercises: [
        {
          id: 'emotion-body-scan',
          title: 'Emotion-Body Scan',
          description: 'Learn to identify how emotions feel in your body',
          type: 'reflection',
          estimatedTime: 10,
          instructions: [
            'Sit quietly and think about a recent stressful situation',
            'Notice what emotions come up (anger, fear, sadness, etc.)',
            'Scan your body from head to toe',
            'Notice any areas of tension, pain, or discomfort',
            'Make the connection between the emotion and physical sensation',
            'Breathe deeply and acknowledge both the emotion and the sensation'
          ]
        }
      ],
      reflectionQuestions: [
        'What emotions do you find most difficult to acknowledge or express?',
        'Can you identify times when stress or emotions preceded physical symptoms?',
        'How did your family handle emotions when you were growing up?'
      ]
    },
    quiz: {
      id: 'mind-body-quiz',
      questions: [
        {
          id: 'q1',
          question: 'The autonomic nervous system can be influenced by emotions.',
          type: 'true-false',
          correctAnswer: 'true',
          explanation: 'The autonomic nervous system, which controls unconscious bodily functions, is directly influenced by our emotional state.',
          points: 10
        },
        {
          id: 'q2',
          question: 'What happens to emotions that we don\'t express?',
          type: 'multiple-choice',
          options: [
            'They disappear completely',
            'They get stronger over time',
            'They get pushed into the unconscious mind',
            'They turn into positive emotions'
          ],
          correctAnswer: 2,
          explanation: 'Unexpressed emotions don\'t disappear—they get repressed into the unconscious mind where they can create physical symptoms.',
          points: 10
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'personality-and-tms',
    title: 'Personality Types and TMS',
    category: 'personality',
    description: 'Understanding how certain personality traits predispose us to TMS',
    estimatedReadTime: 25,
    difficulty: 'intermediate',
    prerequisiteModules: ['tms-intro', 'mind-body-connection'],
    content: {
      sections: [
        {
          id: 'tms-personality',
          title: 'The TMS Personality',
          type: 'text',
          content: `Dr. Sarno identified specific personality traits that make people more susceptible to TMS. These aren't character flaws—they're often admirable qualities that our society values. However, they can create internal pressure that leads to symptom development.

The most common TMS personality traits include:
• Perfectionism
• People-pleasing
• High responsibility and conscientiousness
• Self-criticism
• Need for control
• Difficulty expressing anger`
        },
        {
          id: 'perfectionist',
          title: 'The Perfectionist',
          type: 'text',
          content: `Perfectionists set impossibly high standards for themselves and others. They:
• Fear making mistakes
• Struggle with "good enough"
• Often procrastinate due to fear of imperfection
• Experience intense self-criticism
• May have learned that love was conditional on performance

This constant pressure creates enormous internal tension that can manifest as physical symptoms.`
        },
        {
          id: 'people-pleaser',
          title: 'The People-Pleaser',
          type: 'text',
          content: `People-pleasers prioritize others' needs over their own. They:
• Have difficulty saying "no"
• Fear conflict or disapproval
• Often feel resentful but don't express it
• May have learned that their worth depends on others' approval
• Struggle to identify their own needs and wants

The constant suppression of their own needs creates internal rage that must be expressed somehow—often through physical symptoms.`
        },
        {
          id: 'goodist',
          title: 'The "Goodist"',
          type: 'text',
          content: `Dr. Sarno coined the term "goodist" to describe people who have an excessive need to be good, moral, and responsible. They:
• Take on more than their fair share of responsibility
• Feel guilty about normal human emotions like anger
• Often sacrifice their own well-being for others
• May have been raised with strict moral codes
• Struggle with self-compassion

This internal pressure to always be "good" creates enormous tension when normal human emotions arise.`
        },
        {
          id: 'recognizing-patterns',
          title: 'Recognizing Your Patterns',
          type: 'tip',
          content: `The goal isn't to completely change your personality—these traits often serve you well in many areas of life. Instead, the goal is to:
• Recognize when these patterns create internal pressure
• Allow yourself to be human and imperfect
• Express emotions in healthy ways
• Set appropriate boundaries
• Practice self-compassion`
        }
      ],
      keyTakeaways: [
        'Certain personality traits predispose people to TMS',
        'Perfectionism and people-pleasing create internal pressure',
        'These traits are often admirable but can become problematic',
        'The goal is awareness and balance, not personality change',
        'Self-compassion is crucial for TMS recovery'
      ],
      practicalExercises: [
        {
          id: 'personality-assessment',
          title: 'TMS Personality Self-Assessment',
          description: 'Identify which TMS personality traits apply to you',
          type: 'reflection',
          estimatedTime: 15,
          instructions: [
            'Read through each personality trait description',
            'Rate how much each applies to you (1-10 scale)',
            'Identify your top 3 strongest traits',
            'Reflect on how these traits might create internal pressure',
            'Consider specific situations where these traits cause stress',
            'Write about one small way you could be gentler with yourself'
          ]
        }
      ],
      reflectionQuestions: [
        'Which TMS personality traits do you recognize in yourself?',
        'How might these traits have developed in your childhood?',
        'In what situations do you feel the most internal pressure?',
        'What would it feel like to lower your standards just a little?'
      ]
    }
  },
  {
    id: 'emotional-exploration',
    title: 'Exploring Repressed Emotions',
    category: 'emotional',
    description: 'Learning to identify and safely express suppressed feelings',
    estimatedReadTime: 30,
    difficulty: 'intermediate',
    prerequisiteModules: ['mind-body-connection', 'personality-and-tms'],
    content: {
      sections: [
        {
          id: 'repressed-emotions',
          title: 'Understanding Repressed Emotions',
          type: 'text',
          content: `Repressed emotions are feelings that we've pushed out of conscious awareness because they feel too threatening, uncomfortable, or unacceptable. Common repressed emotions in TMS include:

• Rage and anger
• Deep sadness or grief
• Fear and anxiety
• Shame and guilt
• Feelings of powerlessness

These emotions don't disappear when repressed—they continue to exist in the unconscious mind, creating internal pressure that can manifest as physical symptoms.`
        },
        {
          id: 'rage-reservoir',
          title: 'The Rage Reservoir',
          type: 'text',
          content: `Dr. Sarno believed that unconscious rage was the primary emotion behind most TMS symptoms. This rage can come from:

• Current life stressors and pressures
• Childhood experiences and trauma
• Perfectionist self-imposed pressure
• Resentment from people-pleasing
• Feeling trapped or powerless

The rage is often completely unconscious—many TMS patients are surprised to learn they might be angry, as they see themselves as calm, controlled people.`
        },
        {
          id: 'childhood-origins',
          title: 'Childhood Origins',
          type: 'text',
          content: `Many repressed emotions have their roots in childhood experiences:

• Being told that anger is "bad" or dangerous
• Learning that love is conditional on being "good"
• Having to be the responsible one in the family
• Experiencing trauma or neglect
• Being criticized for expressing emotions

These early experiences teach us which emotions are "safe" to feel and which must be hidden, even from ourselves.`
        },
        {
          id: 'safe-exploration',
          title: 'Safe Emotional Exploration',
          type: 'tip',
          content: `Exploring repressed emotions should be done gradually and safely:

• Start with journaling about current stressors
• Notice physical sensations that accompany emotions
• Practice self-compassion throughout the process
• Consider working with a therapist for deeper exploration
• Remember that feeling emotions doesn't mean acting on them
• Allow yourself to feel without judgment`
        },
        {
          id: 'emotional-expression',
          title: 'Healthy Expression Methods',
          type: 'text',
          content: `Once you identify repressed emotions, you need healthy ways to express them:

• Journaling and writing
• Physical exercise or movement
• Creative expression (art, music, dance)
• Talking with trusted friends or therapists
• Mindfulness and meditation
• Breathwork and body-based practices

The goal is to acknowledge and express emotions in ways that don't harm yourself or others.`
        }
      ],
      keyTakeaways: [
        'Repressed emotions create internal pressure that can cause physical symptoms',
        'Unconscious rage is often the primary emotion behind TMS',
        'Many emotional patterns originate in childhood experiences',
        'Emotions need to be acknowledged and expressed, not eliminated',
        'Safe exploration and expression are key to TMS recovery'
      ],
      practicalExercises: [
        {
          id: 'anger-exploration',
          title: 'Anger Exploration Exercise',
          description: 'Safely explore and express anger',
          type: 'journaling',
          estimatedTime: 20,
          instructions: [
            'Find a private space where you won\'t be interrupted',
            'Write about things that make you angry, starting with small irritations',
            'Allow yourself to write freely without censoring',
            'Include things you "shouldn\'t" be angry about',
            'Notice any physical sensations as you write',
            'End by acknowledging that anger is a normal, healthy emotion'
          ]
        },
        {
          id: 'childhood-emotions',
          title: 'Childhood Emotion Patterns',
          description: 'Explore how you learned to handle emotions',
          type: 'reflection',
          estimatedTime: 25,
          instructions: [
            'Think about your childhood family environment',
            'How were different emotions handled? (anger, sadness, fear, joy)',
            'What messages did you receive about expressing emotions?',
            'Which emotions felt safe to express? Which didn\'t?',
            'How do these patterns show up in your adult life?',
            'Write a compassionate letter to your childhood self'
          ]
        }
      ],
      reflectionQuestions: [
        'What emotions do you find most difficult to acknowledge?',
        'How did your family handle anger and conflict?',
        'What would happen if you allowed yourself to feel angry?',
        'What childhood experiences might have shaped your emotional patterns?'
      ]
    }
  },
  {
    id: 'recovery-process',
    title: 'The TMS Recovery Process',
    category: 'recovery',
    description: 'Practical steps for healing and preventing symptom recurrence',
    estimatedReadTime: 35,
    difficulty: 'intermediate',
    prerequisiteModules: ['tms-intro', 'mind-body-connection', 'emotional-exploration'],
    content: {
      sections: [
        {
          id: 'recovery-overview',
          title: 'Understanding Recovery',
          type: 'text',
          content: `TMS recovery is not a linear process—it's a journey of increasing self-awareness and emotional freedom. Recovery typically involves:

• Accepting the TMS diagnosis
• Understanding your personal triggers and patterns
• Developing emotional awareness and expression skills
• Gradually resuming feared activities
• Building new, healthier thought patterns
• Preventing symptom recurrence

Most people experience improvement within weeks to months, though the timeline varies for each individual.`
        },
        {
          id: 'accepting-diagnosis',
          title: 'Accepting the TMS Diagnosis',
          type: 'text',
          content: `The first step in recovery is truly accepting that your symptoms are TMS-related. This can be challenging because:

• It goes against everything we've been told about pain
• It requires taking responsibility for our emotional health
• It means letting go of the "structural" explanation
• It can feel like others won't believe us

However, acceptance is crucial because it shifts your focus from fixing your body to understanding your emotions.`
        },
        {
          id: 'resuming-activities',
          title: 'Resuming Physical Activities',
          type: 'text',
          content: `An important part of TMS recovery is gradually resuming activities you've been avoiding due to pain:

• Start with activities that feel manageable
• Remind yourself that movement is safe
• Expect some fear and discomfort initially
• Focus on the emotional aspects, not just the physical
• Celebrate small victories
• Don't rush the process

The goal is to prove to your unconscious mind that you're not fragile or damaged.`
        },
        {
          id: 'daily-practices',
          title: 'Daily Recovery Practices',
          type: 'text',
          content: `Successful TMS recovery often involves developing daily practices:

• Morning intention setting
• Regular journaling or emotional check-ins
• Mindfulness or meditation practice
• Physical movement or exercise
• Stress management techniques
• Evening reflection and gratitude

These practices help maintain emotional awareness and prevent symptom recurrence.`
        },
        {
          id: 'setbacks-and-relapses',
          title: 'Handling Setbacks',
          type: 'warning',
          content: `Setbacks are a normal part of TMS recovery. When symptoms return:

• Don't panic—this is part of the process
• Look for emotional triggers or stressors
• Return to your recovery practices
• Remind yourself of what you've learned
• Be patient and compassionate with yourself
• Consider if you need additional support

Setbacks often provide valuable information about your triggers and patterns.`
        },
        {
          id: 'long-term-prevention',
          title: 'Long-term Prevention',
          type: 'tip',
          content: `To prevent TMS recurrence:

• Maintain regular emotional check-ins
• Continue expressing emotions in healthy ways
• Set appropriate boundaries in relationships
• Practice self-compassion and stress management
• Stay connected to your body and its signals
• Seek support when facing major life stressors

Remember, recovery is an ongoing process of emotional growth and self-awareness.`
        }
      ],
      keyTakeaways: [
        'Recovery involves accepting the TMS diagnosis and focusing on emotions',
        'Gradually resuming feared activities is crucial for healing',
        'Daily practices support ongoing emotional awareness',
        'Setbacks are normal and provide valuable learning opportunities',
        'Long-term prevention requires ongoing emotional self-care'
      ],
      practicalExercises: [
        {
          id: 'activity-resumption',
          title: 'Gradual Activity Resumption Plan',
          description: 'Create a plan for safely resuming avoided activities',
          type: 'physical',
          estimatedTime: 30,
          instructions: [
            'List activities you\'ve been avoiding due to pain',
            'Rank them from least to most feared',
            'Choose the least feared activity to start with',
            'Set a specific, small goal (e.g., "walk for 10 minutes")',
            'Before the activity, remind yourself that you\'re safe',
            'During the activity, focus on the emotional aspects',
            'After the activity, celebrate your courage regardless of pain levels'
          ]
        },
        {
          id: 'daily-practice-routine',
          title: 'Design Your Daily Practice',
          description: 'Create a personalized daily routine for TMS recovery',
          type: 'reflection',
          estimatedTime: 20,
          instructions: [
            'Choose 3-5 practices that resonate with you',
            'Decide on specific times for each practice',
            'Start with just 5-10 minutes per practice',
            'Create reminders or cues to help you remember',
            'Plan for obstacles and how you\'ll overcome them',
            'Commit to trying your routine for one week'
          ]
        }
      ],
      reflectionQuestions: [
        'What activities have you been avoiding due to pain?',
        'What fears come up when you think about resuming these activities?',
        'What daily practices would best support your emotional health?',
        'How will you handle setbacks with compassion?'
      ]
    }
  }
];

// Helper function to get modules by category
export function getModulesByCategory(category: EducationalModule['category']): EducationalModule[] {
  return EDUCATIONAL_MODULES.filter(module => module.category === category);
}

// Helper function to get prerequisite modules
export function getPrerequisiteModules(moduleId: string): EducationalModule[] {
  const module = EDUCATIONAL_MODULES.find(m => m.id === moduleId);
  if (!module?.prerequisiteModules) return [];
  
  return EDUCATIONAL_MODULES.filter(m => module.prerequisiteModules!.includes(m.id));
}

// Helper function to get next recommended modules
export function getNextRecommendedModules(completedModuleIds: string[]): EducationalModule[] {
  return EDUCATIONAL_MODULES.filter(module => {
    // Module not yet completed
    if (completedModuleIds.includes(module.id)) return false;
    
    // All prerequisites are completed
    if (module.prerequisiteModules) {
      return module.prerequisiteModules.every(prereq => completedModuleIds.includes(prereq));
    }
    
    return true;
  }).slice(0, 3); // Return top 3 recommendations
}
