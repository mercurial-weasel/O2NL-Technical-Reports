import React from 'react';
import { Layers, X } from 'lucide-react';
import { Zone } from '../../../../types/report';

interface ZonesCardProps {
  zones: Zone[];
  selectedZones: Set<string>;
  onZoneSelect: (id: string) => void;
  onZoneDeselect: (id: string) => void;
  onClearSelection: () => void;
}

export function ZonesCard({ zones, selectedZones, onZoneSelect, onZoneDeselect, onClearSelection }: ZonesCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-medium text-brand-secondary">Zones</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">
            {selectedZones.size} of {zones.length} selected
          </span>
          {selectedZones.size > 0 && (
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
      <div className="flex flex-wrap gap-2">
        {zones.map((zone) => {
          const isSelected = selectedZones.has(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => isSelected ? onZoneDeselect(zone.id) : onZoneSelect(zone.id)}
              className="flex-1 basis-[calc(33.333%-0.5rem)] min-w-[calc(33.333%-0.5rem)] p-2 text-xs rounded transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: isSelected ? `${zone.color}20` : 'rgba(55, 65, 81, 0.5)',
                color: isSelected ? zone.color : '#9CA3AF',
                borderWidth: 1,
                borderColor: isSelected ? zone.color : 'transparent'
              }}
            >
              <span className="font-medium whitespace-nowrap">{zone.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}