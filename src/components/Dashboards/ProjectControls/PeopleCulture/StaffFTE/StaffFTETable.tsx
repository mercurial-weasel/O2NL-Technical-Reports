import React, { useState, useMemo } from 'react';
import { O2NL_Staff } from '@api/projectcontrols/peopleculture';
import { TableHeader, TablePagination,FTESummaryTable  } from '@features_ProjectControls/Staff/';
import { SortConfig, MonthColumn } from '@features_ProjectControls/Staff/';

interface StaffFTETableProps {
  data: O2NL_Staff[];
}

const ITEMS_PER_PAGE = 25;

// Generate array of month columns from Sep 24 to Dec 30
const monthColumns: MonthColumn[] = Array.from({ length: 76 }, (_, i) => {
  const date = new Date(2024, 8 + i); // Start from Sep 2024 (month 8)
  return {
    key: `${date.toLocaleString('default', { month: 'short' })}_${date.getFullYear().toString().slice(2)}`,
    label: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`
  };
});

// Helper function to format date as MMM-YY
const formatDate = (date: Date) => {
  return `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear().toString().slice(2)}`;
};

export function StaffFTETable({ data }: StaffFTETableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'Name',
    direction: 'asc'
  });

  // Sort data
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.field as keyof O2NL_Staff];
      const bValue = b[sortConfig.field as keyof O2NL_Staff];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      if (sortConfig.field === 'RequiredStart' || sortConfig.field === 'RequiredFinish') {
        return (new Date(aValue).getTime() - new Date(bValue).getTime()) * direction;
      }
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [data, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary Table */}
      <FTESummaryTable data={data} monthColumns={monthColumns} />

      {/* Table with horizontal scroll */}
      <div className="flex flex-col">
        {/* Top scroll bar */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: '3000px', height: '1px' }} />
        </div>
        
        {/* Table content */}
        <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
          <div style={{ minWidth: '3000px' }}>
            <table className="w-full">
              <thead>
                <TableHeader
                  monthColumns={monthColumns}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="sticky left-0 z-10 bg-background-base py-3 px-4 text-sm text-text-primary">{item.Name}</td>
                    <td className="sticky left-[150px] z-10 bg-background-base py-3 px-4 text-sm text-text-primary">{item.Team}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{item.Location}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{item.NOPType}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{item.Org}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{item.ProjectRoleTitle}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{item.Phase}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{item.Status}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {formatDate(new Date(item.RequiredStart))}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {formatDate(new Date(item.RequiredFinish))}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-text-secondary">
                      {item.FTE_AVE?.toFixed(2) || '0.00'}
                    </td>

                    {monthColumns.map(month => (
                      <td 
                        key={month.key}
                        className="py-3 px-2 text-sm text-right text-text-secondary"
                      >
                        {(item[month.key as keyof O2NL_Staff] as number)?.toFixed(2) || '0.00'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={sortedData.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}