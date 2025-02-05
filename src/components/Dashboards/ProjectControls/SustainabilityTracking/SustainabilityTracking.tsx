import React, { useState, useEffect } from 'react';
import { BarChart2, Table2 } from 'lucide-react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { BackNavigation } from '../../../common/BackNavigation';
import { EmissionsApiClient } from '../../../../api/emissions/client';
import { calculateMonthlyEmissions } from '../../../../api/emissions/transformations';
import { EmissionSourceType } from '../../../../api/emissions/types';
import { EmissionsChart } from './components/EmissionsChart';
import { EmissionsTable } from './components/EmissionsTable';
import { logger } from '../../../../lib/logger';

type ViewMode = 'chart' | 'table';

export function SustainabilityTracking() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [emissionsData, setEmissionsData] = useState<ReturnType<typeof calculateMonthlyEmissions>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      logger.info('Starting to fetch emissions data');
      try {
        const client = new EmissionsApiClient();
        const data = await client.fetchEmissionsData();
        
        logger.info('Emissions data fetched successfully', { data });
        
        if (!data || !data.emissions) {
          throw new Error('Invalid emissions data');
        }
        
        logger.info('Processing emissions data', { emissions: data.emissions });
        
        const monthlyData = calculateMonthlyEmissions(data.emissions);
        logger.info('Finisehd Processing emissions data', { emissions: data.emissions });
        setEmissionsData(monthlyData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load emissions data');
        logger.error('Emissions data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
        logger.info('Finished fetching emissions data');
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
              <h1 className="text-3xl font-bold text-text-primary">Sustainability Tracking</h1>
              
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
            <p className="text-text-secondary">
              Track and monitor project carbon emissions and environmental impact metrics
            </p>
          </div>

          {/* Content */}
          <Card className="p-6" hover>
            {viewMode === 'chart' ? (
              <EmissionsChart data={emissionsData} />
            ) : (
              <EmissionsTable data={emissionsData} />
            )}
          </Card>
        </Section>
      </div>
      <Footer />
    </div>
  );
}