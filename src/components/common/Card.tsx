import React from 'react';
import { gradients, shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div className={`relative ${hover ? 'group' : ''}`}>
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/0 via-brand-primary/20 to-brand-primary/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
      )}
      <div className={`relative ${gradients.card} border border-border-primary rounded-lg ${shadows.card} ${hover ? 'group-hover:border-brand-primary/50' : ''} ${className}`}>
        {children}
      </div>
    </div>
  );
}