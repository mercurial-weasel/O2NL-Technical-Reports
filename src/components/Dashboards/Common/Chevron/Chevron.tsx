import React from 'react';

interface ChevronProps {
  indicator: string;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  arrowWidth?: number;
  className?: string;
}

export function Chevron({
  indicator,
  backgroundColor = 'bg-blue-900',
  textColor = 'text-white',
  width = 100,
  height = 20,
  arrowWidth = 20,
  className = ''
}: ChevronProps) {
  // Calculate viewBox dimensions
  const viewBoxWidth = width + arrowWidth;
  const viewBoxHeight = height;

  return (
    <div className={`inline-block ${className}`} style={{ width: `${viewBoxWidth}px`, height: `${viewBoxHeight}px` }}>
      <div className="relative w-full h-full">
        {/* Base rectangle */}
        <div className={`absolute left-0 top-0 h-full ${backgroundColor}`} style={{ width: `${width}px` }} />
        
        {/* Triangle */}
        <div 
          className={`absolute top-0 h-full ${backgroundColor}`} 
          style={{ 
            left: `${width}px`,
            width: `${arrowWidth}px`,
            clipPath: `polygon(0 0, 100% 50%, 0 100%)`
          }} 
        />

        {/* Text */}
        <div 
          className={`absolute left-0 top-0 h-full flex items-center justify-center ${textColor} font-bold text-sm`}
          style={{ width: `${width}px` }}
        >
          {indicator}
        </div>
      </div>
    </div>
  );
}