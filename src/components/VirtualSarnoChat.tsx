'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { VirtualSarnoAI } from '@/utils/virtualSarnoAI';
import { VirtualSarnoMessage, ConversationContext } from '@/types/virtualSarno';
import { v4 as uuidv4 } from 'uuid';
import { Send, User, Brain, AlertTriangle, BookOpen, Activity, Clock } from 'lucide-react';

interface VirtualSarnoChatProps {
  className?: string;
  initialMessage?: string;
}

export default function VirtualSarnoChat({ 
  className = '', 
  initialMessage = "Hello! I'm Dr. John Sarno. I'm here to help you understand your pain and guide you toward healing. What would you like to discuss today?"
}: VirtualSarnoChatProps) {
  const { state } = useApp();
  const [messages, setMessages] = useState<VirtualSarnoMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sarnoAI = useRef(new VirtualSarnoAI());

  useEffect(() => {
    // Add initial message from Dr. Sarno
    const initialSarnoMessage: VirtualSarnoMessage = {
      id: uuidv4(),
      role: 'sarno',
      content: initialMessage,
      timestamp: new Date(),
      context: {
        currentPhase: state.currentPhase || 'assessment',
        sessionType: 'consultation'
      }
    };
    setMessages([initialSarnoMessage]);
  }, [initialMessage, state.currentPhase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const buildConversationContext = (): ConversationContext => {
    return {
      userId: state.user?.id || 'anonymous',
      sessionId,
      startTime: new Date(),
      currentPhase: state.currentPhase || 'assessment',
      userProfile: {
        name: state.user?.personalInfo?.name,
        painHistory: state.user?.painHistory,
        psychologicalProfile: state.user?.psychologicalProfile,
        treatmentProgress: state.treatmentProgress
      },
      conversationHistory: messages,
      currentTopics: extractCurrentTopics(),
      emotionalState: detectEmotionalState(),
      urgencyLevel: 'low'
    };
  };

  const extractCurrentTopics = (): string[] => {
    const recentMessages = messages.slice(-6);
    const topics: string[] = [];
    
    recentMessages.forEach(msg => {
      if (msg.content.toLowerCase().includes('pain')) topics.push('pain');
      if (msg.content.toLowerCase().includes('emotion')) topics.push('emotions');
      if (msg.content.toLowerCase().includes('exercise')) topics.push('activity');
      if (msg.content.toLowerCase().includes('stress')) topics.push('stress');
    });
    
    return [...new Set(topics)];
  };

  const detectEmotionalState = (): 'calm' | 'anxious' | 'frustrated' | 'hopeful' | 'discouraged' => {
    const recentUserMessages = messages
      .filter(msg => msg.role === 'user')
      .slice(-3)
      .map(msg => msg.content.toLowerCase());
    
    const allText = recentUserMessages.join(' ');
    
    if (allText.includes('frustrated') || allText.includes('angry')) return 'frustrated';
    if (allText.includes('worried') || allText.includes('scared')) return 'anxious';
    if (allText.includes('hopeless') || allText.includes('giving up')) return 'discouraged';
    if (allText.includes('better') || allText.includes('hopeful')) return 'hopeful';
    
    return 'calm';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: VirtualSarnoMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      context: {
        currentPhase: state.currentPhase || 'assessment',
        emotionalState: detectEmotionalState(),
        sessionType: 'general'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = buildConversationContext();
      const response = await sarnoAI.current.generateResponse(inputMessage.trim(), context);
      
      const sarnoMessage: VirtualSarnoMessage = {
        id: uuidv4(),
        role: 'sarno',
        content: response.message,
        timestamp: new Date(),
        context: {
          currentPhase: state.currentPhase || 'assessment',
          sessionType: 'general'
        },
        metadata: {
          confidence: response.confidence,
          recommendations: response.recommendations,
          redFlags: response.redFlags
        }
      };

      setMessages(prev => [...prev, sarnoMessage]);

      // Show follow-up questions if provided
      if (response.followUpQuestions && response.followUpQuestions.length > 0) {
        setTimeout(() => {
          const followUpMessage: VirtualSarnoMessage = {
            id: uuidv4(),
            role: 'sarno',
            content: `Some questions that might help us explore this further:\n\n${response.followUpQuestions!.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
            timestamp: new Date(),
            context: {
              currentPhase: state.currentPhase || 'assessment',
              sessionType: 'follow_up'
            }
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 2000);
      }

    } catch (error) {
      console.error('Error generating Sarno response:', error);
      const errorMessage: VirtualSarnoMessage = {
        id: uuidv4(),
        role: 'sarno',
        content: "I apologize, but I'm having trouble responding right now. Please try again, or if this is urgent, consider reaching out to a healthcare professional.",
        timestamp: new Date(),
        context: {
          currentPhase: state.currentPhase || 'assessment',
          sessionType: 'general'
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Convert markdown-style formatting to JSX
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('🆘 **') || line.startsWith('🏥 **')) {
        return (
          <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3 my-2">
            <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
              <AlertTriangle className="w-5 h-5" />
              {line.replace(/\*\*/g, '')}
            </div>
          </div>
        );
      } else if (line.startsWith('• **')) {
        return (
          <div key={index} className="ml-4 my-1">
            <span className="font-semibold">{line.replace(/\*\*/g, '').replace('• ', '')}</span>
          </div>
        );
      } else if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <div key={index} className="my-1">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </div>
        );
      } else if (line.trim()) {
        return <div key={index} className="my-1">{line}</div>;
      } else {
        return <div key={index} className="h-2" />;
      }
    });
  };

  const getMessageIcon = (role: 'user' | 'sarno') => {
    if (role === 'user') {
      return <User className="w-5 h-5" />;
    } else {
      return <Brain className="w-5 h-5" />;
    }
  };

  const getMessageTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Virtual Dr. John Sarno</h2>
            <p className="text-blue-100 text-sm">TMS Specialist & Mind-Body Healing Expert</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'sarno' && (
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 self-start">
                {getMessageIcon(message.role)}
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm">
                {formatMessageContent(message.content)}
              </div>
              
              <div className={`text-xs mt-2 flex items-center gap-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <Clock className="w-3 h-3" />
                {getMessageTime(message.timestamp)}
                {message.metadata?.confidence && (
                  <span className="ml-2">
                    Confidence: {Math.round(message.metadata.confidence * 100)}%
                  </span>
                )}
              </div>

              {/* Show recommendations if available */}
              {message.metadata?.recommendations && message.metadata.recommendations.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                  <div className="flex items-center gap-1 text-blue-800 font-medium text-xs mb-1">
                    <BookOpen className="w-3 h-3" />
                    Recommendations:
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {message.metadata.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 self-start">
                {getMessageIcon(message.role)}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-blue-100 p-2 rounded-full">
              <Brain className="w-5 h-5" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                Dr. Sarno is thinking...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dr. Sarno about your pain, emotions, or TMS healing..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
