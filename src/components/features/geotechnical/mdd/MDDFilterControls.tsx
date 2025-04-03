import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@common/Button/Button';

interface MDDFilterControlsProps {
  uniquePointIds: string[];
  uniqueSampleTypes: string[];
  uniqueGeologicalUnits: string[];
  selectedPointIds: string[];
  setSelectedPointIds: (ids: string[]) => void;
  selectedSampleType: string;
  setSelectedSampleType: (type: string) => void;
  selectedGeologicalUnits: string[];
  setSelectedGeologicalUnits: (units: string[]) => void;
  handleResetFilters: () => void;
}

export const MDDFilterControls: React.FC<MDDFilterControlsProps> = ({
  uniquePointIds,
  uniqueSampleTypes,
  uniqueGeologicalUnits,
  selectedPointIds,
  setSelectedPointIds,
  selectedSampleType,
  setSelectedSampleType,
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
  const handlePointIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedPointIds(prev => toggleArrayItem(prev, value));
    }
  };

  const handleGeologicalUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedGeologicalUnits(prev => toggleArrayItem(prev, value));
    }
  };

  // Remove a single selected item
  const removePointId = (id: string) => {
    setSelectedPointIds(prev => prev.filter(i => i !== id));
  };

  const removeGeologicalUnit = (unit: string) => {
    setSelectedGeologicalUnits(prev => prev.filter(i => i !== unit));
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <label htmlFor="point-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Point ID
          </label>
          <select
            id="point-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value=""
            onChange={handlePointIdChange}
          >
            <option value="">Select Point IDs...</option>
            {uniquePointIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="sample-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Sample Type
          </label>
          <select
            id="sample-type-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value={selectedSampleType}
            onChange={(e) => setSelectedSampleType(e.target.value)}
          >
            <option value="">All Sample Types</option>
            {uniqueSampleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
      {(selectedPointIds.length > 0 || selectedGeologicalUnits.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedPointIds.map(id => (
            <div key={id} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Point: {id}</span>
              <button 
                onClick={() => removePointId(id)}
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
