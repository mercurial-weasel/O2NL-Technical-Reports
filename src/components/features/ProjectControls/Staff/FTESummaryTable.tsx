import React, { useState } from 'react';
import { O2NL_Staff } from '@api/projectcontrols/peopleculture';
import { MonthColumn } from './types';
import { calculateFTESummaries } from '@api/projectcontrols/peopleculture';

interface FTESummaryTableProps {
  data: O2NL_Staff[];
  monthColumns: MonthColumn[];
}

type SummaryView = 'organization' | 'discipline' | 'nop';

export function FTESummaryTable({ data, monthColumns }: FTESummaryTableProps) {
  const [summaryView, setSummaryView] = useState<SummaryView>('organization');
  const summaries = calculateFTESummaries(data, monthColumns);

  const renderSummaryTable = () => {
    let title: string;
    let items: { name: string; totals: { [key: string]: number } }[];

    switch (summaryView) {
      case 'organization':
        title = 'Organization Summary';
        items = summaries.orgSummaries.map(({ org, totals }) => ({
          name: org,
          totals
        }));
        break;
      case 'discipline':
        title = 'Discipline Summary';
        items = summaries.disciplineSummaries.map(({ discipline, totals }) => ({
          name: discipline,
          totals
        }));
        break;
      case 'nop':
        title = 'NOP Type Summary';
        items = summaries.nopTypeSummaries.map(({ nopType, totals }) => ({
          name: nopType,
          totals
        }));
        break;
    }

    return (
      <div className="space-y-6">
        {/* Summary Table */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-brand-secondary">{title}</h3>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-700/50 rounded-lg p-0.5">
              <button
                onClick={() => setSummaryView('organization')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  summaryView === 'organization'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Organization
              </button>
              <button
                onClick={() => setSummaryView('discipline')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  summaryView === 'discipline'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Discipline
              </button>
              <button
                onClick={() => setSummaryView('nop')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  summaryView === 'nop'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                NOP Type
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-background-base">
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-4 text-left text-sm font-medium text-brand-secondary">
                    {summaryView === 'organization' ? 'Organization' :
                     summaryView === 'discipline' ? 'Discipline' : 
                     'NOP Type'}
                  </th>
                  {monthColumns.map(month => (
                    <th
                      key={month.key}
                      className="py-2 px-2 text-right text-sm font-medium text-brand-secondary whitespace-nowrap"
                    >
                      {month.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(({ name, totals }) => (
                  <tr key={name} className="border-b border-gray-700/50">
                    <td className="py-2 px-4 text-sm font-medium text-text-primary">
                      {name}
                    </td>
                    {monthColumns.map(month => (
                      <td
                        key={month.key}
                        className="py-2 px-2 text-right text-sm text-text-secondary"
                      >
                        {totals[month.key].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grand Total */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-t-2 border-gray-600 bg-gray-800/30">
                <td className="py-2 px-4 text-sm font-medium text-brand-primary">
                  Total
                </td>
                {monthColumns.map(month => (
                  <td
                    key={month.key}
                    className="py-2 px-2 text-right text-sm font-medium text-brand-primary"
                  >
                    {summaries.grandTotal[month.key].toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return renderSummaryTable();
}