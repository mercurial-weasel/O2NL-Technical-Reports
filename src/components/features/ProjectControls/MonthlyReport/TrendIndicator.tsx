import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'unchanged';
  size?: number;
}

export function TrendIndicator({ trend, size = 20 }: TrendIndicatorProps) {
  const colors = {
    up: 'text-green-500',
    down: 'text-red-500',
    unchanged: 'text-gray-500'
  };

  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return <Icon className={`${colors[trend]}`} size={size} />;
}