import React, { useState } from 'react';
import { StaffSummary } from '@api/projectcontrols/peopleculture/staff/transformations-staff-numbers';

interface StaffNumbersTableProps {
  data: StaffSummary;
}

type SummaryView = 'organization' | 'discipline' | 'nop';

export function StaffNumbersTable({ data }: StaffNumbersTableProps) {
  const [summaryView, setSummaryView] = useState<SummaryView>('organization');

  const renderSummaryTable = () => {
    let title: string;
    let items: { name: string; staffCounts: { [month: string]: { activeCount: number; staffNames: Array<{ name: string; projectRoleTitle: string }> } } }[];

    switch (summaryView) {
      case 'organization':
        title = 'Organization Summary';
        items = data.organizations;
        break;
      case 'discipline':
        title = 'Discipline Summary';
        items = data.disciplines;
        break;
      case 'nop':
        title = 'NOP Type Summary';
        items = data.nopTypes;
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
                  {data.months.map(month => (
                    <th
                      key={month}
                      className="py-2 px-2 text-right text-sm font-medium text-brand-secondary whitespace-nowrap"
                    >
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(({ name, staffCounts }) => (
                  <tr key={name} className="border-b border-gray-700/50 group hover:bg-gray-700/20">
                    <td className="py-2 px-4 text-sm font-medium text-text-primary">
                      {name}
                    </td>
                    {data.months.map(month => (
                      <td
                        key={month}
                        className="py-2 px-2 text-right text-sm text-text-secondary group-hover:text-text-primary relative"
                        title={staffCounts[month].staffNames.map(s => `${s.name} (${s.projectRoleTitle})`).join('\n')}
                      >
                        {staffCounts[month].activeCount}
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
                {data.months.map(month => (
                  <td
                    key={month}
                    className="py-2 px-2 text-right text-sm font-medium text-brand-primary"
                  >
                    {data.total[month].activeCount}
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