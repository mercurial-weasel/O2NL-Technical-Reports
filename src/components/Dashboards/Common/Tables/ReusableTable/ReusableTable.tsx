import React, { useState } from 'react';
import { Card } from '../../../../common/Card';
import { TableProps, TooltipContent, TableRow } from './types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const defaultConfig = {
  headerColor: 'bg-green-900',
  textColor: 'text-text-primary',
  highlightColor: 'bg-green-800',
  highlightTextColor: 'text-white'
};

export const formatCurrency = (value: number | string) => {
  if (value === "" || value === undefined) return "";
  if (typeof value === "number") {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  return value;
};

export const getDefaultRowHighlight = (row: TableRow) => Boolean(row.highlight);

export const getDefaultTooltipContent = (row: TableRow) => {
  if (!row.ref && !row.comments) return null;
  let content = '';
  if (row.ref) content += `Reference: ${row.ref}\n`;
  if (row.comments) content += `Comments: ${row.comments}`;
  return content.trim();
};

export function ReusableTable({ 
  title,
  sections,
  data,
  config = defaultConfig,
  getRowHighlight = getDefaultRowHighlight,
  getTooltipContent = getDefaultTooltipContent,
  onSort,
  sortConfig,
  fixedRows = 0
}: TableProps) {
  const [tooltipContent, setTooltipContent] = useState<TooltipContent | null>(null);

  const handleRowMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>, row: TableRow) => {
    const content = getTooltipContent(row);
    if (content) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipContent({
        content,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
      });
    }
  };

  const handleRowMouseLeave = () => {
    setTooltipContent(null);
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  // Calculate total columns
  const totalColumns = sections.reduce((acc, section) => 
    acc + (section.colspan || section.columns.length), 0);

  // Split data into sortable and fixed rows
  const sortableRows = data.slice(0, -fixedRows);
  const fixedBottomRows = data.slice(-fixedRows);

  const renderSortIcon = (field: string) => {
    if (!sortConfig || sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <Card className="p-4" hover glow>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {/* Main Title */}
            <tr className={config.headerColor}>
              <th 
                colSpan={totalColumns}
                className={`text-center py-1 px-3 border-b border-gray-700 ${config.textColor} font-semibold text-base`}
              >
                {title}
              </th>
            </tr>

            {/* Section Headers */}
            <tr className={config.headerColor}>
              {sections.map((section, idx) => (
                <th 
                  key={`section-${idx}`}
                  colSpan={section.colspan || section.columns.length} 
                  className={`text-center py-1 px-3 border-b border-gray-700 ${config.textColor} font-semibold text-xs`}
                >
                  {section.title}
                </th>
              ))}
            </tr>

            {/* Column Headers */}
            <tr className={config.headerColor}>
              {sections.flatMap(section => 
                section.columns.map((column, colIdx) => (
                  <th 
                    key={`col-${column.field}-${colIdx}`}
                    className={`text-${column.align || 'left'} py-1.5 px-3 border-b border-gray-700 ${config.textColor} font-semibold ${column.sortable !== false ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                    onClick={() => column.sortable !== false && handleSort(column.field)}
                  >
                    <div className="flex items-center gap-1 justify-between">
                      <span>{column.title}</span>
                      {column.sortable !== false && (
                        <span className="opacity-50 group-hover:opacity-100">
                          {renderSortIcon(column.field)}
                        </span>
                      )}
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {/* Sortable Rows */}
            {sortableRows.map((row, index) => {
              const isHighlighted = getRowHighlight(row);
              const hasTooltip = getTooltipContent(row);

              return (
                <tr
                  key={index}
                  onMouseEnter={(e) => handleRowMouseEnter(e, row)}
                  onMouseLeave={handleRowMouseLeave}
                  className={`
                    border-b border-gray-700/50
                    ${hasTooltip ? 'cursor-help' : ''}
                    ${isHighlighted ? config.highlightColor : ''}
                  `}
                >
                  {sections.flatMap(section =>
                    section.columns.map((column, colIdx) => (
                      <td 
                        key={`cell-${index}-${column.field}-${colIdx}`}
                        className={`py-1.5 px-3 text-${column.align || 'left'} ${
                          isHighlighted ? config.highlightTextColor : config.textColor
                        }`}
                      >
                        {column.formatter 
                          ? column.formatter(row[column.field])
                          : row[column.field]
                        }
                      </td>
                    ))
                  )}
                </tr>
              );
            })}

            {/* Fixed Bottom Rows */}
            {fixedBottomRows.map((row, index) => {
              const isHighlighted = getRowHighlight(row);
              const hasTooltip = getTooltipContent(row);

              return (
                <tr
                  key={`fixed-${index}`}
                  onMouseEnter={(e) => handleRowMouseEnter(e, row)}
                  onMouseLeave={handleRowMouseLeave}
                  className={`
                    border-b border-gray-700/50
                    ${hasTooltip ? 'cursor-help' : ''}
                    ${isHighlighted ? config.highlightColor : ''}
                  `}
                >
                  {sections.flatMap(section =>
                    section.columns.map((column, colIdx) => (
                      <td 
                        key={`cell-fixed-${index}-${column.field}-${colIdx}`}
                        className={`py-1.5 px-3 text-${column.align || 'left'} ${
                          isHighlighted ? config.highlightTextColor : config.textColor
                        }`}
                      >
                        {column.formatter 
                          ? column.formatter(row[column.field])
                          : row[column.field]
                        }
                      </td>
                    ))
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {tooltipContent && (
        <div
          className="fixed z-50 bg-gray-800 text-text-primary border border-gray-700 rounded-lg shadow-lg p-3 text-xs whitespace-pre-line"
          style={{
            top: `${tooltipContent.y - 10}px`,
            left: `${tooltipContent.x}px`,
            transform: 'translateY(-100%)',
          }}
        >
          {tooltipContent.content}
        </div>
      )}
    </Card>
  );
}