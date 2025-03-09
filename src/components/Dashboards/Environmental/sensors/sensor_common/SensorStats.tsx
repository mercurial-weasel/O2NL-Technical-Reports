import React from 'react';
import { Card } from '@common';

interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
}

interface SensorStatsProps {
  title: string;
  stats: StatItem[];
}

export function SensorStats({ title, stats }: SensorStatsProps) {
  return (
    <Card className="p-4" hover>
      <h3 className="text-lg font-medium text-text-primary mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className="text-sm text-text-secondary">{stat.label}</div>
            <div className="text-lg font-medium text-text-primary">
              {stat.value}
              {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
            </div>
            {stat.change !== undefined && (
              <div className={`text-sm ${
                stat.status === 'positive' ? 'text-green-400' :
                stat.status === 'negative' ? 'text-red-400' :
                'text-text-secondary'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}