import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { RoadmapItem } from '../../../types/roadmap';

interface SortConfig {
  field: keyof RoadmapItem | 'category';
  direction: 'asc' | 'desc';
}

interface SortableTableProps {
  data: RoadmapItem[];
  sortConfig: SortConfig;
  onSort: (field: keyof RoadmapItem | 'category') => void;
}

export function SortableTable({ data, sortConfig, onSort }: SortableTableProps) {
  // Helper function to render sort indicator
  const renderSortIndicator = (field: keyof RoadmapItem | 'category') => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Helper function to format cell content
  const formatCell = (item: RoadmapItem, field: keyof RoadmapItem | 'category') => {
    if (field === 'category') {
      return `${item.discipline} - ${item.subCategory}`;
    }
    if (field === 'targetDate') {
      return new Date(item[field]).toLocaleDateString();
    }
    if (field === 'priority') {
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
          item.priority === 1 ? 'bg-red-500/20 text-red-400' :
          item.priority === 2 ? 'bg-orange-500/20 text-orange-400' :
          item.priority === 3 ? 'bg-yellow-500/20 text-yellow-400' :
          item.priority === 4 ? 'bg-green-500/20 text-green-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {item[field]}
        </span>
      );
    }
    if (field === 'status') {
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'complete' ? 'bg-green-500/20 text-green-400' :
          item.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {item.status.replace('-', ' ')}
        </span>
      );
    }
    return item[field];
  };

  // Column definitions
  const columns = [
    { field: 'dashboardName' as const, label: 'Dashboard Name' },
    { field: 'category' as const, label: 'Category' },
    { field: 'priority' as const, label: 'Priority' },
    { field: 'status' as const, label: 'Status' },
    { field: 'system' as const, label: 'System' },
    { field: 'sme' as const, label: 'SME' },
    { field: 'implementer' as const, label: 'Implementer' },
    { field: 'targetDate' as const, label: 'Target Date' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map(({ field, label }) => (
              <th
                key={field}
                onClick={() => onSort(field)}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  {label}
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator(field)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
              {columns.map(({ field }) => (
                <td key={field} className="py-3 px-4 text-sm text-text-primary">
                  {formatCell(item, field)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}