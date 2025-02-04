import React, { useState, useMemo } from 'react';
import { Card } from '../../../common/Card';
import { SustainabilityInitiative } from './data';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ThemeDetailProps {
  theme: string;
  initiatives: SustainabilityInitiative[];
  onClose: () => void;
}

type SortField = 'outcome' | 'status' | 'priority' | 'measureOwner' | 'targetDate';

interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

export function ThemeDetail({ theme, initiatives, onClose }: ThemeDetailProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'outcome', direction: 'asc' });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = useMemo(() => {
    return [...initiatives].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [initiatives, sortConfig]);

  const renderSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <Card className="p-6" hover>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-text-primary">{theme}</h3>
        <button 
          onClick={onClose}
          className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Back to Overview
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th 
                onClick={() => handleSort('outcome')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Outcome
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('outcome')}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Status
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('status')}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('priority')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Priority
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('priority')}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('measureOwner')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Owner
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('measureOwner')}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('targetDate')}
                className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
              >
                <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                  Target Date
                  <span className="transition-opacity duration-200 group-hover:opacity-100">
                    {renderSortIndicator('targetDate')}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((initiative, index) => (
              <tr
                key={index}
                className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-text-primary font-medium">{initiative.outcome}</p>
                    <p className="text-xs text-text-secondary mt-1">{initiative.target}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    initiative.status === 'Implemented' ? 'bg-green-500/20 text-green-400' :
                    initiative.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    initiative.status === 'Delayed' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {initiative.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-secondary">{initiative.priority}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-secondary">
                    {initiative.measureOwner || 'Not assigned'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-secondary">
                    {new Date(initiative.targetDate).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}