import React, { useState, useEffect } from 'react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { BackNavigation } from '../../../common/BackNavigation';
import { ConsentingApiClient } from '../../../../api/programme/consenting/client';
import { ConsentingTable } from './components/ConsentingTable';
import { RiskSummaryCards } from './components/RiskSummaryCards';
import { calculateRiskSummary } from '../../../../api/programme/consenting/transformations';
import { logger } from '../../../../lib/logger';

export function ConsentingDashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [consentData, setConsentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const client = new ConsentingApiClient();
        const months = await client.getAvailableMonths();
        setAvailableMonths(months);
        if (months.length > 0) {
          setSelectedMonth(months[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load available months');
        logger.error('Failed to fetch available months', { error: error.message });
        setError(error);
      }
    };

    fetchMonths();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMonth) return;

      try {
        setIsLoading(true);
        const client = new ConsentingApiClient();
        const data = await client.fetchConsentData(selectedMonth);
        setConsentData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load consent data');
        logger.error('Failed to fetch consent data', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading consent data...</div>
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
                Error loading consent data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  const riskSummary = consentData ? calculateRiskSummary(consentData) : null;

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Month Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">Consent Pathway Risk Assessment</h1>
            
            {/* Month Selector */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
              >
                {availableMonths.map(month => (
                  <option key={month} value={month}>
                    {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Risk Summary Cards */}
          {riskSummary && (
            <div className="mb-8">
              <RiskSummaryCards summary={riskSummary} />
            </div>
          )}

          {/* Consent Table */}
          {consentData && (
            <Card className="p-6" hover>
              <ConsentingTable data={consentData} />
            </Card>
          )}
        </Section>
      </div>
      <Footer />
    </div>
  );
}