import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@common/Button/Button';

interface LabGradingFilterControlsProps {
  uniqueSampleIds: string[];
  uniquePointIds: string[];
  uniqueMaterialIds: string[];
  selectedSampleIds: string[];
  setSelectedSampleIds: (ids: string[]) => void;
  selectedPointId: string;
  setSelectedPointId: (id: string) => void;
  selectedMaterialIds: string[];
  setSelectedMaterialIds: (units: string[]) => void;
  handleResetFilters: () => void;
}

export const LabGradingFilterControls: React.FC<LabGradingFilterControlsProps> = ({
  uniqueSampleIds,
  uniquePointIds,
  uniqueMaterialIds,
  selectedSampleIds,
  setSelectedSampleIds,
  selectedPointId,
  setSelectedPointId,
  selectedMaterialIds,
  setSelectedMaterialIds,
  handleResetFilters
}) => {
  // Helper function to toggle an item in an array
  const toggleArrayItem = (array: string[], item: string): string[] => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  // Handler for multi-select dropdowns
  const handleSampleIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedSampleIds(prev => toggleArrayItem(prev, value));
    }
  };

  const handleMaterialIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedMaterialIds(prev => toggleArrayItem(prev, value));
    }
  };

  // Remove a single selected item
  const removeSampleId = (id: string) => {
    setSelectedSampleIds(prev => prev.filter(i => i !== id));
  };

  const removeMaterialId = (id: string) => {
    setSelectedMaterialIds(prev => prev.filter(i => i !== id));
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <label htmlFor="sample-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Sample ID
          </label>
          <select
            id="sample-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value=""
            onChange={handleSampleIdChange}
          >
            <option value="">Select Sample IDs...</option>
            {uniqueSampleIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="point-id-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Point ID
          </label>
          <select
            id="point-id-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value={selectedPointId}
            onChange={(e) => setSelectedPointId(e.target.value)}
          >
            <option value="">All Point IDs</option>
            {uniquePointIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="material-id-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Material ID
          </label>
          <select
            id="material-id-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value=""
            onChange={handleMaterialIdChange}
          >
            <option value="">Select Material IDs...</option>
            {uniqueMaterialIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Selected filters display */}
      {(selectedSampleIds.length > 0 || selectedMaterialIds.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSampleIds.map(id => (
            <div key={id} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Sample: {id}</span>
              <button 
                onClick={() => removeSampleId(id)}
                className="text-primary hover:text-primary-dark"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedMaterialIds.map(id => (
            <div key={id} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Material: {id}</span>
              <button 
                onClick={() => removeMaterialId(id)}
                className="text-primary hover:text-primary-dark"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
