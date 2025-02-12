import React, { useState, useEffect } from 'react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { BackNavigation } from '../../../../common/BackNavigation';
import { EarnedValuePivotTable } from './EarnedValuePivotTable';
import { EarnedValueApiClient } from '../../../../../api/cost/earned-value/client';
import { calculateEarnedValueMetrics, getAvailableMonths, calculateLineItems } from '../../../../../api/cost/earned-value/transformations';
import { logger } from '../../../../../lib/logger';

export function EarnedValueSummary() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [earnedValueData, setEarnedValueData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new EarnedValueApiClient();
        const data = await client.fetchEarnedValueData();
        setEarnedValueData(data);
        
        // Set initial selected period to latest month
        const months = getAvailableMonths(data);
        if (months.length > 0) {
          setSelectedPeriod(months[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load earned value data');
        logger.error('Earned value data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableMonths = React.useMemo(() => 
    earnedValueData ? getAvailableMonths(earnedValueData) : [],
  [earnedValueData]);

  const metrics = React.useMemo(() => 
    earnedValueData && selectedPeriod ? calculateEarnedValueMetrics(earnedValueData, selectedPeriod) : null,
  [earnedValueData, selectedPeriod]);

  const lineItems = React.useMemo(() => 
    earnedValueData && selectedPeriod ? calculateLineItems(earnedValueData, selectedPeriod) : [],
  [earnedValueData, selectedPeriod]);

  // Formatting helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading earned value data...</div>
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
                Error loading earned value data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (!metrics || !lineItems.length) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Controls */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Earned Value Analysis</h1>
              <p className="text-text-secondary mt-2">
                Track project performance through earned value management metrics
              </p>
            </div>

            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6" hover>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Planned Value (PV)</h3>
              <div className="text-2xl font-bold text-text-primary">{formatCurrency(metrics.plannedValue)}</div>
            </Card>

            <Card className="p-6" hover>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Earned Value (EV)</h3>
              <div className="text-2xl font-bold text-text-primary">{formatCurrency(metrics.earnedValue)}</div>
            </Card>

            <Card className="p-6" hover>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Actual Cost (AC)</h3>
              <div className="text-2xl font-bold text-text-primary">{formatCurrency(metrics.actualCost)}</div>
            </Card>

            <Card className="p-6" hover>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Cost Performance Index (CPI)</h3>
              <div className="text-2xl font-bold text-text-primary">{metrics.cpi.toFixed(2)}</div>
            </Card>
          </div>

          {/* Pivot Table */}
          <Card className="p-6" hover>
            <EarnedValuePivotTable data={lineItems} />
          </Card>
        </Section>
        <Footer />
      </div>
    </div>
  );
}