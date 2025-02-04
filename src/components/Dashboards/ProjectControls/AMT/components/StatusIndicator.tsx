import React from 'react';

interface StatusIndicatorProps {
  status: 'green' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ status, size = 'md' }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colors = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`${sizeClasses[size]} ${colors[status]} rounded-full animate-pulse`} />
  );
}