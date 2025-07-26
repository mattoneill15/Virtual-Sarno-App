'use client';

import { useState } from 'react';
import { SafetyAlert as SafetyAlertType, RedFlag } from '@/types/safety';
import { EMERGENCY_RESOURCES } from '@/data/safety';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Phone, 
  ExternalLink,
  X,
  Shield,
  Heart
} from 'lucide-react';

interface SafetyAlertProps {
  alert?: SafetyAlertType;
  redFlag?: RedFlag;
  onAcknowledge?: () => void;
  onDismiss?: () => void;
  onContactDoctor?: () => void;
  onCallEmergency?: () => void;
}

export default function SafetyAlert({ 
  alert, 
  redFlag, 
  onAcknowledge, 
  onDismiss, 
  onContactDoctor, 
  onCallEmergency 
}: SafetyAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle red flag display
  if (redFlag) {
    const alertType = redFlag.severity === 'critical' ? 'emergency' : 
                     redFlag.severity === 'high' ? 'warning' : 'caution';
    
    return (
      <div className={`rounded-lg border-2 p-6 ${getAlertStyles(alertType)}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {getAlertIcon(alertType)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {redFlag.title}
              </h3>
              {redFlag.severity && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge(redFlag.severity)}`}>
                  {redFlag.severity.toUpperCase()}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">
              {redFlag.description}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Recommendation:</h4>
              <p className="text-blue-800 text-sm">
                {redFlag.recommendation}
              </p>
            </div>

            {redFlag.contraindications && redFlag.contraindications.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-900 mb-2">Important:</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  {redFlag.contraindications.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency Resources */}
            {redFlag.requiresImmediateAttention && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-900 mb-3 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Resources
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('tel:911')}
                    className="flex items-center space-x-2 w-full text-left p-2 bg-red-100 hover:bg-red-200 rounded transition-colors"
                  >
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="text-red-800 font-medium">Call 911 - Emergency Services</span>
                  </button>
                  
                  {redFlag.category === 'psychological' && (
                    <button
                      onClick={() => window.open('tel:988')}
                      className="flex items-center space-x-2 w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                    >
                      <Heart className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800 font-medium">Call 988 - Suicide & Crisis Lifeline</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {redFlag.medicalConsultationRequired && (
                <button
                  onClick={onContactDoctor}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Find Healthcare Provider
                </button>
              )}
              
              {redFlag.requiresImmediateAttention && (
                <button
                  onClick={onCallEmergency}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Emergency Resources
                </button>
              )}
              
              <button
                onClick={onAcknowledge}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle general safety alert
  if (!alert) return null;

  return (
    <div className={`rounded-lg border-2 p-6 ${getAlertStyles(alert.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            {getAlertIcon(alert.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {alert.title}
            </h3>
            <p className="text-gray-700 mb-4">
              {alert.message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {alert.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(action.action)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    action.isPrimary 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {!alert.persistent && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );

  function handleAction(actionType: string) {
    switch (actionType) {
      case 'acknowledge':
        onAcknowledge?.();
        break;
      case 'contact_doctor':
        onContactDoctor?.();
        break;
      case 'call_emergency':
        onCallEmergency?.();
        break;
      case 'dismiss':
        onDismiss?.();
        break;
    }
  }
}

function getAlertStyles(type: string): string {
  switch (type) {
    case 'emergency':
      return 'bg-red-50 border-red-300 shadow-lg';
    case 'warning':
      return 'bg-yellow-50 border-yellow-300 shadow-md';
    case 'caution':
      return 'bg-orange-50 border-orange-300 shadow-md';
    case 'info':
      return 'bg-blue-50 border-blue-300 shadow-sm';
    default:
      return 'bg-gray-50 border-gray-300 shadow-sm';
  }
}

function getAlertIcon(type: string): JSX.Element {
  const iconClass = "h-6 w-6";
  
  switch (type) {
    case 'emergency':
      return <AlertTriangle className={`${iconClass} text-red-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
    case 'caution':
      return <AlertCircle className={`${iconClass} text-orange-600`} />;
    case 'info':
      return <Info className={`${iconClass} text-blue-600`} />;
    default:
      return <Shield className={`${iconClass} text-gray-600`} />;
  }
}

function getSeverityBadge(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Emergency Resources Modal Component
export function EmergencyResourcesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Phone className="h-6 w-6 mr-2 text-red-600" />
              Emergency Resources
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Crisis Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Crisis Support</h3>
              <div className="space-y-3">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900">Emergency Services</h4>
                      <p className="text-red-700 text-sm">For immediate medical emergencies</p>
                    </div>
                    <button
                      onClick={() => window.open('tel:911')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Call 911
                    </button>
                  </div>
                </div>

                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Suicide & Crisis Lifeline</h4>
                      <p className="text-blue-700 text-sm">24/7 free and confidential support</p>
                    </div>
                    <button
                      onClick={() => window.open('tel:988')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Call 988
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Resources</h3>
              <div className="space-y-3">
                <a
                  href={EMERGENCY_RESOURCES.medical.findADoctor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Find a Doctor</h4>
                      <p className="text-gray-600 text-sm">Locate healthcare providers in your area</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </a>

                <a
                  href={EMERGENCY_RESOURCES.medical.tmsPractitioners}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">TMS Practitioners</h4>
                      <p className="text-gray-600 text-sm">Find doctors familiar with Dr. Sarno's approach</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </a>
              </div>
            </div>

            {/* Mental Health Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mental Health Support</h3>
              <div className="space-y-3">
                <a
                  href={EMERGENCY_RESOURCES.mentalHealth.psychologyToday}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Psychology Today</h4>
                      <p className="text-gray-600 text-sm">Find therapists and mental health professionals</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </a>

                <a
                  href={EMERGENCY_RESOURCES.mentalHealth.samhsa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">SAMHSA National Helpline</h4>
                      <p className="text-gray-600 text-sm">Treatment referral and information service</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
