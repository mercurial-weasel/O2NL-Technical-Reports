import React from 'react';
import { BarChart, Table as TableIcon, Map } from 'lucide-react';

export type ViewMode = 'chart' | 'table' | 'map';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ 
  viewMode, 
  setViewMode, 
  className = '' 
}) => {
  return (
    <div className={`w-full flex rounded-md border border-border-subtle overflow-hidden ${className}`}>
      <button
        onClick={() => setViewMode('chart')}
        className={`flex-1 flex items-center justify-center py-2 px-3 text-sm border-r border-border-subtle ${
          viewMode === 'chart' 
            ? 'bg-primary text-text-on-primary' 
            : 'bg-background-card text-text-primary hover:bg-background-muted'
        }`}
      >
        <BarChart className="w-4 h-4 mr-2" /> Chart
      </button>
      <button
        onClick={() => setViewMode('table')}
        className={`flex-1 flex items-center justify-center py-2 px-3 text-sm border-r border-border-subtle ${
          viewMode === 'table' 
            ? 'bg-primary text-text-on-primary' 
            : 'bg-background-card text-text-primary hover:bg-background-muted'
        }`}
      >
        <TableIcon className="w-4 h-4 mr-2" /> Table
      </button>
      <button
        onClick={() => setViewMode('map')}
        className={`flex-1 flex items-center justify-center py-2 px-3 text-sm ${
          viewMode === 'map' 
            ? 'bg-primary text-text-on-primary' 
            : 'bg-background-card text-text-primary hover:bg-background-muted'
        }`}
      >
        <Map className="w-4 h-4 mr-2" /> Map
      </button>
    </div>
  );
};
