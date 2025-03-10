import React from 'react';

interface LegendItem {
  label: string;
  value: string | number;
  color?: string;
  unit?: string;
}

interface ChartLegendProps {
  title: string;
  items: LegendItem[];
}

export function ChartLegend({ title, items }: ChartLegendProps) {
  return (
    <div 
      role="region"
      aria-label={title}
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
    >
      <h4 className="text-sm font-medium text-text-secondary mb-4">{title}</h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.color && (
              <div 
                role="presentation"
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: `${item.color}40` }}
              />
            )}
            <div className="text-xs">
              <div className="text-text-primary">{item.label}</div>
              <div className="text-text-secondary">
                {item.value}
                {item.unit && <span className="ml-1">{item.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}