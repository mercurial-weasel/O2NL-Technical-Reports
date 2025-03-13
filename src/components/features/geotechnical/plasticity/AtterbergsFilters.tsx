import React, { useState, useEffect } from 'react';
import { Atterbergs, AtterbergsFilters } from '@api/geotechnical/plasticity';

interface FilterProps {
  data: Atterbergs[];
  onFilterChange: (filters: AtterbergsFilters) => void;
}

const AtterbergsFilterPanel: React.FC<FilterProps> = ({ data, onFilterChange }) => {
  const [filters, setFilters] = useState<AtterbergsFilters>({});
  
  // Extract unique values for dropdowns
  const locations = [...new Set(data.map(item => item.location_id))].sort();
  const adits = [...new Set(data.map(item => item.adit_id))].sort();

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
  };

  return (
    <div className="bg-white p-4 mb-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        
        <div className="flex items-end">
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtterbergsFilterPanel;
