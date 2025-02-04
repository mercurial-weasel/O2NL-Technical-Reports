import React from 'react';
import { DisciplineTest } from '../types';

interface DisciplineCardProps {
  test: DisciplineTest;
}

const statusConfig = {
  published: {
    interactive: true,
    glowColor: 'from-brand-primary/0 via-brand-primary/20 to-brand-primary/0',
    borderHoverColor: 'group-hover:border-brand-primary/50',
    bgHoverColor: 'group-hover:bg-brand-primary/10',
    textHoverColor: 'group-hover:text-brand-primary',
    message: '',
    iconColor: 'text-brand-primary',
    baseOpacity: 'opacity-100'
  },
  draft: {
    interactive: true,
    glowColor: 'from-brand-primary/0 via-brand-primary/20 to-brand-primary/0',
    borderHoverColor: 'group-hover:border-brand-primary/50',
    bgHoverColor: 'group-hover:bg-brand-primary/10',
    textHoverColor: 'group-hover:text-brand-primary',
    message: 'Draft',
    iconColor: 'text-brand-tertiary',
    baseOpacity: 'opacity-90'
  },
  concept: {
    interactive: true,
    glowColor: 'from-brand-primary/0 via-brand-primary/20 to-brand-primary/0',
    borderHoverColor: 'group-hover:border-brand-primary/50',
    bgHoverColor: 'group-hover:bg-brand-primary/10',
    textHoverColor: 'group-hover:text-brand-primary',
    message: 'Concept',
    iconColor: 'text-brand-secondary',
    baseOpacity: 'opacity-90'
  },
  'not-available': {
    interactive: false,
    glowColor: '',
    borderHoverColor: '',
    bgHoverColor: '',
    textHoverColor: '',
    message: 'Coming Soon',
    iconColor: 'text-gray-500',
    baseOpacity: 'opacity-50'
  }
};

export function DisciplineCard({ test }: DisciplineCardProps) {
  const Icon = test.icon.icon;
  const config = statusConfig[test.status] || statusConfig['not-available'];
  const CardWrapper = config.interactive && test.onClick ? 'button' : 'div';
  
  return (
    <CardWrapper
      onClick={config.interactive ? test.onClick : undefined}
      className={`group relative text-left h-16 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background-base rounded-lg ${
        !config.interactive ? 'cursor-not-allowed' : ''
      } ${config.baseOpacity}`}
    >
      {/* Glow effect - only show for interactive cards */}
      {config.interactive && (
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${config.glowColor} rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300`} />
      )}
      
      {/* Status watermark for draft and concept */}
      {(test.status === 'draft' || test.status === 'concept') && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-background-base border border-current z-10"
          style={{ color: test.status === 'draft' ? '#F2CD00' : '#0077FF' }}>
          {config.message}
        </div>
      )}
      
      {/* Card content */}
      <div className={`relative bg-gradient-to-br from-background-card-from to-background-card-to border border-border-primary rounded-lg p-4 transition-all duration-300 ${
        config.interactive ? config.borderHoverColor : 'border-gray-700/50'
      } h-full flex items-center gap-3`}>
        <div className={`p-1.5 rounded-lg ${
          config.interactive 
            ? `bg-${config.iconColor}/5 ${config.bgHoverColor}` 
            : 'bg-gray-600/5'
          } transition-colors`}>
          <div className={config.iconColor}>
            <Icon {...test.icon.props} />
          </div>
        </div>
        <span className={`text-sm font-medium ${
          config.interactive 
            ? `text-text-primary ${config.textHoverColor}` 
            : 'text-gray-500'
          } transition-colors duration-300`}>
          {test.name}
        </span>
        {test.status === 'not-available' && (
          <span className="ml-auto text-xs text-gray-500">
            {config.message}
          </span>
        )}
      </div>
    </CardWrapper>
  );
}