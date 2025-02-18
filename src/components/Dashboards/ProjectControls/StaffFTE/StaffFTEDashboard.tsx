import React, { useState, useEffect } from 'react';
import { BarChart2, Table2, Download } from 'lucide-react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { Button } from '../../../common/Button';
import { BackNavigation } from '../../../common/BackNavigation';
import { StaffFTEApiClient } from '../../../../api/staff-fte/client';
import { O2NL_Staff } from '../../../../api/staff-fte/types';
import { logger } from '../../../../lib/logger';
import { StaffChart } from '../P+C/StaffComponents/StaffChart';
import { TableFilters } from './components/TableFilters';
import { FTESummaryTable } from './components/FTESummaryTable';
import { StaffTable } from './components/StaffTable';
import { useTableFilters } from './hooks/useTableFilters';
import { MonthColumn } from './types';
import { calculateFTESummaries } from '../../../../api/staff-fte/transformations';

// Generate array of month columns from Sep 24 to Dec 30
const monthColumns: MonthColumn[] = Array.from({ length: 76 }, (_, i) => {
  const date = new Date(2024, 8 + i); // Start from Sep 2024 (month 8)
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear().toString().slice(-2);
  return {
    key: `${monthName}_${year}`,
    label: `${date.toLocaleString('default', { month: 'short' })} ${year}`
  };
});

export function StaffFTEDashboard() {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [staffData, setStaffData] = useState<O2NL_Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize filters
  const { filterState, uniqueValues, handleFilterChange, filteredData } = useTableFilters(staffData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new StaffFTEApiClient();
        const data = await client.fetchStaffFTEData();
        setStaffData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load staff FTE data');
        logger.error('Staff FTE data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadCSV = () => {
    try {
      const fteSummaries = calculateFTESummaries(filteredData, monthColumns);
      
      // Create headers for the CSV
      const baseHeaders = [
        'Category',
        'Name'
      ];

      // Add month headers
      const headers = [
        ...baseHeaders,
        ...monthColumns.map(month => month.label)
      ];

      // Prepare CSV rows
      const rows: string[][] = [];

      // Add organization data
      fteSummaries.orgSummaries.forEach(org => {
        rows.push([
          'Organization',
          org.org,
          ...monthColumns.map(month => org.totals[month.key].toFixed(2))
        ]);
      });

      // Add discipline data
      fteSummaries.disciplineSummaries.forEach(discipline => {
        rows.push([
          'Discipline',
          discipline.discipline,
          ...monthColumns.map(month => discipline.totals[month.key].toFixed(2))
        ]);
      });

      // Add NOP type data
      fteSummaries.nopTypeSummaries.forEach(nopType => {
        rows.push([
          'NOP Type',
          nopType.nopType,
          ...monthColumns.map(month => nopType.totals[month.key].toFixed(2))
        ]);
      });

      // Add total row
      rows.push([
        'Total',
        'All Staff',
        ...monthColumns.map(month => fteSummaries.grandTotal[month.key].toFixed(2))
      ]);

      // Convert to CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'staff_fte_by_month.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('FTE CSV download completed');
    } catch (error) {
      logger.error('FTE CSV download failed', { error });
      // You might want to show a user-friendly error message here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading staff FTE data...</div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <div className="text-red-400">
                Error loading staff FTE data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">Staff FTE</h1>
              
              <div className="flex items-center gap-4">
                {/* Download Button */}
                <Button
                  onClick={handleDownloadCSV}
                  variant="secondary"
                  size="sm"
                  icon={Download}
                >
                  Download CSV
                </Button>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'chart'
                        ? 'bg-brand-primary text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>Chart</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-brand-primary text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Table2 className="w-4 h-4" />
                    <span>Table</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-text-secondary">
              Track and monitor staff full-time equivalent allocations across the project
            </p>
          </div>

          {/* Filters - Always visible */}
          <TableFilters
            filters={{
              disciplines: uniqueValues.disciplines.map(d => ({ value: d, label: d })),
              locations: uniqueValues.locations.map(l => ({ value: l, label: l })),
              nopTypes: uniqueValues.nopTypes.map(n => ({ value: n, label: n })),
              orgs: uniqueValues.orgs.map(o => ({ value: o, label: o })),
              phases: uniqueValues.phases.map(p => ({ value: p, label: p })),
              statuses: uniqueValues.statuses.map(s => ({ value: s, label: s }))
            }}
            selectedValues={filterState}
            onFilterChange={handleFilterChange}
          />

          {/* Content */}
          {viewMode === 'chart' ? (
            <Card className="p-6" hover>
              <StaffChart 
                data={filteredData}
                monthColumns={monthColumns}
                mode="fte"
              />
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6" hover>
                <FTESummaryTable 
                  data={filteredData}
                  monthColumns={monthColumns}
                />
              </Card>
              
              {/* Staff Table */}
              <Card className="p-6" hover>
                <StaffTable 
                  data={filteredData}
                  monthColumns={monthColumns}
                />
              </Card>
            </div>
          )}
        </Section>
      </div>
      <Footer />
    </div>
  );
}