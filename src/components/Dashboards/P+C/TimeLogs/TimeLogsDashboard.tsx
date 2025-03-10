import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Header } from '../../../common/Header/Header';
import { Footer } from '../../../common/Footer/Footer';
import { Section } from '../../../common/Section/Section';
import { Card } from '../../../common/Card/Card';
import { Button } from '../../../common/Button/Button';
import { BackNavigation } from '../../../common/BackNavigation/BackNavigation';
import { TimeLogsTable } from './TimeLogsTable';
import { HoursApiClient } from '@api/cost/hours/client';
import { HoursResponse } from '@api/cost/hours/types';
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

  const handleDownloadCSV = () => {
    try {
      if (!hoursData?.data) {
        throw new Error('No data available for download');
      }

      // Get all unique statuses and months
      const statuses = new Set<string>();
      const monthYears = new Set<string>();
      
      Object.values(hoursData.data).forEach(projectData => {
        Object.values(projectData).forEach(taskData => {
          Object.values(taskData).forEach(userData => {
            Object.entries(userData).forEach(([status, monthData]) => {
              statuses.add(status);
              Object.keys(monthData).forEach(month => monthYears.add(month));
            });
          });
        });
      });

      // Create headers
      const headers = [
        'Project',
        'Task',
        'User',
        'Status',
        'Month',
        'Hours'
      ];

      // Create rows
      const rows: string[][] = [];

      Object.entries(hoursData.data).forEach(([project, projectData]) => {
        Object.entries(projectData).forEach(([task, taskData]) => {
          Object.entries(taskData).forEach(([user, userData]) => {
            Object.entries(userData).forEach(([status, monthData]) => {
              Object.entries(monthData).forEach(([month, hours]) => {
                rows.push([
                  project,
                  task,
                  user,
                  status,
                  month,
                  hours.toString()
                ]);
              });
            });
          });
        });
      });

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const date = new Date().toISOString().slice(0, 10);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `timelogs_export_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Time logs CSV download completed');
    } catch (error) {
      logger.error('Time logs CSV download failed', { error });
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
                  By default shows only unapproved time. Filter by status to show time logs with different approval status
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleDownloadCSV}
                  variant="secondary"
                  size="sm"
                  icon={Download}
                >
                  Download CSV
                </Button>
                <div className="text-sm text-text-muted">
                  Last updated: {new Date(hoursData.lastUpdated).toLocaleString()}
                </div>
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