import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@common/Button/Button';

interface CBRFilterControlsProps {
  uniqueSampleIds: string[];
  uniqueInvestigationIds: string[];
  uniqueGeologicalUnits: string[];
  selectedSampleIds: string[];
  setSelectedSampleIds: (ids: string[]) => void;
  selectedInvestigationId: string;
  setSelectedInvestigationId: (id: string) => void;
  selectedGeologicalUnits: string[];
  setSelectedGeologicalUnits: (units: string[]) => void;
  handleResetFilters: () => void;
}

export const CBRFilterControls: React.FC<CBRFilterControlsProps> = ({
  uniqueSampleIds,
  uniqueInvestigationIds,
  uniqueGeologicalUnits,
  selectedSampleIds,
  setSelectedSampleIds,
  selectedInvestigationId,
  setSelectedInvestigationId,
  selectedGeologicalUnits,
  setSelectedGeologicalUnits,
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

  const handleGeologicalUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedGeologicalUnits(prev => toggleArrayItem(prev, value));
    }
  };

  // Remove a single selected item
  const removeSampleId = (id: string) => {
    setSelectedSampleIds(prev => prev.filter(i => i !== id));
  };

  const removeGeologicalUnit = (unit: string) => {
    setSelectedGeologicalUnits(prev => prev.filter(i => i !== unit));
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
          <label htmlFor="investigation-id-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Investigation ID
          </label>
          <select
            id="investigation-id-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value={selectedInvestigationId}
            onChange={(e) => setSelectedInvestigationId(e.target.value)}
          >
            <option value="">All Investigation IDs</option>
            {uniqueInvestigationIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="geological-unit-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Geological Unit
          </label>
          <select
            id="geological-unit-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value=""
            onChange={handleGeologicalUnitChange}
          >
            <option value="">Select Geological Units...</option>
            {uniqueGeologicalUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
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
      {(selectedSampleIds.length > 0 || selectedGeologicalUnits.length > 0) && (
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
          {selectedGeologicalUnits.map(unit => (
            <div key={unit} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Geological Unit: {unit}</span>
              <button 
                onClick={() => removeGeologicalUnit(unit)}
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
