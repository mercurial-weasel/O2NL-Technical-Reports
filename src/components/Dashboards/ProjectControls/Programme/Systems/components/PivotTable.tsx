import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PivotCategory, PivotItem } from '@data/pivotData';

interface PivotTableProps {
  data: PivotCategory[];
  columnTotals: number[];
  adoptionLevels: readonly string[];
}

export function PivotTable({ data, adoptionLevels }: PivotTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(data.map(c => c.category)));
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleSubcategory = (categoryName: string, subcategoryName: string) => {
    const key = `${categoryName}:${subcategoryName}`;
    setExpandedSubcategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderValueCell = (value: number, index: number, isTotal: boolean = false) => {
    const level = adoptionLevels[index];
    let bgColor = '';
    let textColor = '';
    
    if (value > 0) {
      if (level.includes('good') || level.includes('comprehensive')) {
        bgColor = 'bg-green-500/20';
        textColor = 'text-green-400';
      } else if (level.includes('average')) {
        bgColor = 'bg-yellow-500/20';
        textColor = 'text-yellow-400';
      } else if (level.includes('poor') || level.includes('commenced')) {
        bgColor = 'bg-red-500/20';
        textColor = 'text-red-400';
      } else {
        bgColor = 'bg-blue-500/20';
        textColor = 'text-blue-400';
      }
    }

    return (
      <td 
        key={index}
        className={`
          py-2 px-4 text-center text-sm
          ${value > 0 ? `${bgColor} ${textColor} font-medium` : 'text-text-secondary'}
          ${isTotal ? 'font-medium' : ''}
        `}
      >
        {value || ''}
      </td>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">
              Row Labels
            </th>
            {adoptionLevels.map(label => (
              <th 
                key={label} 
                className="py-3 px-4 text-center text-sm font-medium text-brand-secondary"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Data Rows */}
          {data.map((category) => {
            const isExpanded = expandedCategories.has(category.category);
            
            return (
              <React.Fragment key={category.category}>
                {/* Category Row with Totals */}
                <tr 
                  className="border-b border-gray-700 bg-gray-800/30 cursor-pointer hover:bg-gray-800/50"
                  onClick={() => toggleCategory(category.category)}
                >
                  <td className="py-2 px-4 text-sm font-medium text-text-primary">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-brand-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-brand-primary" />
                      )}
                      {category.category}
                    </div>
                  </td>
                  {category.values.map((value, index) => renderValueCell(value, index, true))}
                </tr>

                {/* Subcategories and Items */}
                {isExpanded && category.items.map((item) => {
                  const subcategoryKey = `${category.category}:${item.name}`;
                  const isSubcategoryExpanded = expandedSubcategories.has(subcategoryKey);

                  return (
                    <React.Fragment key={item.name}>
                      {/* Subcategory Row */}
                      <tr 
                        className="border-b border-gray-700/50 hover:bg-gray-700/20 cursor-pointer"
                        onClick={() => item.isSubcategory && toggleSubcategory(category.category, item.name)}
                      >
                        <td className="py-2 px-4 text-sm text-text-primary pl-8">
                          <div className="flex items-center gap-2">
                            {item.isSubcategory && (
                              isSubcategoryExpanded ? (
                                <ChevronDown className="w-3 h-3 text-brand-primary" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-brand-primary" />
                              )
                            )}
                            {item.name}
                          </div>
                        </td>
                        {item.values.map((value, index) => renderValueCell(value, index))}
                      </tr>

                      {/* System Items */}
                      {item.isSubcategory && isSubcategoryExpanded && item.subcategoryItems?.map((system) => (
                        <tr 
                          key={system.name}
                          className="border-b border-gray-700/50 hover:bg-gray-700/20"
                        >
                          <td className="py-2 px-4 text-sm text-text-primary pl-12">
                            {system.name}
                          </td>
                          {system.values.map((value, index) => renderValueCell(value, index))}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}