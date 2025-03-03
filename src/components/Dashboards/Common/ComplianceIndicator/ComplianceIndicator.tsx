import React from 'react';

interface ComplianceIndicatorProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplianceIndicator({ status, size = 'md' }: ComplianceIndicatorProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'non-compliant':
        return 'bg-red-500/20 text-red-400';
      case 'under review':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const displayStatus = status || 'Unknown';
  const ariaLabel = `Compliance status: ${displayStatus.toLowerCase()}`;

  return (
    <span 
      role="status"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-full font-medium ${sizeClasses[size]} ${getStatusColor(status)}`}
      data-testid="compliance-indicator"
    >
      {displayStatus}
    </span>
  );
}