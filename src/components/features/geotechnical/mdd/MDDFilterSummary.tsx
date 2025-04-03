import React from 'react';

interface MDDFilterSummaryProps {
  filteredCount: number;
  totalCount: number;
  selectedPointIds: string[];
  selectedSampleType?: string;
  selectedGeologicalUnits: string[];
  depthRange?: [number, number];
}

export const MDDFilterSummary: React.FC<MDDFilterSummaryProps> = ({
  filteredCount,
  totalCount,
  selectedPointIds,
  selectedSampleType,
  selectedGeologicalUnits = [],
  depthRange
}) => {
  const hasFilters = selectedPointIds.length > 0 || 
                    selectedSampleType || 
                    selectedGeologicalUnits.length > 0 ||
                    (depthRange && (depthRange[0] > 0 || depthRange[1] < 40));

  return (
    <div className="mb-4 px-4">
      <div className="text-sm text-text-muted">
        <span className="font-medium">Showing {filteredCount} of {totalCount} samples</span>
        {hasFilters && (
          <span className="ml-2">
            Filtered by: 
            {selectedPointIds.length > 0 && (
              <span> Point IDs: {selectedPointIds.length === 1 ? selectedPointIds[0] : `${selectedPointIds.length} selected`}</span>
            )}
            {selectedSampleType && <span> Sample Type: {selectedSampleType}</span>}
            {selectedGeologicalUnits.length > 0 && (
              <span> Geological Units: {selectedGeologicalUnits.length === 1 ? selectedGeologicalUnits[0] : `${selectedGeologicalUnits.length} selected`}</span>
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
