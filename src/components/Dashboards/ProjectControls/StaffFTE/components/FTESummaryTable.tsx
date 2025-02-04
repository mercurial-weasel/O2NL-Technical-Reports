import React from 'react';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { MonthColumn } from '../types';
import { calculateFTESummaries } from '../../../../../api/staff-fte/transformations';

interface FTESummaryTableProps {
  data: O2NL_Staff[];
  monthColumns: MonthColumn[];
}

export function FTESummaryTable({ data, monthColumns }: FTESummaryTableProps) {
  // Get summaries from transformation layer
  const summaries = calculateFTESummaries(data, monthColumns);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-medium text-brand-secondary mb-4">Monthly FTE Summary</h3>
      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-background-base">
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-left text-sm font-medium text-brand-secondary">
                Organization
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
            {/* Organization subtotals */}
            {summaries.orgSummaries.map(({ org, totals }) => (
              <tr key={org} className="border-b border-gray-700/50">
                <td className="py-2 px-4 text-sm font-medium text-text-primary">
                  {org}
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

            {/* Grand total row */}
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
}