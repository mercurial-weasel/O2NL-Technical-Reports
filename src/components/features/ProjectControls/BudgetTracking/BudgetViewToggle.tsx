import React from 'react';

interface BudgetViewToggleProps {
  viewMode: 'table' | 'hours' | 'budget';
  onViewChange: (mode: 'table' | 'hours' | 'budget') => void;
}

export function BudgetViewToggle({ viewMode, onViewChange }: BudgetViewToggleProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => onViewChange('table')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'table'
              ? 'bg-brand-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => onViewChange('hours')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'hours'
              ? 'bg-brand-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Hours View
        </button>
        <button
          onClick={() => onViewChange('budget')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'budget'
              ? 'bg-brand-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Budget View
        </button>
      </div>
    </div>
  );
}