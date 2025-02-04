import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LineItemData } from './transformers';

interface EarnedValuePivotTableProps {
  data: LineItemData[];
}

type SortField = 'discipline' | 'directCosts' | 'limb2' | 'total' | 'percentOfBudget' | 
                 'selectedMonthPlanned' | 'selectedMonthToDate' | 'selectedMonthWeighting' | 
                 'selectedMonthSlippage';

interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

export function EarnedValuePivotTable({ data }: EarnedValuePivotTableProps) {
  const [expandedDisciplines, setExpandedDisciplines] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'discipline', direction: 'asc' });

  // Format helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const toggleDiscipline = (discipline: string) => {
    setExpandedDisciplines(prev => {
      const next = new Set(prev);
      if (next.has(discipline)) {
        next.delete(discipline);
      } else {
        next.add(discipline);
      }
      return next;
    });
  };

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Sort and organize data
  const sortedData = useMemo(() => {
    // First, group items by discipline
    const disciplineGroups = new Map<string, LineItemData[]>();
    data.forEach(item => {
      if (!disciplineGroups.has(item.discipline)) {
        disciplineGroups.set(item.discipline, []);
      }
      disciplineGroups.get(item.discipline)!.push(item);
    });

    // Get discipline headers
    const headers = Array.from(disciplineGroups.keys()).map(discipline => 
      data.find(item => item.isHeader && item.discipline === discipline)!
    );

    // Sort discipline headers
    headers.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * multiplier;
      }
      return ((aValue as number) - (bValue as number)) * multiplier;
    });

    // Create final sorted array with headers and their line items
    const sorted: LineItemData[] = [];
    headers.forEach(header => {
      sorted.push(header);
      
      // Sort line items within each discipline
      const items = disciplineGroups.get(header.discipline)!
        .filter(item => !item.isHeader)
        .sort((a, b) => {
          const aValue = a[sortConfig.field];
          const bValue = b[sortConfig.field];
          const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * multiplier;
          }
          return ((aValue as number) - (bValue as number)) * multiplier;
        });
      
      sorted.push(...items);
    });

    return sorted;
  }, [data, sortConfig]);

  // Filter items based on expanded state
  const visibleItems = sortedData.filter(item => 
    item.isHeader || expandedDisciplines.has(item.discipline)
  );

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
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th 
              onClick={() => handleSort('discipline')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Discipline / Element
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('discipline')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('directCosts')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Direct Costs
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('directCosts')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('limb2')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Limb 2
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('limb2')}
                </span>
              </div>
            </th>
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
            <th 
              onClick={() => handleSort('percentOfBudget')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                % of Budget
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('percentOfBudget')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('selectedMonthPlanned')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Selected Month Planned %
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('selectedMonthPlanned')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('selectedMonthToDate')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Selected Month to Date %
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('selectedMonthToDate')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('selectedMonthWeighting')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Selected Month % Weighting
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('selectedMonthWeighting')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('selectedMonthSlippage')}
              className="py-3 px-4 text-right text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center justify-end gap-1 hover:text-brand-primary transition-colors">
                Selected Month Slippage
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('selectedMonthSlippage')}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item, index) => (
            <tr
              key={`${item.discipline}-${item.element || index}`}
              className={`
                border-b border-gray-700/50 
                ${item.isHeader ? 'bg-gray-800/30' : 'hover:bg-gray-700/20'} 
                transition-colors
              `}
            >
              <td className="py-2 px-4 text-sm">
                <div className="flex items-center gap-2">
                  {item.isHeader ? (
                    <>
                      <button
                        onClick={() => toggleDiscipline(item.discipline)}
                        className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                      >
                        {expandedDisciplines.has(item.discipline) ? (
                          <ChevronDown className="w-4 h-4 text-brand-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-brand-primary" />
                        )}
                      </button>
                      <span className="font-medium text-text-primary">{item.discipline}</span>
                    </>
                  ) : (
                    <span className="pl-8 text-text-secondary">{item.element}</span>
                  )}
                </div>
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatCurrency(item.directCosts)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatCurrency(item.limb2)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatCurrency(item.total)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatPercentage(item.percentOfBudget)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatPercentage(item.selectedMonthPlanned)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatPercentage(item.selectedMonthToDate)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                {formatPercentage(item.selectedMonthWeighting)}
              </td>
              <td className={`py-2 px-4 text-sm text-right ${
                item.selectedMonthSlippage > 0 ? 'text-green-400' : 
                item.selectedMonthSlippage < 0 ? 'text-red-400' : 
                item.isHeader ? 'text-text-primary font-medium' : 'text-text-secondary'
              }`}>
                {formatPercentage(item.selectedMonthSlippage)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}