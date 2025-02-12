import React, { useState, useEffect } from 'react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { BackNavigation } from '../../../../common/BackNavigation';
import { BudgetVisualization } from './BudgetVisualization';
import { BudgetMetrics } from './components/BudgetMetrics';
import { ViewToggle } from './components/ViewToggle';
import { BudgetTable } from './components/BudgetTable';
import { MonthSelector } from './components/MonthSelector';
import { AMTBudgetApiClient } from '../../../../../api/cost/amt-budgets/client';
import { calculateBudgetMetrics, getAvailableMonths, getMonthlyData } from '../../../../../api/cost/amt-budgets/transformations';
import { logger } from '../../../../../lib/logger';

type ViewMode = 'table' | 'hours' | 'budget';

// Currency formatter helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function BudgetTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('hours');
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new AMTBudgetApiClient();
        const data = await client.fetchAMTBudgetData();
        setBudgetData(data);
        
        // Set initial selected period to latest month
        const months = getAvailableMonths(data);
        if (months.length > 0) {
          setSelectedPeriod(months[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load budget data');
        logger.error('Budget data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableMonths = React.useMemo(() => 
    budgetData ? getAvailableMonths(budgetData) : [],
  [budgetData]);

  const currentMonthData = React.useMemo(() => 
    budgetData && selectedPeriod ? getMonthlyData(budgetData, selectedPeriod) : null,
  [budgetData, selectedPeriod]);

  const metrics = React.useMemo(() => 
    currentMonthData ? calculateBudgetMetrics(currentMonthData) : [],
  [currentMonthData]);

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current?.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading budget data...</div>
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
                Error loading budget data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentMonthData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Period Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">AMT Budget Tracking</h1>
            <MonthSelector
              selectedPeriod={selectedPeriod}
              availableMonths={availableMonths}
              onPeriodChange={setSelectedPeriod}
            />
          </div>

          {/* Metrics */}
          <BudgetMetrics 
            metrics={metrics}
            formatCurrency={formatCurrency}
          />

          {/* View Toggle */}
          <ViewToggle 
            viewMode={viewMode}
            onViewChange={setViewMode}
          />

          {/* Content */}
          <Card className="p-6" hover>
            {viewMode === 'table' ? (
              <BudgetTable
                data={currentMonthData.AMTBudgetTrackingData}
                onSort={handleSort}
                sortConfig={sortConfig}
                formatCurrency={formatCurrency}
              />
            ) : (
              <BudgetVisualization 
                data={currentMonthData.AMTBudgetTrackingData}
                mode={viewMode}
              />
            )}
          </Card>
        </Section>
      </div>
      <Footer />
    </div>
  );
}