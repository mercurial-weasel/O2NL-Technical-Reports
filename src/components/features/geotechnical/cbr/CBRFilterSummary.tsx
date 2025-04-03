import React from 'react';

interface CBRFilterSummaryProps {
  filteredCount: number;
  totalCount: number;
  selectedSampleIds: string[];
  selectedInvestigationId?: string;
  selectedGeologicalUnits: string[];
  depthRange?: [number, number];
}

export const CBRFilterSummary: React.FC<CBRFilterSummaryProps> = ({
  filteredCount,
  totalCount,
  selectedSampleIds,
  selectedInvestigationId,
  selectedGeologicalUnits = [],
  depthRange
}) => {
  const hasFilters = selectedSampleIds.length > 0 || 
                    selectedInvestigationId || 
                    selectedGeologicalUnits.length > 0 ||
                    (depthRange && (depthRange[0] > 0 || depthRange[1] < 40));

  return (
    <div className="mb-4 px-4">
      <div className="text-sm text-text-muted">
        <span className="font-medium">Showing {filteredCount} of {totalCount} samples</span>
        {hasFilters && (
          <span className="ml-2">
            Filtered by: 
            {selectedSampleIds.length > 0 && (
              <span> Sample IDs: {selectedSampleIds.length === 1 ? selectedSampleIds[0] : `${selectedSampleIds.length} selected`}</span>
            )}
            {selectedInvestigationId && <span> Investigation ID: {selectedInvestigationId}</span>}
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
