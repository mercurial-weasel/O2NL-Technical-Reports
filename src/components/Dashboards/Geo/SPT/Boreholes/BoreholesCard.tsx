import React from 'react';
import { MapPin, X } from 'lucide-react';
import { Point } from '@data/models';

interface BoreholesCardProps {
  points: Point[];
  selectedPointIds: Set<string>;
  onPointSelect: (pointId: string) => void;
  onPointDeselect: (pointId: string) => void;
  onClearSelection: () => void;
}

export function BoreholesCard({ 
  points, 
  selectedPointIds, 
  onPointSelect, 
  onPointDeselect,
  onClearSelection 
}: BoreholesCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-secondary" />
            <h3 className="text-sm font-medium text-brand-secondary">Boreholes</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">
              {selectedPointIds.size} of {points.length} selected
            </span>
            {selectedPointIds.size > 0 && (
              <button
                onClick={onClearSelection}
                className="text-xs text-text-muted hover:text-brand-secondary transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-1">
          {points.map((point) => {
            const isSelected = selectedPointIds.has(point.point_id);
            return (
              <button
                key={point.point_id}
                onClick={() => isSelected ? onPointDeselect(point.point_id) : onPointSelect(point.point_id)}
                className={`w-full px-3 py-1.5 rounded transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-brand-secondary/20 text-brand-secondary'
                    : 'hover:bg-gray-700/50 text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-xs font-medium truncate">
                  {point.point_id}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}