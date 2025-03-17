import React from 'react';

interface PSDFilterSummaryProps {
  filteredCount: number;
  totalCount: number;
  selectedAditIds: string[];
  selectedLocationIds: string[];
  selectedSampleType?: string;
  selectedSubzones?: string[];  // Changed from string to string[]
  depthRange?: [number, number];
}

export const PSDFilterSummary: React.FC<PSDFilterSummaryProps> = ({
  filteredCount,
  totalCount,
  selectedAditIds,
  selectedLocationIds,
  selectedSampleType,
  selectedSubzones = [],  // Default to empty array
  depthRange
}) => {
  const hasFilters = selectedAditIds.length > 0 || 
                    selectedLocationIds.length > 0 || 
                    selectedSampleType || 
                    selectedSubzones.length > 0 ||
                    (depthRange && (depthRange[0] > 0 || depthRange[1] < 40));

  return (
    <div className="mb-4 px-4">
      <div className="text-sm text-text-muted">
        <span className="font-medium">Showing {filteredCount} of {totalCount} samples</span>
        {hasFilters && (
          <span className="ml-2">
            Filtered by: 
            {selectedAditIds.length > 0 && (
              <span> Adit IDs: {selectedAditIds.length === 1 ? selectedAditIds[0] : `${selectedAditIds.length} selected`}</span>
            )}
            {selectedLocationIds.length > 0 && (
              <span> Location IDs: {selectedLocationIds.length === 1 ? selectedLocationIds[0] : `${selectedLocationIds.length} selected`}</span>
            )}
            {selectedSampleType && <span> Sample Type: {selectedSampleType}</span>}
            {selectedSubzones.length > 0 && (
              <span> Subzones: {selectedSubzones.length === 1 ? selectedSubzones[0] : `${selectedSubzones.length} selected`}</span>
            )}
            {depthRange && (depthRange[0] > 0 || depthRange[1] < 40) && (
              <span> Depth: {depthRange[0].toFixed(1)}m - {depthRange[1].toFixed(1)}m</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};
