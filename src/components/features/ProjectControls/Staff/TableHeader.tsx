import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { MonthColumn } from '../types';

interface TableHeaderProps {
  monthColumns: MonthColumn[];
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
}

export function TableHeader({ monthColumns, sortConfig, onSort }: TableHeaderProps) {
  const renderSortIndicator = (field: string) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <tr className="border-b border-gray-700">
      {/* Fixed columns */}
      <th className="sticky left-0 z-10 bg-background-base py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group">
        <div className="flex items-center gap-1 hover:text-brand-primary transition-colors" onClick={() => onSort('Name')}>
          Name
          <span className="transition-opacity duration-200 group-hover:opacity-100">
            {renderSortIndicator('Name')}
          </span>
        </div>
      </th>
      <th className="sticky left-[150px] z-10 bg-background-base py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group">
        <div className="flex items-center gap-1 hover:text-brand-primary transition-colors" onClick={() => onSort('Team')}>
          Team
          <span className="transition-opacity duration-200 group-hover:opacity-100">
            {renderSortIndicator('Team')}
          </span>
        </div>
      </th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Location</th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">NOP Type</th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Organization</th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Role</th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Phase</th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Status</th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group">
        <div className="flex items-center gap-1 hover:text-brand-primary transition-colors" onClick={() => onSort('RequiredStart')}>
          Required Start
          <span className="transition-opacity duration-200 group-hover:opacity-100">
            {renderSortIndicator('RequiredStart')}
          </span>
        </div>
      </th>
      <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group">
        <div className="flex items-center gap-1 hover:text-brand-primary transition-colors" onClick={() => onSort('RequiredFinish')}>
          Required Finish
          <span className="transition-opacity duration-200 group-hover:opacity-100">
            {renderSortIndicator('RequiredFinish')}
          </span>
        </div>
      </th>
      <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">FTE AVE</th>

      {/* Monthly FTE columns */}
      {monthColumns.map(month => (
        <th 
          key={month.key}
          className="py-3 px-2 text-right text-sm font-medium text-brand-secondary whitespace-nowrap"
        >
          {month.label}
        </th>
      ))}
    </tr>
  );
}