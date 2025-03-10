import React, { useState, useEffect } from 'react';
import { BarChart2, Table2, Download } from 'lucide-react';
import { Header } from '../../../../common/Header/Header';
import { Footer } from '../../../../common/Footer/Footer';
import { Section } from '../../../../common/Section/Section';
import { Card } from '../../../../common/Card/Card';
import { Button } from '../../../../common/Button/Button';
import { BackNavigation } from '../../../../common/BackNavigation/BackNavigation';
import { StaffNumbersApiClient } from '@api/staff-numbers/client';
import { O2NL_Staff } from '@api/staff-fte/types';
import { calculateStaffNumbers } from '@api/staff-fte/transformations-staff-numbers2';
import { TableFilters } from '../../../ProjectControls/StaffFTE/components/TableFilters';
import { useTableFilters } from '../../../ProjectControls/StaffFTE/hooks/useTableFilters';
import { StaffNumbers2Chart } from './components/StaffNumbers2Chart';
import { StaffNumbers2Table } from './components/StaffNumbers2Table';
import { logger } from '../../../../../lib/logger';

type ViewMode = 'chart' | 'table';

export function StaffNumbers2Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [staffData, setStaffData] = useState<O2NL_Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize filters
  const { filterState, uniqueValues, handleFilterChange, filteredData } = useTableFilters(staffData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new StaffNumbersApiClient();
        const data = await client.fetchStaffNumbersData();
        setStaffData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load staff numbers data');
        logger.error('Staff numbers data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadCSV = () => {
    try {
      const staffNumbers = calculateStaffNumbers(filteredData);
      
      // Get all months from the data
      const months = staffNumbers.months;

      // Create headers for the CSV
      const baseHeaders = [
        'Category',
        'Name'
      ];

      // Add month headers
      const headers = [
        ...baseHeaders,
        ...months.map(month => month)
      ];

      // Prepare CSV rows
      const rows: string[][] = [];

      // Add organization data
      staffNumbers.organizations.forEach(org => {
        rows.push([
          'Organization',
          org.name,
          ...months.map(month => org.staffCounts[month].activeCount.toString())
        ]);
      });

      // Add discipline data
      staffNumbers.disciplines.forEach(discipline => {
        rows.push([
          'Discipline',
          discipline.name,
          ...months.map(month => discipline.staffCounts[month].activeCount.toString())
        ]);
      });

      // Add NOP type data
      staffNumbers.nopTypes.forEach(nopType => {
        rows.push([
          'NOP Type',
          nopType.name,
          ...months.map(month => nopType.staffCounts[month].activeCount.toString())
        ]);
      });

      // Add total row
      rows.push([
        'Total',
        'All Staff',
        ...months.map(month => staffNumbers.total[month].activeCount.toString())
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
      link.setAttribute('download', 'staff_numbers_by_month.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('CSV download completed');
    } catch (error) {
      logger.error('CSV download failed', { error });
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
              <div className="text-text-secondary">Loading staff numbers data...</div>
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
                Error loading staff numbers data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  const staffNumbers = calculateStaffNumbers(filteredData);

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">Staff Numbers</h1>
              
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
              Track and monitor staff numbers across the project
            </p>
          </div>

          {/* Filters */}
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
              <StaffNumbers2Chart data={staffNumbers} />
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6" hover>
                <StaffNumbers2Table data={staffNumbers} />
              </Card>
            </div>
          )}
        </Section>
      </div>
      <Footer />
    </div>
  );
}