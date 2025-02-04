import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { DisciplineCard } from './DisciplineCard';
import { DisciplineSectionHeader } from './DisciplineSectionHeader';
import { DisciplineTest } from '../types';

interface DisciplineSectionProps {
  title: string;
  icon: LucideIcon;
  tests: DisciplineTest[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function DisciplineSection({ 
  title, 
  icon: Icon, 
  tests, 
  isExpanded, 
  onToggle 
}: DisciplineSectionProps) {
  return (
    <div className="mb-8">
      <DisciplineSectionHeader
        title={title}
        icon={Icon}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tests.map((test) => (
            <DisciplineCard key={test.name} test={test} />
          ))}
        </div>
      )}
    </div>
  );
}