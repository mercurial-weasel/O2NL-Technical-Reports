import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmissionRecord } from '../../../../../api/emissions/types';

interface EmissionsTableProps {
  data: EmissionRecord[];
}

type SortField = keyof EmissionRecord;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function EmissionsTable({ data }: EmissionsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'yearMonth',
    direction: 'desc'
  });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.field === 'yearMonth') {
      return a.yearMonth.localeCompare(b.yearMonth) * direction;
    }
    
    return ((a[sortConfig.field] as number) - (b[sortConfig.field] as number)) * direction;
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
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th 
              onClick={() => handleSort('category')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Category
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('category')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('yearMonth')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Month
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('yearMonth')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('amount')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Amount
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('amount')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('carbonEstimateKgCO2e')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Carbon Estimate (KgCO2e)
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('carbonEstimateKgCO2e')}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record, index) => (
            <tr 
              key={`${record.category}-${record.yearMonth}`}
              className={`border-b border-gray-700/50 hover:bg-gray-700/20 ${
                index % 2 === 0 ? 'bg-gray-800/20' : ''
              }`}
            >
              <td className="py-3 px-4 text-sm text-text-primary">
                {record.category}
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {record.yearMonth}
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.amount.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.carbonEstimateKgCO2e.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}