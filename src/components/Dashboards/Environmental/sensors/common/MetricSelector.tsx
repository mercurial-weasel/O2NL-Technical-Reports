import React from 'react';

interface Metric {
  key: string;
  label: string;
  unit?: string;
}

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetric: string;
  onChange: (metric: string) => void;
}

export function MetricSelector({ metrics, selectedMetric, onChange }: MetricSelectorProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
        {metrics.map(metric => (
          <button
            key={metric.key}
            onClick={() => onChange(metric.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedMetric === metric.key
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {metric.label}
            {metric.unit && <span className="text-xs ml-1">({metric.unit})</span>}
          </button>
        ))}
      </div>
    </div>
  );
}