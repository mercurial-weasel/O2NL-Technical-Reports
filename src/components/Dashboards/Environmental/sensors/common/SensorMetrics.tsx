import React from 'react';
import { MetricCard } from './MetricCard';

interface Metric {
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

interface SensorMetricsProps {
  metrics: Metric[];
}

export function SensorMetrics({ metrics }: SensorMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}