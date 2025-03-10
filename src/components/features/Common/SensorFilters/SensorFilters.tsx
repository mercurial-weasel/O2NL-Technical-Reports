import React from 'react';
import { DateRangeSelector } from '@components/DateRangeSelector';
import { DeviceSelector } from '@components/DeviceSelector';

interface SensorFiltersProps {
  devices: Array<{ id: string; name: string; model?: string }>;
  selectedDevices: Set<string>;
  onDeviceChange: (value: string) => void;
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  selectedParameters: Set<string>;
  onParameterChange: (parameters: Set<string>) => void;
  parameters: Array<{ key: string; label: string }>;
}

export function SensorFilters({
  devices,
  selectedDevices,
  onDeviceChange,
  dateRange,
  onDateRangeChange,
  selectedParameters,
  onParameterChange,
  parameters
}: SensorFiltersProps) {
  return (
    <div 
      role="region" 
      aria-label="Sensor Filters"
      data-testid="sensor-filters"
      className="grid grid-cols-3 gap-4 mb-6"
    >
      <DeviceSelector
        devices={devices}
        selectedDevices={selectedDevices}
        onChange={onDeviceChange}
      />
      <DateRangeSelector
        dateRange={dateRange}
        onChange={onDateRangeChange}
      />
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Parameters
        </label>
        <div className="flex flex-wrap gap-2">
          {parameters.map(param => (
            <button
              key={param.key}
              data-testid={`parameter-${param.key}`}
              onClick={() => onParameterChange(prev => {
                const next = new Set(prev);
                if (next.has(param.key)) {
                  next.delete(param.key);
                  if (next.size === 0) {
                    next.add(parameters[0].key);
                  }
                } else {
                  next.add(param.key);
                }
                return next;
              })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedParameters.has(param.key)
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-700/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              {param.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}