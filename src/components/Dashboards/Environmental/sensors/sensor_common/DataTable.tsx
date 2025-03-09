import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Column {
  field: string;
  title: string;
  align?: 'left' | 'right' | 'center';
  formatter?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  initialSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export function DataTable({ data, columns, initialSort }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState(initialSort || {
    field: columns[0].field,
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

  const sortedData = [...data].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    }
    return (aValue - bValue) * direction;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((column) => (
              <th
                key={column.field}
                onClick={() => handleSort(column.field)}
                className={`py-3 px-4 text-${column.align || 'left'} text-sm font-medium text-brand-secondary cursor-pointer group`}
              >
                <div className={`flex items-center gap-1 hover:text-brand-primary transition-colors ${
                  column.align === 'right' ? 'justify-end' : 
                  column.align === 'center' ? 'justify-center' : 
                  'justify-start'
                }`}>
                  {column.title}
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator(column.field)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20">
              {columns.map((column) => (
                <td
                  key={column.field}
                  className={`py-3 px-4 text-sm text-${column.align || 'left'} ${
                    index === 0 ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  {column.formatter ? column.formatter(row[column.field]) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}