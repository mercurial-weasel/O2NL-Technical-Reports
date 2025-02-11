import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { BackNavigation } from '../../../../common/BackNavigation';
import { StaffFTEApiClient } from '../../../../../api/staff-fte/client';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { calculateStaffMovement } from '../../../../../api/staff-fte/transformations';
import { StaffMovementChart } from './StaffMovementChart';
import { TableFilters } from '../../../ProjectControls/StaffFTE/components/TableFilters';
import { useTableFilters } from '../../../ProjectControls/StaffFTE/hooks/useTableFilters';
import { logger } from '../../../../../lib/logger';

type GroupBy = 'organization' | 'discipline' | 'nop';

export function StaffMovementDashboard() {
  const [staffData, setStaffData] = useState<O2NL_Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>('organization');

  // Initialize filters
  const { filterState, uniqueValues, handleFilterChange, filteredData } = useTableFilters(staffData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new StaffFTEApiClient();
        const data = await client.fetchStaffFTEData();
        setStaffData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load staff movement data');
        logger.error('Staff movement data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading staff movement data...</div>
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
                Error loading staff movement data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  const movementData = calculateStaffMovement(filteredData);

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">Staff Movement</h1>
              
              {/* Group By Toggle */}
              <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
                <button
                  onClick={() => setGroupBy('organization')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    groupBy === 'organization'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Organization</span>
                </button>
                <button
                  onClick={() => setGroupBy('discipline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    groupBy === 'discipline'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Discipline</span>
                </button>
                <button
                  onClick={() => setGroupBy('nop')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    groupBy === 'nop'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>NOP Type</span>
                </button>
              </div>
            </div>
            <p className="text-text-secondary">
              Track staff onboarding and offboarding patterns across the project
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

          {/* Chart */}
          <Card className="p-6" hover>
            <StaffMovementChart 
              data={movementData}
              groupBy={groupBy}
            />
          </Card>
        </Section>
      </div>
      <Footer />
    </div>
  );
}