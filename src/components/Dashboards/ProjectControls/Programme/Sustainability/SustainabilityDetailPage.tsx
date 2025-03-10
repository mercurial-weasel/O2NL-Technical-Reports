import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Footer, Section } from '@common';
import { BackNavigation } from '@common/BackNavigation';
import { StatusIndicator, TrendIndicator, TaskList, RisksCard, DependenciesCard } from '@features_ProjectControls/MonthlyReport';
import { SustainabilityReportApiClient } from '@api/projectcontrols/programme';
import { SustainabilityMonthlyRecord } from '@api/projectcontrols/programme';
import { logger } from '@lib/logger';

export function SustainabilityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<SustainabilityMonthlyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new SustainabilityReportApiClient();
        const data = await client.fetchSustainabilityRecords();
        const foundRecord = data.find(r => r.id === id);
        setRecord(foundRecord || null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load sustainability record');
        logger.error('Sustainability record fetch failed', { error: error.message, id });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading sustainability record...</div>
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
                Error loading sustainability record: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <BackNavigation to="/project-controls/sustainability" text="Back to Sustainability Report" />
            <div className="text-text-primary">Record not found</div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  // Sort risks by severity (likelihood * consequence)
  const sortedRisks = [...record.keyRisks].sort((a, b) => 
    (b.likelihood * b.consequence) - (a.likelihood * a.consequence)
  );

  // Split tasks by critical path
  const criticalPathTasks = record.tasksToComplete.filter(task => task.critical_path);
  const nonCriticalPathTasks = record.tasksToComplete.filter(task => !task.critical_path);

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          {/* Header */}
          <div className="mb-8">
            <BackNavigation to="/project-controls/sustainability" text="Back to Sustainability Report" />

            {/* Title and Status Row */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">{record.discipline}</h1>
              <div className="flex items-center gap-4">
                {/* Date next to status indicators */}
                <span className="text-lg text-text-primary font-medium">
                  {new Date(record.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <StatusIndicator status={record.status} size="lg" />
                <TrendIndicator trend={record.trend} size={24} />
              </div>
            </div>

            {/* Key Issue on the right */}
            <div className="flex justify-end">
              <div className="max-w-xl text-text-muted text-sm italic">
                {record.keyIssue}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <RisksCard risks={sortedRisks} />
              <DependenciesCard dependencies={record.dependencies} />
            </div>

            {/* Right Column - Tasks to Complete */}
            <div className="space-y-6">
              <TaskList
                title="Tasks to Complete - Critical Path"
                tasks={criticalPathTasks}
                showHelp={true}
              />

              <TaskList
                title="Tasks to Complete - non critical path"
                tasks={nonCriticalPathTasks}
                showHelp={true}
              />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}