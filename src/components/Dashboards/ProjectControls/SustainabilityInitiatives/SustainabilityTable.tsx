import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SustainabilityInitiative } from './data';

interface SustainabilityTableProps {
  data: SustainabilityInitiative[];
}

type SortField = keyof SustainabilityInitiative;

interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

export function SustainabilityTable({ data }: SustainabilityTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'theme', direction: 'asc' });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    return aValue.localeCompare(bValue) * direction;
  });

  const renderSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key as SortField)}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator(key as SortField)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
            >
              {Object.values(item).map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className={`py-3 px-4 text-sm ${
                    valueIndex === 0 ? 'text-text-primary font-medium' : 'text-text-secondary'
                  }`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}