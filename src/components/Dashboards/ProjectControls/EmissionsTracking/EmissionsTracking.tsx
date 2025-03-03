import React, { useState, useEffect } from 'react';
import { BarChart2, Table2, Download } from 'lucide-react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { Button } from '../../../common/Button';
import { BackNavigation } from '../../../common/BackNavigation';
import { EmissionsApiClient } from '../../../../api/emissions/client';
import { EmissionsChart } from './components/EmissionsChart';
import { EmissionsTable } from './components/EmissionsTable';
import { EmissionsFilters } from './components/EmissionsFilters';
import { getUniqueCategories } from '../../../../api/emissions/transformations';
import { logger } from '../../../../lib/logger';

type ViewMode = 'chart' | 'table';

export function EmissionsTracking() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [emissionsData, setEmissionsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['all']));
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set(['all']));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new EmissionsApiClient();
        const data = await client.fetchEmissionsData();
        setEmissionsData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load emissions data');
        logger.error('Emissions data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadCSV = () => {
    try {
      if (!emissionsData?.records) {
        throw new Error('No data available for download');
      }

      // Create CSV content
      const headers = ['Category', 'Year-Month', 'Amount', 'Carbon Estimate (KgCO2e)'];
      const rows = emissionsData.records.map((record: any) => [
        record.category,
        record.yearMonth,
        record.amount,
        record.carbonEstimateKgCO2e
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'emissions_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Emissions CSV download completed');
    } catch (error) {
      logger.error('Emissions CSV download failed', { error });
      // You might want to show a user-friendly error message here
    }
  };

  // Filter data based on selected categories and years
  const filteredData = React.useMemo(() => {
    if (!emissionsData?.records) return [];

    return emissionsData.records.filter((record: any) => {
      const matchesCategory = selectedCategories.has('all') || selectedCategories.has(record.category);
      const matchesYear = selectedYears.has('all') || selectedYears.has(record.yearMonth.slice(0, 4));
      return matchesCategory && matchesYear;
    });
  }, [emissionsData, selectedCategories, selectedYears]);

  // Get available categories and years for filters
  const categories = React.useMemo(() => 
    emissionsData?.records ? getUniqueCategories(emissionsData.records) : [],
  [emissionsData]);

  const years = React.useMemo(() => {
    if (!emissionsData?.records) return [];
    return Array.from(new Set(
      emissionsData.records.map((record: any) => record.yearMonth.slice(0, 4))
    )).sort();
  }, [emissionsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading emissions data...</div>
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
                Error loading emissions data: {error.message}
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
              <h1 className="text-3xl font-bold text-text-primary">Carbon Emissions</h1>
              
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
              Track and monitor project carbon emissions across different categories
            </p>
          </div>

          {/* Filters */}
          <EmissionsFilters
            categories={categories}
            years={years}
            selectedCategories={selectedCategories}
            selectedYears={selectedYears}
            onCategoryChange={(value) => {
              setSelectedCategories(prev => {
                const next = new Set(prev);
                if (value === 'all') {
                  return next.has('all') ? new Set() : new Set(['all']);
                }
                next.delete('all');
                if (next.has(value)) {
                  next.delete(value);
                  if (next.size === 0) next.add('all');
                } else {
                  next.add(value);
                }
                return next;
              });
            }}
            onYearChange={(value) => {
              setSelectedYears(prev => {
                const next = new Set(prev);
                if (value === 'all') {
                  return next.has('all') ? new Set() : new Set(['all']);
                }
                next.delete('all');
                if (next.has(value)) {
                  next.delete(value);
                  if (next.size === 0) next.add('all');
                } else {
                  next.add(value);
                }
                return next;
              });
            }}
          />

          {/* Content */}
          <Card className="p-6" hover>
            {viewMode === 'chart' ? (
              <EmissionsChart data={filteredData} />
            ) : (
              <EmissionsTable data={filteredData} />
            )}
          </Card>
        </Section>
      </div>
      <Footer />
    </div>
  );
}