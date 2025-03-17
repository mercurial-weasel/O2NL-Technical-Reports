import React from 'react';
import { BarChart, Table as TableIcon, Map, X } from 'lucide-react';
import { Button } from '@common/Button/Button';

type ViewMode = 'chart' | 'table' | 'map';

interface PSDFilterControlsProps {
  uniqueAditIds: string[];
  uniqueLocationIds: string[];
  uniqueSampleTypes: string[];
  uniqueSubzones?: string[];  // Make optional
  selectedAditIds: string[];
  setSelectedAditIds: (ids: string[]) => void;
  selectedLocationIds: string[];
  setSelectedLocationIds: (ids: string[]) => void;
  selectedSampleType: string;
  setSelectedSampleType: (type: string) => void;
  selectedSubzones?: string[];  // Changed from string to string[]
  setSelectedSubzones?: (subzones: string[]) => void;  // Changed from string to string[]
  handleResetFilters: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const PSDFilterControls: React.FC<PSDFilterControlsProps> = ({
  uniqueAditIds,
  uniqueLocationIds,
  uniqueSampleTypes,
  uniqueSubzones = [],  // Default to empty array
  selectedAditIds,
  setSelectedAditIds,
  selectedLocationIds,
  setSelectedLocationIds,
  selectedSampleType,
  setSelectedSampleType,
  selectedSubzones = [],  // Default to empty array
  setSelectedSubzones = () => {},  // Default no-op function
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

  const handleSubzoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedSubzones(prev => toggleArrayItem(prev, value));
    }
  };

  // Remove a single selected item
  const removeAditId = (id: string) => {
    setSelectedAditIds(prev => prev.filter(i => i !== id));
  };

  const removeLocationId = (id: string) => {
    setSelectedLocationIds(prev => prev.filter(i => i !== id));
  };

  const removeSubzone = (subzone: string) => {
    setSelectedSubzones(prev => prev.filter(i => i !== subzone));
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
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
        
        {/* Only render subzone filter if uniqueSubzones is provided */}
        {uniqueSubzones.length > 0 && setSelectedSubzones && (
          <div>
            <label htmlFor="subzone-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Construction Subzone
            </label>
            <select
              id="subzone-filter"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              value=""
              onChange={handleSubzoneChange}
            >
              <option value="">Select Subzones...</option>
              {uniqueSubzones.map(subzone => (
                <option key={subzone} value={subzone}>{subzone}</option>
              ))}
            </select>
          </div>
        )}
        
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

      {/* View Mode Toggle */}
      <div className="mb-3">
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
            className={`flex-1 flex items-center justify-center py-2 px-3 text-sm border-r border-gray-300 ${
              viewMode === 'table' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TableIcon className="w-4 h-4 mr-2" /> Table
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center py-2 px-3 text-sm ${
              viewMode === 'map' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Map className="w-4 h-4 mr-2" /> Map
          </button>
        </div>
      </div>

      {/* Selected filters display */}
      {(selectedAditIds.length > 0 || selectedLocationIds.length > 0 || selectedSubzones.length > 0) && (
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
          {selectedSubzones.map(subzone => (
            <div key={subzone} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
              <span className="mr-1">Subzone: {subzone}</span>
              <button 
                onClick={() => removeSubzone(subzone)}
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
