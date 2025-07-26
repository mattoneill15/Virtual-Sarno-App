'use client';

import { useState, useEffect } from 'react';
import { EducationalModule, ContentSection, Quiz, QuizQuestion, QuizAttempt } from '@/types/education';
import { useApp, useAppActions } from '@/context/AppContext';
import { localStorage } from '@/utils/storage';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Quote,
  AlertTriangle,
  Lightbulb,
  Play,
  Award,
  Target
} from 'lucide-react';

interface EducationModuleProps {
  module: EducationalModule;
  onComplete: (moduleId: string, score?: number) => void;
  onClose: () => void;
}

export default function EducationModule({ module, onComplete, onClose }: EducationModuleProps) {
  const { state } = useApp();
  const { updateReadingProgress } = useAppActions();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [startTime] = useState(new Date());
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Mark first section as started
    setCompletedSections(new Set([0]));
  }, []);

  const getSectionIcon = (type: ContentSection['type']) => {
    switch (type) {
      case 'quote': return <Quote className="h-5 w-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'tip': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'example': return <Target className="h-5 w-5 text-green-600" />;
      default: return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSectionStyle = (type: ContentSection['type']) => {
    switch (type) {
      case 'quote': return 'bg-blue-50 border-blue-200 border-l-4 border-l-blue-500';
      case 'warning': return 'bg-red-50 border-red-200 border-l-4 border-l-red-500';
      case 'tip': return 'bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500';
      case 'example': return 'bg-green-50 border-green-200 border-l-4 border-l-green-500';
      default: return 'bg-white border-gray-200';
    }
  };

  const nextSection = () => {
    if (currentSection < module.content.sections.length - 1) {
      const nextIndex = currentSection + 1;
      setCurrentSection(nextIndex);
      setCompletedSections(prev => new Set([...prev, nextIndex]));
    } else if (module.quiz) {
      setShowQuiz(true);
    } else {
      completeModule();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string | number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = () => {
    if (!module.quiz) return;

    let correctAnswers = 0;
    const totalQuestions = module.quiz.questions.length;

    module.quiz.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Save quiz attempt
    const attempt: QuizAttempt = {
      attemptNumber: 1, // TODO: Track actual attempt number
      score,
      answers: quizAnswers,
      completedAt: new Date()
    };

    if (score >= module.quiz.passingScore) {
      completeModule(score);
    }
  };

  const retakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const completeModule = (score?: number) => {
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 60000); // minutes
    
    // Update reading progress
    if (state.treatmentProgress) {
      const updatedProgress = {
        ...state.treatmentProgress.readingProgress,
        completedSections: [...state.treatmentProgress.readingProgress.completedSections, module.id],
        comprehensionScores: {
          ...state.treatmentProgress.readingProgress.comprehensionScores,
          [module.id]: score || 100
        }
      };
      updateReadingProgress(updatedProgress);
    }

    onComplete(module.id, score);
  };

  const currentSectionData = module.content.sections[currentSection];
  const progress = ((currentSection + 1) / module.content.sections.length) * 100;

  if (showQuiz && module.quiz) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Quiz Header */}
        <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{module.title} - Quiz</h2>
              <p className="text-indigo-100 mt-1">
                Test your understanding • {module.quiz.questions.length} questions
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-indigo-200 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {!quizSubmitted ? (
            <>
              {/* Quiz Questions */}
              <div className="space-y-6">
                {module.quiz.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                    </div>

                    {question.type === 'multiple-choice' && question.options && (
                      <div className="ml-11 space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={optionIndex}
                              checked={quizAnswers[question.id] === optionIndex}
                              onChange={(e) => handleQuizAnswer(question.id, parseInt(e.target.value))}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="ml-11 space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value="true"
                            checked={quizAnswers[question.id] === 'true'}
                            onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">True</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={question.id}
                            value="false"
                            checked={quizAnswers[question.id] === 'false'}
                            onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">False</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < module.quiz.questions.length}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Quiz
                </button>
              </div>
            </>
          ) : (
            /* Quiz Results */
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                quizScore! >= module.quiz.passingScore 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {quizScore! >= module.quiz.passingScore ? (
                  <Award className="h-12 w-12" />
                ) : (
                  <Target className="h-12 w-12" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Quiz {quizScore! >= module.quiz.passingScore ? 'Passed!' : 'Not Passed'}
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                Your Score: {quizScore}% (Passing: {module.quiz.passingScore}%)
              </p>

              {/* Detailed Results */}
              <div className="text-left space-y-4 mb-8">
                {module.quiz.questions.map((question, index) => {
                  const userAnswer = quizAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`p-4 rounded-lg border ${
                      isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                          <p className="text-sm text-gray-600">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center space-x-4">
                {quizScore! >= module.quiz.passingScore ? (
                  <button
                    onClick={() => completeModule(quizScore!)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Complete Module
                  </button>
                ) : (
                  <button
                    onClick={retakeQuiz}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Retake Quiz
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Module Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{module.title}</h2>
            <div className="flex items-center space-x-4 mt-2 text-indigo-100">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{module.estimatedReadTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm capitalize">{module.difficulty}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-indigo-100 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-indigo-500 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module Content */}
      <div className="p-6">
        {/* Current Section */}
        <div className={`rounded-lg border p-6 mb-6 ${getSectionStyle(currentSectionData.type)}`}>
          <div className="flex items-center space-x-3 mb-4">
            {getSectionIcon(currentSectionData.type)}
            <h3 className="text-xl font-semibold text-gray-900">{currentSectionData.title}</h3>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {currentSectionData.content}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-600">
            Section {currentSection + 1} of {module.content.sections.length}
          </div>

          <button
            onClick={nextSection}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <span>
              {currentSection === module.content.sections.length - 1 
                ? (module.quiz ? 'Take Quiz' : 'Complete')
                : 'Next'
              }
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Section Overview */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Module Sections</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {module.content.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  index === currentSection
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : completedSections.has(index)
                    ? 'border-green-200 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {completedSections.has(index) && index !== currentSection && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {index === currentSection && (
                    <Play className="h-4 w-4 text-indigo-600" />
                  )}
                  <span className="text-sm font-medium truncate">{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        {currentSection === module.content.sections.length - 1 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Key Takeaways</h4>
            <ul className="space-y-2">
              {module.content.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start space-x-2 text-blue-800">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
