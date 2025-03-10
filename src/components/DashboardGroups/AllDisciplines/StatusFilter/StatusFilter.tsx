import React, { useState } from 'react';
import { Filter, HelpCircle } from 'lucide-react';
import { DisciplineStatus } from '../types';

interface StatusFilterProps {
  selectedStatus: Set<DisciplineStatus | 'all'>;
  onChange: (status: DisciplineStatus | 'all') => void;
}

const statusOptions: { value: DisciplineStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'concept', label: 'Concept' },
  { value: 'not-available', label: 'Coming Soon' },
];

const statusColors = {
  published: 'text-brand-primary',
  draft: 'text-brand-tertiary',
  concept: 'text-brand-secondary',
  'not-available': 'text-gray-500',
  all: 'text-text-primary'
} as const;

const statusDefinitions = {
  published: 'Fully tested items ready for decision-making use',
  draft: 'Items under development, open for feedback',
  concept: 'Items in design phase with team discussions ongoing',
  'not-available': 'Proposed items where work has not yet started'
};

export function StatusFilter({ selectedStatus, onChange }: StatusFilterProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-text-secondary">
        <Filter className="w-4 h-4" />
        <span className="text-sm">Filter by status:</span>
        <div className="relative">
          <button
            className="text-text-muted hover:text-text-secondary transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Status definitions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute right-0 mt-2 w-72 p-4 bg-background-card-from border border-border-primary rounded-lg shadow-xl z-50">
              <div className="space-y-3">
                {Object.entries(statusDefinitions).map(([status, definition]) => (
                  <div key={status} className="flex flex-col">
                    <span className={`text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                      {statusOptions.find(opt => opt.value === status)?.label}
                    </span>
                    <span className="text-xs text-text-secondary mt-0.5">
                      {definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {statusOptions.map((option) => {
          const isSelected = selectedStatus.has(option.value);
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                px-3 py-1.5 text-sm rounded-lg transition-all duration-200
                border border-border-primary
                ${isSelected ? 'bg-brand-primary/20 text-brand-primary border-brand-primary' : 
                  'bg-gray-800/50 hover:bg-gray-700/50 text-text-secondary hover:text-text-primary'}
              `}
            >
              <span className="flex items-center gap-2">
                <span>{option.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}