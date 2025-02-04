import { useState } from 'react';

export function useZoneSelection() {
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZones(prev => new Set(prev).add(zoneId));
  };

  const handleZoneDeselect = (zoneId: string) => {
    setSelectedZones(prev => {
      const next = new Set(prev);
      next.delete(zoneId);
      return next;
    });
  };

  const handleClearZoneSelection = () => {
    setSelectedZones(new Set());
  };

  return {
    selectedZones,
    handleZoneSelect,
    handleZoneDeselect,
    handleClearZoneSelection
  };
}