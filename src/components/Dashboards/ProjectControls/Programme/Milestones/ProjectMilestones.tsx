import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Header, Footer, Section, Card, BackNavigation, MultiSelectFilter } from '@common';
import { milestoneData, MilestoneTask } from './data';

type SortField = keyof MilestoneTask;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function ProjectMilestones() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [trendFilter, setTrendFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    field: 'status', 
    direction: 'asc' 
  });
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedAlliances, setSelectedAlliances] = useState<Set<string>>(new Set(['all']));

  // Get unique alliances for filter
  const alliances = useMemo(() => 
    Array.from(new Set(milestoneData.map(item => item.Alliance))).sort()
  , []);

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = milestoneData;

    // Apply alliance filter
    if (!selectedAlliances.has('all')) {
      filtered = filtered.filter(item => selectedAlliances.has(item.Alliance));
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item['Item Status'] === statusFilter);
    }

    // Sort data
    return [...filtered].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return String(a[sortConfig.field]).localeCompare(String(b[sortConfig.field])) * direction;
    });
  }, [milestoneData, selectedAlliances, statusFilter, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAllianceChange = (alliance: string) => {
    setSelectedAlliances(prev => {
      const next = new Set(prev);
      if (alliance === 'all') {
        return next.has('all') ? new Set() : new Set(['all']);
      }
      next.delete('all');
      if (next.has(alliance)) {
        next.delete(alliance);
        if (next.size === 0) next.add('all');
      } else {
        next.add(alliance);
      }
      return next;
    });
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
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Project Milestones</h1>
            
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="w-64">
                <MultiSelectFilter
                  options={alliances.map(alliance => ({ value: alliance, label: alliance }))}
                  selectedValues={selectedAlliances}
                  onChange={handleAllianceChange}
                  placeholder="Select Alliances"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Statuses</option>
                <option value="Achieved">Achieved</option>
                <option value="Not Achieved">Not Achieved</option>
              </select>
            </div>

            {/* Table */}
            <Card className="p-6" hover>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {Object.keys(milestoneData[0]).map((key) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key as SortField)}
                          className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
                        >
                          <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                            {key}
                            <span className="transition-opacity duration-200 group-hover:opacity-100">
                              {renderSortIndicator(key as SortField)}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-3 px-4 text-sm text-text-primary">{item.Milestone}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">{item.Alliance}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item['Item Status'] === 'Achieved' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {item['Item Status']}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-primary">{item.Baseline}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">{item['Planned/Actual']}</td>
                        <td className={`py-3 px-4 text-sm ${
                          item.Variance < 0 ? 'text-red-400' : 
                          item.Variance > 0 ? 'text-green-400' : 
                          'text-text-primary'
                        }`}>
                          {item.Variance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}