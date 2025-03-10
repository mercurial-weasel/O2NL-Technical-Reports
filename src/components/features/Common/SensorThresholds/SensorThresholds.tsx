import React from 'react';

interface Threshold {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface SensorThresholdsProps {
  title: string;
  thresholds: Threshold[];
}

export function SensorThresholds({ title, thresholds }: SensorThresholdsProps) {
  return (
    <div 
      role="region" 
      aria-label={title} 
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
      data-testid="thresholds-container"
    >
      <h4 className="text-sm font-medium text-text-secondary mb-4">{title}</h4>
      <ul className="space-y-3" data-testid="thresholds-list">
        {thresholds.map((threshold, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                role="presentation"
                aria-hidden="true"
                data-testid={`threshold-indicator-${index}`}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: threshold.color }}
              />
              <span className="text-sm text-text-primary">{threshold.label}</span>
            </div>
            <span className="text-sm text-text-secondary">
              {threshold.value} {threshold.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}