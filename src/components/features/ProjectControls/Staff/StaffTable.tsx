import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { StaffMember, monthFormatter } from '@api/projectcontrols/peopleculture/staff';
import { MonthColumn } from './types';

interface StaffTableProps {
  data: StaffMember[];
  monthColumns: MonthColumn[];
}

type SortConfig = {
  field: keyof StaffMember;
  direction: 'asc' | 'desc';
};

const ITEMS_PER_PAGE = 25;

export function StaffTable({ data, monthColumns }: StaffTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });

  // Handle sorting
  const handleSort = (field: keyof StaffMember) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    if (sortConfig.field === 'requiredStart' || sortConfig.field === 'requiredFinish') {
      return (new Date(aValue as string).getTime() - new Date(bValue as string).getTime()) * direction;
    }

    return String(aValue).localeCompare(String(bValue)) * direction;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderSortIndicator = (field: keyof StaffMember) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Get FTE value for a specific month
  const getFTEForMonth = (staff: StaffMember, monthKey: string): number => {
    const isoMonth = monthFormatter.toISOFormat(monthKey);
    return staff.monthlyFTE[isoMonth] || 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-brand-secondary">Staff Details</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th 
                onClick={() => handleSort('name')}
                className="sticky left-0 z-10 bg-background-base py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Name
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('name')}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('team')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Team
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('team')}
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Location</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">NOP Type</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Organization</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Role</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Phase</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Status</th>
              <th 
                onClick={() => handleSort('requiredStart')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Start Date
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('requiredStart')}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('requiredFinish')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  End Date
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('requiredFinish')}
                  </span>
                </div>
              </th>
              {monthColumns.map(month => (
                <th 
                  key={month.key}
                  className="py-3 px-2 text-right text-sm font-medium text-brand-secondary whitespace-nowrap"
                >
                  {month.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((staff, index) => (
              <tr 
                key={staff.id || index}
                className="border-b border-gray-700/50 hover:bg-gray-700/20"
              >
                <td className="sticky left-0 z-10 bg-background-base py-3 px-4 text-sm text-text-primary">
                  {staff.name}
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.team}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.location}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.nopType}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.org}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.projectRoleTitle}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.phase}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">{staff.status}</td>
                <td className="py-3 px-4 text-sm text-text-secondary">
                  {new Date(staff.requiredStart).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">
                  {new Date(staff.requiredFinish).toLocaleDateString()}
                </td>
                {monthColumns.map(month => (
                  <td 
                    key={month.key}
                    className="py-3 px-2 text-sm text-right text-text-secondary"
                  >
                    {getFTEForMonth(staff, month.key).toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing {Math.min(ITEMS_PER_PAGE * (currentPage - 1) + 1, sortedData.length)} to{' '}
          {Math.min(ITEMS_PER_PAGE * currentPage, sortedData.length)} of{' '}
          {sortedData.length} staff members
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === page
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-700/50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}