import React, { useState, useEffect } from 'react';
import { Header, Footer, Section, Card, Button, BackNavigation } from '@common';
import { StaffMovementChart } from './StaffMovementChart';
import { TableFilters } from '@features_ProjectControls/Staff';
import { useTableFilters } from '../hooks/useTableFilters';
import { StaffFTEApiClient } from '@api/projectcontrols/peopleculture';
import { O2NL_Staff } from '@api/projectcontrols/peopleculture';
import { calculateStaffMovement } from '@api/projectcontrols/peopleculture';
import { logger } from '@lib/logger';
import { BarChart2, Download } from 'lucide-react';

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

  const handleDownloadCSV = () => {
    try {
      const movementData = calculateStaffMovement(filteredData);
      
      // Create headers for the CSV
      const baseHeaders = [
        'Category',
        'Name'
      ];

      // Add month headers
      const monthHeaders = movementData.months;

      // Prepare CSV rows
      const onboardingRows: string[][] = [];
      const offboardingRows: string[][] = [];

      // Add organization data
      movementData.organizations.forEach(org => {
        onboardingRows.push([
          'Organization',
          org.name,
          ...monthHeaders.map(month => org.movements[month]?.onboarding.toString() || '0')
        ]);
        
        offboardingRows.push([
          'Organization',
          org.name,
          ...monthHeaders.map(month => org.movements[month]?.offboarding.toString() || '0')
        ]);
      });

      // Add discipline data
      movementData.disciplines.forEach(discipline => {
        onboardingRows.push([
          'Discipline',
          discipline.name,
          ...monthHeaders.map(month => discipline.movements[month]?.onboarding.toString() || '0')
        ]);
        
        offboardingRows.push([
          'Discipline',
          discipline.name,
          ...monthHeaders.map(month => discipline.movements[month]?.offboarding.toString() || '0')
        ]);
      });

      // Add NOP type data
      movementData.nopTypes.forEach(nopType => {
        onboardingRows.push([
          'NOP Type',
          nopType.name,
          ...monthHeaders.map(month => nopType.movements[month]?.onboarding.toString() || '0')
        ]);
        
        offboardingRows.push([
          'NOP Type',
          nopType.name,
          ...monthHeaders.map(month => nopType.movements[month]?.offboarding.toString() || '0')
        ]);
      });

      // Add total rows
      onboardingRows.push([
        'Total',
        'All Staff',
        ...monthHeaders.map(month => movementData.total[month]?.onboarding.toString() || '0')
      ]);
      
      offboardingRows.push([
        'Total',
        'All Staff',
        ...monthHeaders.map(month => movementData.total[month]?.offboarding.toString() || '0')
      ]);

      // Create CSV content with sections
      const csvContent = [
        'Onboarding',
        [baseHeaders.join(','), monthHeaders.join(',')].join(','),
        ...onboardingRows.map(row => row.map(cell => `"${cell}"`).join(',')),
        '', // Empty line between sections
        'Offboarding',
        [baseHeaders.join(','), monthHeaders.join(',')].join(','),
        ...offboardingRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'staff_movement_by_month.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Staff movement CSV download completed');
    } catch (error) {
      logger.error('Staff movement CSV download failed', { error });
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