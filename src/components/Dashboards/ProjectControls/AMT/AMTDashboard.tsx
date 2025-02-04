import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { BackNavigation } from '../../../common/BackNavigation';
import { amtData } from './data/amtData';

type SortField = 'title' | 'status' | 'trend';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function AMTDashboard() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [trendFilter, setTrendFilter] = useState('all');
  // Initialize sort config to sort by status ascending
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    field: 'status', 
    direction: 'asc' 
  });

  // Get available months from data
  const availableMonths = useMemo(() => 
    Object.keys(amtData).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    }), 
  []);

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => {
      if (current.field !== field) {
        return { field, direction: 'asc' };
      }
      return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  const filteredAndSortedData = useMemo(() => {
    const currentMonthData = amtData[selectedMonth] || [];
    
    let filtered = currentMonthData.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesTrend = trendFilter === 'all' || item.trend === trendFilter;
      return matchesStatus && matchesTrend;
    });

    // Always sort the data
    filtered.sort((a, b) => {
      if (sortConfig.field === 'title') {
        return sortConfig.direction === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortConfig.field === 'status') {
        const statusOrder = { green: 0, orange: 1, red: 2 };
        return sortConfig.direction === 'asc'
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
      if (sortConfig.field === 'trend') {
        const trendOrder = { up: 0, unchanged: 1, down: 2 };
        return sortConfig.direction === 'asc'
          ? trendOrder[a.trend] - trendOrder[b.trend]
          : trendOrder[b.trend] - trendOrder[a.trend];
      }
      return 0;
    });

    return filtered;
  }, [selectedMonth, statusFilter, trendFilter, sortConfig]);

  const handleRowClick = (id: string) => {
    navigate(`/project-controls/amt/${id}`);
  };

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
            <h1 className="text-3xl font-bold text-text-primary">Alliance Management Team Summary</h1>
            
            {/* Month Selector */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
              >
                {availableMonths.map(month => (
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
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th 
                      className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                        Title
                        <span className="transition-opacity duration-200 group-hover:opacity-100">
                          {renderSortIndicator('title')}
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
                      <td className="py-3 px-4 text-sm text-text-primary">{item.title}</td>
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