import React, { useState, useEffect } from 'react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { BackNavigation } from '../../../common/BackNavigation';
import { TimeLogsTable } from './TimeLogsTable';
import { HoursApiClient } from '../../../../api/cost/hours/client';
import { HoursResponse } from '../../../../api/cost/hours/types';
import { logger } from '../../../../lib/logger';

export function TimeLogsDashboard() {
  const [hoursData, setHoursData] = useState<HoursResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new HoursApiClient();
        const data = await client.getHoursData();
        setHoursData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load hours data');
        logger.error('Hours data fetch failed', { error: error.message });
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
              <div className="text-text-secondary">Loading time logs data...</div>
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
                Error loading time logs data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hoursData) return null;

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Time Logs</h1>
                <p className="text-text-secondary mt-2">
                  Track and analyze project time logs across teams and activities
                </p>
              </div>
              <div className="text-sm text-text-muted">
                Last updated: {new Date(hoursData.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Time Logs Table */}
          <Card className="p-6" hover>
            <TimeLogsTable data={hoursData.data} />
          </Card>
        </Section>
      </div>
      <Footer />
    </div>
  );
}