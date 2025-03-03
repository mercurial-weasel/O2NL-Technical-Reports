import React from 'react';

interface DeviceStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DeviceStatusBadge({ status, size = 'md' }: DeviceStatusBadgeProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'fault':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getStatusColor(status)} animate-pulse`} />
  );
}