import React from 'react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange 
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-text-secondary">
        Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} to{' '}
        {Math.min(itemsPerPage * currentPage, totalItems)} of{' '}
        {totalItems} entries
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
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
  );
}