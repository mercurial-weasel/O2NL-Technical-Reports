import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ConsentMonth, ConsentAssessment } from '@api/programme/consenting/types';

interface ConsentingTableProps {
  data: ConsentMonth;
}

type SortField = keyof ConsentAssessment;

interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

export function ConsentingTable({ data }: ConsentingTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'currentRiskLevel',
    direction: 'desc'
  });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedAssessments = [...data.assessments].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.field === 'currentRiskLevel') {
      const riskOrder = { 'Red': 2, 'Amber': 1, 'Green': 0 };
      return (riskOrder[a.currentRiskLevel] - riskOrder[b.currentRiskLevel]) * direction;
    }
    
    return String(a[sortConfig.field]).localeCompare(String(b[sortConfig.field])) * direction;
  });

  const renderSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Green':
        return 'bg-green-500/20 text-green-400';
      case 'Amber':
        return 'bg-orange-500/20 text-orange-400';
      case 'Red':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskChangeColor = (change: string) => {
    switch (change) {
      case 'Up':
        return 'text-green-400';
      case 'Down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th 
              onClick={() => handleSort('designChange')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Design Change
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('designChange')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('proposedConsentPathway')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Proposed Consent Pathway
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('proposedConsentPathway')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('currentRiskLevel')}
              className="py-3 px-4 text-center text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-1 hover:text-brand-primary transition-colors">
                Current Risk
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('currentRiskLevel')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('riskChange')}
              className="py-3 px-4 text-center text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-1 hover:text-brand-primary transition-colors">
                Risk Change
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('riskChange')}
                </span>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">
              Comments
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAssessments.map((assessment) => (
            <tr key={assessment.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-sm text-text-primary">
                {assessment.designChange}
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {assessment.proposedConsentPathway}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(assessment.currentRiskLevel)}`}>
                    {assessment.currentRiskLevel}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <span className={`text-sm font-medium ${getRiskChangeColor(assessment.riskChange)}`}>
                    {assessment.riskChange === 'Up' ? '↑' :
                     assessment.riskChange === 'Down' ? '↓' :
                     assessment.riskChange === 'Unchanged' ? '→' : '?'}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {assessment.comments}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}