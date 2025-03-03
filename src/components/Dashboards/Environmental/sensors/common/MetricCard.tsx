import React from 'react';
import { Card } from '../../../../common/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  change?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, unit, change, threshold, icon }: MetricCardProps) {
  const getStatusColor = () => {
    if (!threshold) return 'text-text-primary';
    if (value >= threshold.critical) return 'text-red-400';
    if (value >= threshold.warning) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="p-4" hover>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-1">{title}</h3>
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {value.toFixed(1)}{unit}
          </div>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-brand-primary/10">
            {icon}
          </div>
        )}
      </div>
      {typeof change !== 'undefined' && (
        <div className={`flex items-center gap-1 text-sm mt-2 ${
          change > 0 ? 'text-green-400' :
          change < 0 ? 'text-red-400' :
          'text-text-secondary'
        }`}>
          {change > 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : change < 0 ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      )}
    </Card>
  );
}