import React from 'react';

interface StatusLevel {
  range: string;
  label: string;
  color: string;
}

interface StatusLegendProps {
  title: string;
  levels: StatusLevel[];
}

export function StatusLegend({ title, levels }: StatusLegendProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h4 className="text-sm font-medium text-text-secondary mb-4">{title}</h4>
      <div className="space-y-4">
        {levels.map(level => (
          <div key={level.range} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded flex-shrink-0"
              style={{ backgroundColor: `${level.color}40` }}
            />
            <div className="text-xs">
              <div className="text-text-primary">{level.label}</div>
              <div className="text-text-secondary">{level.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}