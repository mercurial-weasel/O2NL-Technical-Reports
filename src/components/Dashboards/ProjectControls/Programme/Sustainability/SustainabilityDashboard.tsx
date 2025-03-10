import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';
import { BackNavigation } from '@common/BackNavigation/BackNavigation';
import { SustainabilityReportApiClient } from '@api/programme/sustainability/client';
import { SustainabilityMonthlyRecord } from '@api/programme/sustainability/types';
import { logger } from '@lib/logger';

type SortField = 'discipline' | 'status' | 'trend';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function SustainabilityDashboard() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [trendFilter, setTrendFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    field: 'status', 
    direction: 'asc' 
  });
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [sustainabilityData, setSustainabilityData] = useState<SustainabilityMonthlyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new SustainabilityReportApiClient();
        const data = await client.fetchSustainabilityRecords();
        setSustainabilityData(data);
        
        // Set initial selected month to latest month
        const months = data.map(record => record.month).sort().reverse();
        if (months.length > 0) {
          setSelectedMonth(months[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load sustainability data');
        logger.error('Sustainability data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get available months from data
  const availableMonths = React.useMemo(() => 
    Array.from(new Set(sustainabilityData.map(record => record.month))).sort((a, b) => b.localeCompare(a)),
  [sustainabilityData]);

  // Get current month's data
  const currentMonthData = React.useMemo(() => 
    sustainabilityData.filter(record => record.month === selectedMonth),
  [sustainabilityData, selectedMonth]);

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = currentMonthData;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply trend filter
    if (trendFilter !== 'all') {
      filtered = filtered.filter(item => item.trend === trendFilter);
    }

    // Sort data
    return [...filtered].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (sortConfig.field === 'discipline') {
        return a.discipline.localeCompare(b.discipline) * direction;
      }
      return String(a[sortConfig.field]).localeCompare(String(b[sortConfig.field])) * direction;
    });
  }, [currentMonthData, statusFilter, trendFilter, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowClick = (id: string) => {
    navigate(`/project-controls/sustainability/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading sustainability data...</div>
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
                Error loading sustainability data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  const renderSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Month Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">Sustainability Summary</h1>
            
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

          {/* Table Card */}
          <Card className="p-6" hover>
            {/* Filters */}
            <div className="mb-6 flex items-center justify-end gap-4">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Status</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
              </select>

              {/* Trend Filter */}
              <select
                value={trendFilter}
                onChange={(e) => setTrendFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Trends</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="unchanged">Unchanged</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th 
                      className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
                      onClick={() => handleSort('discipline')}
                    >
                      <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                        Discipline
                        <span className="transition-opacity duration-200 group-hover:opacity-100">
                          {renderSortIndicator('discipline')}
                        </span>
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-center text-sm font-medium text-brand-secondary cursor-pointer group"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center gap-1 hover:text-brand-primary transition-colors">
                        Status
                        <span className="transition-opacity duration-200 group-hover:opacity-100">
                          {renderSortIndicator('status')}
                        </span>
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-center text-sm font-medium text-brand-secondary cursor-pointer group"
                      onClick={() => handleSort('trend')}
                    >
                      <div className="flex items-center justify-center gap-1 hover:text-brand-primary transition-colors">
                        Trend
                        <span className="transition-opacity duration-200 group-hover:opacity-100">
                          {renderSortIndicator('trend')}
                        </span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">
                      Key Issue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      className="border-b border-gray-700/50 hover:bg-gray-700/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-text-primary">{item.discipline}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${
                            item.status === 'green' ? 'bg-green-500' :
                            item.status === 'orange' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`} />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <div className={`${
                            item.trend === 'up' ? 'text-green-500' :
                            item.trend === 'down' ? 'text-red-500' :
                            'text-gray-500'
                          }`}>
                            {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '−'}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        {item.keyIssue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Section>
      </div>
      <Footer />
    </div>
  );
}