import React, { useState, useEffect } from 'react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { BackNavigation } from '../../../../common/BackNavigation';
import { StaffFTEApiClient } from '../../../../../api/staff-fte/client';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { logger } from '../../../../../lib/logger';
import { StaffNumbersChart } from './StaffNumbersChart';
import { StaffMovementChart } from './StaffMovementChart';
import { TableFilters } from '../../../ProjectControls/StaffFTE/components/TableFilters';
import { useTableFilters } from '../../../ProjectControls/StaffFTE/hooks/useTableFilters';
import { MonthColumn } from '../../../ProjectControls/StaffFTE/types';

// Generate array of month columns from Sep 24 to Dec 30
const monthColumns: MonthColumn[] = Array.from({ length: 76 }, (_, i) => {
  const date = new Date(2024, 8 + i); // Start from Sep 2024 (month 8)
  return {
    key: `${date.toLocaleString('default', { month: 'short' })}_${date.getFullYear().toString().slice(2)}`,
    label: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`
  };
});

export function StaffNumbersDashboard() {
  const [staffData, setStaffData] = useState<O2NL_Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedChart, setSelectedChart] = useState<'overall' | 'movement'>('overall');

  // Initialize filters
  const { filterState, uniqueValues, handleFilterChange, filteredData } = useTableFilters(staffData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new StaffFTEApiClient();
        const data = await client.fetchStaffFTEData();
        setStaffData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load staff data');
        logger.error('Staff data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
                <button
                  onClick={() => setSelectedChart('overall')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedChart === 'overall'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Overall People
                </button>
                <button
                  onClick={() => setSelectedChart('movement')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedChart === 'movement'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Staff Movement
                </button>
              </div>
            </div>
            <p className="text-text-secondary">
              Track and monitor staff numbers and movement across the project
            </p>
          </div>

          {/* Filters - Always visible */}
          {!isLoading && !error && (
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
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="p-6" hover>
              <div className="flex items-center justify-center h-64">
                <div className="text-text-secondary">Loading staff data...</div>
              </div>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-6 bg-red-500/10 border-red-500" hover>
              <div className="text-red-400">
                Error loading staff data: {error.message}
              </div>
            </Card>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <Card className="p-6" hover>
              {selectedChart === 'overall' ? (
                <StaffNumbersChart data={filteredData} monthColumns={monthColumns} />
              ) : (
                <StaffMovementChart data={filteredData} monthColumns={monthColumns} />
              )}
            </Card>
          )}
        </Section>
      </div>
      <Footer />
    </div>
  );
}