import React from 'react';
import { BarChart2, Table2, Map } from 'lucide-react';

interface ViewModeToggleProps {
  mode: 'table' | 'chart' | 'map';
  onChange: (mode: 'table' | 'chart' | 'map') => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
      <button
        onClick={() => onChange('chart')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'chart'
            ? 'bg-brand-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <BarChart2 className="w-4 h-4" />
        <span>Chart</span>
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'map'
            ? 'bg-brand-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Map className="w-4 h-4" />
        <span>Map</span>
      </button>
      <button
        onClick={() => onChange('table')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'table'
            ? 'bg-brand-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Table2 className="w-4 h-4" />
        <span>Table</span>
      </button>
    </div>
  );
}