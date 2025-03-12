import React from 'react';
import { BarChart, Table as TableIcon, X } from 'lucide-react';
import { Button } from '@common/Button/Button';

type ViewMode = 'chart' | 'table';

interface MDDFilterControlsProps {
  uniqueAditIds: string[];
  uniqueLocationIds: string[];
  uniqueSampleTypes: string[];
  selectedAditIds: string[];
  setSelectedAditIds: (ids: string[]) => void;
  selectedLocationIds: string[];
  setSelectedLocationIds: (ids: string[]) => void;
  selectedSampleType: string;
  setSelectedSampleType: (type: string) => void;
  handleResetFilters: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const MDDFilterControls: React.FC<MDDFilterControlsProps> = ({
  uniqueAditIds,
  uniqueLocationIds,
  uniqueSampleTypes,
  selectedAditIds,
  setSelectedAditIds,
  selectedLocationIds,
  setSelectedLocationIds,
  selectedSampleType,
  setSelectedSampleType,
  handleResetFilters,
  viewMode,
  setViewMode
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
  const handleAditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedAditIds(prev => toggleArrayItem(prev, value));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedLocationIds(prev => toggleArrayItem(prev, value));
    }
  };

  // Remove a single selected item
  const removeAditId = (id: string) => {
    setSelectedAditIds(prev => prev.filter(i => i !== id));
  };

  const removeLocationId = (id: string) => {
    setSelectedLocationIds(prev => prev.filter(i => i !== id));
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-5 gap-4 mb-3">
        <div>
          <label htmlFor="adit-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Adit ID
          </label>
          <select
            id="adit-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value=""
            onChange={handleAditChange}
          >
            <option value="">Select Adit IDs...</option>
            {uniqueAditIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Location ID
          </label>
          <select
            id="location-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            value=""
            onChange={handleLocationChange}
          >
            <option value="">Select Locations...</option>
            {uniqueLocationIds.map(id => (
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

        {/* View Mode Toggle */}
        <div className="flex items-end">
          <div className="w-full flex rounded-md border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-sm border-r border-gray-300 ${
                viewMode === 'chart' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart className="w-4 h-4 mr-2" /> Chart
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-sm ${
                viewMode === 'table' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TableIcon className="w-4 h-4 mr-2" /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Selected filters display */}
      {(selectedAditIds.length > 0 || selectedLocationIds.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAditIds.map(id => (
            <div key={id} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Adit: {id}</span>
              <button 
                onClick={() => removeAditId(id)}
                className="text-primary hover:text-primary-dark"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedLocationIds.map(id => (
            <div key={id} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Location: {id}</span>
              <button 
                onClick={() => removeLocationId(id)}
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
