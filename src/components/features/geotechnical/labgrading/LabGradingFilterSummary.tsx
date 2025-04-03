import React from 'react';

interface LabGradingFilterSummaryProps {
  filteredCount: number;
  totalCount: number;
  selectedSampleIds: string[];
  selectedPointId?: string;
  selectedMaterialIds: string[];
}

export const LabGradingFilterSummary: React.FC<LabGradingFilterSummaryProps> = ({
  filteredCount,
  totalCount,
  selectedSampleIds,
  selectedPointId,
  selectedMaterialIds = []
}) => {
  const hasFilters = selectedSampleIds.length > 0 || 
                    selectedPointId || 
                    selectedMaterialIds.length > 0;

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
            {selectedPointId && <span> Point ID: {selectedPointId}</span>}
            {selectedMaterialIds.length > 0 && (
              <span> Material IDs: {selectedMaterialIds.length === 1 ? selectedMaterialIds[0] : `${selectedMaterialIds.length} selected`}</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};
