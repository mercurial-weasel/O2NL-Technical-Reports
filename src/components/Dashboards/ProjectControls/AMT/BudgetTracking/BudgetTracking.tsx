import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { BackNavigation } from '../../../../common/BackNavigation';
import { BudgetVisualization } from './BudgetVisualization';
import { ReusableTable, formatCurrency } from '../../../Common/Tables/ReusableTable';
import { budgetData } from './data';
import { DollarSign, TrendingUp } from 'lucide-react';

type ViewMode = 'table' | 'hours' | 'budget';

interface BudgetMetric {
  title: string;
  value: number;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
}

export function BudgetTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [viewMode, setViewMode] = useState<ViewMode>('hours');
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);

  const metrics: BudgetMetric[] = [
    {
      title: 'Total Budget',
      value: budgetData.summary.TOTAL_ALL.TOTAL2,
      change: 0,
      status: 'neutral'
    },
    {
      title: 'Total Labour',
      value: budgetData.summary.TOTAL_LABOUR.TOTAL2,
      change: budgetData.summary.TOTAL_LABOUR.TOTAL_DIFF,
      status: 'negative'
    },
    {
      title: 'Total Expenses',
      value: budgetData.summary.TOTAL_EXPENSES.TOTAL2,
      change: budgetData.summary.TOTAL_EXPENSES.TOTAL_DIFF,
      status: 'positive'
    }
  ];

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current?.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const tableSections = [
    {
      title: '',
      colspan: 2,
      columns: [
        { field: 'ID', title: 'ID', align: 'left', sortable: true },
        { field: 'WORKSTREAM', title: 'Workstream', align: 'left', sortable: true }
      ]
    },
    {
      title: 'Stage 2 Build up',
      colspan: 2,
      columns: [
        { 
          field: 'HOURS1', 
          title: 'Hours', 
          align: 'right', 
          formatter: (value: number) => value?.toLocaleString(),
          sortable: true
        },
        { 
          field: 'TOTAL1', 
          title: 'Total', 
          align: 'right',
          formatter: formatCurrency,
          sortable: true 
        }
      ]
    },
    {
      title: 'Varied Value',
      colspan: 2,
      columns: [
        { 
          field: 'HOURS2', 
          title: 'Hours', 
          align: 'right', 
          formatter: (value: number) => value?.toLocaleString(),
          sortable: true
        },
        { 
          field: 'TOTAL2', 
          title: 'Total', 
          align: 'right',
          formatter: formatCurrency,
          sortable: true 
        }
      ]
    },
    {
      title: 'Difference',
      colspan: 2,
      columns: [
        { 
          field: 'HOURS_DIFF', 
          title: 'Hours', 
          align: 'right',
          sortable: true,
          formatter: (value: number) => (
            <span className={value < 0 ? 'text-green-400' : value > 0 ? 'text-red-400' : ''}>
              {value?.toLocaleString()}
            </span>
          )
        },
        { 
          field: 'TOTAL_DIFF', 
          title: 'Total', 
          align: 'right',
          sortable: true,
          formatter: (value: number) => (
            <span className={
              value > 0 ? 'text-red-400' : 
              value === 0 ? '' : 
              'text-green-400'
            }>
              {formatCurrency(value)}
            </span>
          )
        }
      ]
    }
  ];

  // Sort the data while keeping summary rows fixed
  const sortedData = useMemo(() => {
    if (!sortConfig) return budgetData.AMTBudgetTrackingData;

    return [...budgetData.AMTBudgetTrackingData].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);

  // Combine sorted data with summary rows
  const tableData = [
    ...sortedData,
    // Total Labour row
    {
      ID: '',
      WORKSTREAM: 'Total Labour',
      ...budgetData.summary.TOTAL_LABOUR,
      highlight: true
    },
    // Total Expenses row
    {
      ID: '',
      WORKSTREAM: 'Total Expenses',
      HOURS1: null,
      HOURS2: null,
      HOURS_DIFF: null,
      ...budgetData.summary.TOTAL_EXPENSES,
      highlight: true
    },
    // Grand Total row
    {
      ID: '',
      WORKSTREAM: 'Total All',
      ...budgetData.summary.TOTAL_ALL,
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Period Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">AMT Budget Tracking</h1>
            
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
              >
                <option value="current">Current Period</option>
                <option value="previous">Previous Period</option>
                <option value="ytd">Year to Date</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">{metric.title}</h3>
                    <div className="text-2xl font-bold text-text-primary">{formatCurrency(metric.value)}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.status === 'positive' ? 'text-green-400' :
                    metric.status === 'negative' ? 'text-red-400' :
                    'text-text-secondary'
                  }`}>
                    {metric.change !== 0 && (
                      <>
                        <TrendingUp className={`w-4 h-4 ${metric.change < 0 ? 'transform rotate-180' : ''}`} />
                        <span>{formatCurrency(Math.abs(metric.change))}</span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('hours')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'hours'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Hours View
              </button>
              <button
                onClick={() => setViewMode('budget')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'budget'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Budget View
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          <Card className="p-6" hover>
            {viewMode === 'table' ? (
              <ReusableTable
                title="Budget Details"
                sections={tableSections}
                data={tableData}
                config={{
                  headerColor: 'bg-blue-900',
                  textColor: 'text-text-primary',
                  highlightColor: 'bg-gray-800/50',
                  highlightTextColor: 'text-text-primary'
                }}
                onSort={handleSort}
                sortConfig={sortConfig}
                fixedRows={3}
              />
            ) : (
              <BudgetVisualization 
                data={budgetData.AMTBudgetTrackingData}
                mode={viewMode}
              />
            )}
          </Card>
        </Section>
        <Footer />
      </div>
    </div>
  );
}