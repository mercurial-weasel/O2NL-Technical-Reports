import React, { useState } from 'react';
import { Atterbergs, AtterbergsFilters } from '@api/geotechnical/plasticity';

interface FilterProps {
  data: Atterbergs[];
  onFilterChange: (filters: AtterbergsFilters) => void;
  onClearSelections: () => void;
  selectedItemsCount?: number;
}

const AtterbergsFilterPanel: React.FC<FilterProps> = ({ 
  data, 
  onFilterChange, 
  onClearSelections,
  selectedItemsCount = 0
}) => {
  const [filters, setFilters] = useState<AtterbergsFilters>({});
  
  // Extract unique values for dropdowns
  const locations = [...new Set(data.map(item => item.location_id))].sort();
  const adits = [...new Set(data.map(item => item.adit_id))].sort();
  const subzones = [...new Set(data.map(item => item.construction_subzone))].sort();

  const handleFilterChange = (key: keyof AtterbergsFilters, value: string) => {
    // Clear filter if empty value selected
    const updatedFilters = { 
      ...filters, 
      [key]: value === "" ? undefined : value 
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
    onClearSelections();
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== undefined).length;
  };

  return (
    <div className="bg-white p-4 mb-4 border border-gray-300 rounded-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={filters.location_id || ""}
            onChange={(e) => handleFilterChange('location_id', e.target.value)}
          >
            <option value="">All locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adit</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={filters.adit_id || ""}
            onChange={(e) => handleFilterChange('adit_id', e.target.value)}
          >
            <option value="">All adits</option>
            {adits.map(adit => (
              <option key={adit} value={adit}>{adit}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Construction Subzone</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={filters.construction_subzone || ""}
            onChange={(e) => handleFilterChange('construction_subzone', e.target.value)}
          >
            <option value="">All subzones</option>
            {subzones.map(subzone => (
              <option key={subzone} value={subzone}>{subzone}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200"
          >
            Clear All Filters
          </button>
        </div>
      </div>
      
      {selectedItemsCount > 0 && (
        <div className="mt-4 bg-blue-50 p-2 rounded border border-blue-200 text-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Selected Items:</span> {selectedItemsCount} sample{selectedItemsCount !== 1 ? 's' : ''}
              <span className="ml-2 text-xs text-blue-700">
                (Click to toggle selection, Shift+Click to add, Ctrl+Click to remove)
              </span>
            </div>
            <button
              onClick={onClearSelections}
              className="text-xs px-2 py-1 bg-white border border-blue-300 hover:bg-gray-100 rounded"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtterbergsFilterPanel;
