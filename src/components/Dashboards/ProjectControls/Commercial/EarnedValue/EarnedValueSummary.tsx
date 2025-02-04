import React, { useState, useMemo } from 'react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { BackNavigation } from '../../../../common/BackNavigation';
import { calculateDisciplineSummaries, calculateTotalSummary, calculateEarnedValueMetrics, getAvailableMonths, calculateLineItems } from './transformers';
import { EarnedValuePivotTable } from './EarnedValuePivotTable';

export function EarnedValueSummary() {
  const [selectedPeriod, setSelectedPeriod] = useState(getAvailableMonths()[0]);

  // Calculate data
  const metrics = useMemo(() => calculateEarnedValueMetrics(selectedPeriod), [selectedPeriod]);
  const lineItems = useMemo(() => calculateLineItems(selectedPeriod), [selectedPeriod]);

  // Formatting helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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
              {getAvailableMonths().map(month => (
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