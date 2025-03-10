import React from 'react';

interface ParameterSelectorProps {
  selectedParameters: Set<'pm10' | 'pm2_5'>;
  onChange: (parameters: Set<'pm10' | 'pm2_5'>) => void;
}

export function ParameterSelector({ selectedParameters, onChange }: ParameterSelectorProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h4 className="text-sm font-medium text-text-secondary mb-4">Parameters</h4>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onChange(prev => {
            const next = new Set(prev);
            if (next.has('pm10')) {
              next.delete('pm10');
              if (next.size === 0) next.add('pm2_5');
            } else {
              next.add('pm10');
            }
            return next;
          })}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedParameters.has('pm10')
              ? 'bg-brand-primary text-white'
              : 'bg-gray-700/50 text-text-secondary hover:text-text-primary'
          }`}
        >
          PM10
        </button>
        <button
          onClick={() => onChange(prev => {
            const next = new Set(prev);
            if (next.has('pm2_5')) {
              next.delete('pm2_5');
              if (next.size === 0) next.add('pm10');
            } else {
              next.add('pm2_5');
            }
            return next;
          })}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedParameters.has('pm2_5')
              ? 'bg-brand-primary text-white'
              : 'bg-gray-700/50 text-text-secondary hover:text-text-primary'
          }`}
        >
          PM2.5
        </button>
      </div>
    </div>
  );
}