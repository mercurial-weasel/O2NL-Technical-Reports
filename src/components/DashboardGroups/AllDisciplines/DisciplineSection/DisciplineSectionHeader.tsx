import React from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

interface DisciplineSectionHeaderProps {
  title: string;
  icon: LucideIcon;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DisciplineSectionHeader({
  title,
  icon: Icon,
  isExpanded,
  onToggle
}: DisciplineSectionHeaderProps) {
  return (
    <button 
      onClick={onToggle}
      className="w-full flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity"
    >
      <Icon className="w-6 h-6 text-brand-primary" />
      <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-brand-primary ml-2" />
      ) : (
        <ChevronDown className="w-5 h-5 text-brand-primary ml-2" />
      )}
    </button>
  );
}