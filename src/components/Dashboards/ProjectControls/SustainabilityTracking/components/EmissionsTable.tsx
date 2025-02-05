import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmissionSourceType } from '../../../../../api/emissions/types';
import { MonthlyEmissions } from '../../../../../api/emissions/transformations';

interface EmissionsTableProps {
  data: MonthlyEmissions[];
}

type SortConfig = {
  field: string;
  direction: 'asc' | 'desc';
};

export function EmissionsTable({ data }: EmissionsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'month',
    direction: 'asc'
  });

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIndicator = (field: string) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Get all emission sources
  const sources = Object.keys(data[0]?.emissions || {}) as EmissionSourceType[];

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.field === 'month') {
      return a.month.localeCompare(b.month) * direction;
    }
    if (sortConfig.field === 'total') {
      return (a.total - b.total) * direction;
    }
    return ((a.emissions[sortConfig.field as EmissionSourceType] || 0) - 
            (b.emissions[sortConfig.field as EmissionSourceType] || 0)) * direction;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th 
              onClick={() => handleSort('month')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Month
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('month')}
                </span>
              </div>
            </th>
            {sources.map(source => (
              <th
                key={source}
                onClick={() => handleSort(source)}
                className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                  {source}
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator(source)}
                  </span>
                </div>
              </th>
            ))}
            <th
              onClick={() => handleSort('total')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Total
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('total')}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((monthData, index) => (
            <tr 
              key={monthData.month}
              className={`border-b border-gray-700/50 hover:bg-gray-700/20 ${
                index % 2 === 0 ? 'bg-gray-800/20' : ''
              }`}
            >
              <td className="py-3 px-4 text-sm text-text-primary">
                {monthData.month}
              </td>
              {sources.map(source => (
                <td 
                  key={source}
                  className="py-3 px-4 text-sm text-right text-text-secondary"
                >
                  {(monthData.emissions[source] || 0).toFixed(2)}
                </td>
              ))}
              <td className="py-3 px-4 text-sm text-right font-medium text-text-primary">
                {monthData.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}