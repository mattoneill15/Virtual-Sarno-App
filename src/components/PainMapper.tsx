'use client';

import { useState } from 'react';
import { PAIN_LOCATIONS } from '@/types';

interface PainPoint {
  id: string;
  location: string;
  intensity: number;
  x: number; // percentage from left
  y: number; // percentage from top
}

interface PainMapperProps {
  selectedPains: string[];
  onPainChange: (pains: string[]) => void;
  showIntensity?: boolean;
  className?: string;
}

export default function PainMapper({ 
  selectedPains, 
  onPainChange, 
  showIntensity = false,
  className = ""
}: PainMapperProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [intensityMode, setIntensityMode] = useState(false);

  // Predefined pain points with approximate body positions
  const painPoints: PainPoint[] = [
    { id: 'head', location: 'headaches', x: 50, y: 8, intensity: 5 },
    { id: 'neck', location: 'neck', x: 50, y: 18, intensity: 5 },
    { id: 'left-shoulder', location: 'shoulders', x: 35, y: 25, intensity: 5 },
    { id: 'right-shoulder', location: 'shoulders', x: 65, y: 25, intensity: 5 },
    { id: 'upper-back', location: 'upper back', x: 50, y: 30, intensity: 5 },
    { id: 'left-arm', location: 'arms', x: 25, y: 35, intensity: 5 },
    { id: 'right-arm', location: 'arms', x: 75, y: 35, intensity: 5 },
    { id: 'chest', location: 'chest', x: 50, y: 35, intensity: 5 },
    { id: 'lower-back', location: 'lower back', x: 50, y: 45, intensity: 5 },
    { id: 'hips', location: 'hips', x: 50, y: 55, intensity: 5 },
    { id: 'left-leg', location: 'legs', x: 40, y: 70, intensity: 5 },
    { id: 'right-leg', location: 'legs', x: 60, y: 70, intensity: 5 },
    { id: 'left-knee', location: 'knees', x: 40, y: 80, intensity: 5 },
    { id: 'right-knee', location: 'knees', x: 60, y: 80, intensity: 5 },
  ];

  const handlePainPointClick = (point: PainPoint) => {
    const isSelected = selectedPains.includes(point.location);
    let newPains: string[];
    
    if (isSelected) {
      newPains = selectedPains.filter(p => p !== point.location);
    } else {
      newPains = [...selectedPains, point.location];
    }
    
    onPainChange(newPains);
  };

  const getPainColor = (point: PainPoint) => {
    const isSelected = selectedPains.includes(point.location);
    if (!isSelected) return 'rgba(156, 163, 175, 0.3)'; // gray-400 with opacity
    
    if (showIntensity) {
      // Color intensity based on pain level (red scale)
      const intensity = point.intensity / 10;
      return `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`; // red-500 with varying opacity
    }
    
    return 'rgba(239, 68, 68, 0.7)'; // red-500
  };

  const getPainBorderColor = (point: PainPoint) => {
    const isSelected = selectedPains.includes(point.location);
    return isSelected ? '#dc2626' : '#9ca3af'; // red-600 or gray-400
  };

  return (
    <div className={`pain-mapper ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pain Location Mapper
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Click on the body areas where you experience pain. Selected areas will be highlighted in red.
        </p>
        
        {showIntensity && (
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => setIntensityMode(!intensityMode)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                intensityMode 
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              {intensityMode ? 'Exit Intensity Mode' : 'Set Pain Intensity'}
            </button>
            {intensityMode && (
              <span className="text-sm text-gray-600">
                Click on selected areas to adjust pain intensity
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body Diagram Container */}
      <div className="relative bg-white border border-gray-200 rounded-lg p-8">
        <div className="relative mx-auto" style={{ width: '200px', height: '400px' }}>
          {/* Simple body outline using CSS */}
          <div className="absolute inset-0">
            <svg
              width="200"
              height="400"
              viewBox="0 0 200 400"
              className="w-full h-full"
            >
              {/* Head */}
              <circle cx="100" cy="30" r="25" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Neck */}
              <rect x="90" y="55" width="20" height="15" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Torso */}
              <rect x="70" y="70" width="60" height="120" rx="10" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Arms */}
              <rect x="30" y="80" width="35" height="80" rx="15" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <rect x="135" y="80" width="35" height="80" rx="15" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Legs */}
              <rect x="80" y="190" width="15" height="120" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <rect x="105" y="190" width="15" height="120" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Feet */}
              <ellipse cx="87" cy="320" rx="12" ry="8" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <ellipse cx="113" cy="320" rx="12" ry="8" fill="none" stroke="#e5e7eb" strokeWidth="2" />
            </svg>
          </div>

          {/* Pain Points */}
          {painPoints.map((point) => (
            <button
              key={point.id}
              onClick={() => handlePainPointClick(point)}
              onMouseEnter={() => setHoveredArea(point.location)}
              onMouseLeave={() => setHoveredArea(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: '20px',
                height: '20px',
                backgroundColor: getPainColor(point),
                border: `2px solid ${getPainBorderColor(point)}`,
              }}
              title={`Click to ${selectedPains.includes(point.location) ? 'remove' : 'add'} ${point.location}`}
            >
              <span className="sr-only">{point.location}</span>
            </button>
          ))}

          {/* Hover tooltip */}
          {hoveredArea && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              {hoveredArea}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 opacity-30 border-2 border-gray-400"></div>
            <span className="text-gray-600">No Pain</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500 opacity-70 border-2 border-red-600"></div>
            <span className="text-gray-600">Pain Present</span>
          </div>
        </div>
      </div>

      {/* Selected Areas Summary */}
      {selectedPains.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Selected Pain Areas:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedPains.map((pain) => (
              <span
                key={pain}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {pain}
                <button
                  onClick={() => onPainChange(selectedPains.filter(p => p !== pain))}
                  className="ml-1 text-red-600 hover:text-red-800"
                  title={`Remove ${pain}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Selection Buttons */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Selection:</h4>
        <div className="flex flex-wrap gap-2">
          {PAIN_LOCATIONS.slice(0, 6).map((location) => (
            <button
              key={location}
              onClick={() => {
                const isSelected = selectedPains.includes(location);
                if (isSelected) {
                  onPainChange(selectedPains.filter(p => p !== location));
                } else {
                  onPainChange([...selectedPains, location]);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedPains.includes(location)
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
