import React, { useState } from 'react';
import { Card } from '../../../../common/Card';
import { HelpCircle } from 'lucide-react';

interface DependenciesCardProps {
  dependencies: string[];
}

export function DependenciesCard({ dependencies }: DependenciesCardProps) {
  const [activeDependency, setActiveDependency] = useState<{ text: string; x: number; y: number } | null>(null);
  const [helpTooltip, setHelpTooltip] = useState(false);

  return (
    <Card className="p-6" hover>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Dependencies</h2>
        <div className="relative">
          <HelpCircle 
            className="w-5 h-5 text-text-secondary hover:text-text-primary cursor-help"
            onMouseEnter={() => setHelpTooltip(true)}
            onMouseLeave={() => setHelpTooltip(false)}
          />
          {helpTooltip && (
            <div className="absolute z-50 w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-xs"
              style={{
                top: '50%',
                right: '100%',
                transform: 'translateY(-50%)',
                marginRight: '10px',
              }}>
              <p className="text-text-primary">
                Dependencies are external factors or requirements that must be met for successful task completion.
                Monitor these closely as they may impact project timelines.
              </p>
            </div>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {dependencies.map((dependency, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setActiveDependency({ text: dependency, x: rect.left, y: rect.top });
            }}
            onMouseLeave={() => setActiveDependency(null)}
          >
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center text-xs">
              {index + 1}
            </span>
            <span className="text-text-secondary">{dependency}</span>
          </li>
        ))}
      </ul>

      {/* Dependency Tooltip */}
      {activeDependency && (
        <div 
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-xs"
          style={{
            top: '50%',
            left: `${activeDependency.x - 10}px`,
            transform: 'translate(-100%, -50%)',
            maxWidth: '300px'
          }}
        >
          <div className="space-y-2">
            <div className="font-medium text-brand-primary">Dependency Details</div>
            <p className="text-text-primary">{activeDependency.text}</p>
          </div>
        </div>
      )}
    </Card>
  );
}