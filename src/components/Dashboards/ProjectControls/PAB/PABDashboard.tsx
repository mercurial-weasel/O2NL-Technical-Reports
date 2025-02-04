import React, { useState } from 'react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { BackNavigation } from '../../../common/BackNavigation';
import { BudgetCard } from './BudgetCard';
import { CostCard } from './CostCard';
import { CostIndicatorsCard } from './CostIndicatorsCard';
import { RiskIndicatorsCard } from './RiskIndicatorsCard';
import { Limb1IndicatorsCard } from './Limb1IndicatorsCard';
import { Limb3IndicatorsCard } from './Limb3IndicatorsCard';
import { ExpenditureIndicatorsCard } from './ExpenditureIndicatorsCard';
import { ExpenditureChart } from './ExpenditureChart';
import { FundingSplitCard } from './FundingSplitCard';

export function PABDashboard() {
  const [selectedMonth, setSelectedMonth] = useState('Current');

  const months = [
    'Current',
    'December 2024',
    'November 2024'
  ];

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Month Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">Project Advisory Board</h1>
            
            {/* Month Selector */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-x-6">
            {/* Left Column */}
            <div className="space-y-0">
              <BudgetCard />
              <CostIndicatorsCard />
              <CostCard />
              <Limb1IndicatorsCard />
            </div>

            {/* Right Column */}
            <div className="space-y-0">
              <ExpenditureChart />
              <RiskIndicatorsCard />
              <FundingSplitCard />
              <Limb3IndicatorsCard />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}