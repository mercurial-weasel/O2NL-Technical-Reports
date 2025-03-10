import React, { useState, useEffect } from 'react';
import { Filter, BarChart2, Table2 } from 'lucide-react';
import { Header, Footer, Section, Card, BackNavigation, MultiSelectFilter } from '@common';
import { ThemeCard } from './ThemeCard';
import { ThemeDetail } from './ThemeDetail';
import { GanttChart } from './GanttChart';
import { SustainabilityApiClient } from '@api/sustainability/client';
import { SustainabilityInitiative } from '@api/sustainability/types';
import { logger } from '@lib/logger';
import { 
  filterInitiativesByStatus, 
  filterInitiativesByTheme,
  sortInitiativesByDate 
} from '../../../../api/sustainability/transformations';

const ITEMS_PER_PAGE = 10;

export function SustainabilityInitiatives() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showGantt, setShowGantt] = useState(false);
  const [initiatives, setInitiatives] = useState<SustainabilityInitiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['all']));
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set(['all']));
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set(['all']));
  const [sortField, setSortField] = useState<keyof SustainabilityInitiative>('targetDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new SustainabilityApiClient();
        const data = await client.fetchSustainabilityData();
        setInitiatives(data);
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

  // Get unique values for filters
  const themes = React.useMemo(() => 
    Array.from(new Set(initiatives.map(i => i.theme))).sort()
  , [initiatives]);

  const priorities = React.useMemo(() => 
    Array.from(new Set(initiatives.map(i => i.priority))).sort()
  , [initiatives]);

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = initiatives;

    // Apply filters
    filtered = filterInitiativesByStatus(filtered, selectedStatuses);
    filtered = filterInitiativesByTheme(filtered, selectedThemes);
    
    if (!selectedPriorities.has('all')) {
      filtered = filtered.filter(i => selectedPriorities.has(i.priority));
    }

    // Sort data
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'targetDate') {
        return (new Date(aValue).getTime() - new Date(bValue).getTime()) * direction;
      }
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [initiatives, selectedStatuses, selectedThemes, selectedPriorities, sortField, sortDirection]);

  // Group initiatives by theme
  const themeGroups = React.useMemo(() => {
    const groups = new Map<string, SustainabilityInitiative[]>();
    filteredAndSortedData.forEach(initiative => {
      if (!groups.has(initiative.theme)) {
        groups.set(initiative.theme, []);
      }
      groups.get(initiative.theme)!.push(initiative);
    });
    return groups;
  }, [filteredAndSortedData]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">Sustainability Initiatives</h1>
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
                <button
                  onClick={() => setShowGantt(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showGantt 
                      ? 'bg-brand-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setShowGantt(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showGantt 
                      ? 'bg-brand-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>
            <p className="text-text-secondary">
              Track and monitor project sustainability initiatives and environmental impact metrics
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Theme Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Theme</label>
              <MultiSelectFilter
                options={themes.map(theme => ({ value: theme, label: theme }))}
                selectedValues={selectedThemes}
                onChange={(value) => {
                  setSelectedThemes(prev => {
                    const next = new Set(prev);
                    if (value === 'all') {
                      return next.has('all') ? new Set() : new Set(['all']);
                    }
                    next.delete('all');
                    if (next.has(value)) {
                      next.delete(value);
                      if (next.size === 0) next.add('all');
                    } else {
                      next.add(value);
                    }
                    return next;
                  });
                }}
                placeholder="Select Themes"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
              <select
                value={[...selectedStatuses][0]}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStatuses(prev => {
                    const next = new Set(prev);
                    if (value === 'all') {
                      return next.has('all') ? new Set() : new Set(['all']);
                    }
                    next.delete('all');
                    if (next.has(value)) {
                      next.delete(value);
                      if (next.size === 0) next.add('all');
                    } else {
                      next.add(value);
                    }
                    return next;
                  });
                }}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Statuses</option>
                <option value="Implemented">Implemented</option>
                <option value="Pending">Pending</option>
                <option value="Delayed">Delayed</option>
                <option value="Proposed">Proposed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Priority</label>
              <MultiSelectFilter
                options={priorities.map(priority => ({ value: priority, label: priority }))}
                selectedValues={selectedPriorities}
                onChange={(value) => {
                  setSelectedPriorities(prev => {
                    const next = new Set(prev);
                    if (value === 'all') {
                      return next.has('all') ? new Set() : new Set(['all']);
                    }
                    next.delete('all');
                    if (next.has(value)) {
                      next.delete(value);
                      if (next.size === 0) next.add('all');
                    } else {
                      next.add(value);
                    }
                    return next;
                  });
                }}
                placeholder="Select Priorities"
              />
            </div>
          </div>

          {/* Content */}
          {showGantt ? (
            <Card className="p-6" hover>
              <GanttChart initiatives={filteredAndSortedData} />
            </Card>
          ) : selectedTheme ? (
            <ThemeDetail 
              theme={selectedTheme}
              initiatives={themeGroups.get(selectedTheme)!}
              onClose={() => setSelectedTheme(null)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(themeGroups.entries()).map(([theme, initiatives]) => (
                <ThemeCard
                  key={theme}
                  theme={theme}
                  initiatives={initiatives}
                  onClick={() => setSelectedTheme(theme)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!showGantt && !selectedTheme && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                Showing {Math.min(ITEMS_PER_PAGE * (currentPage - 1) + 1, filteredAndSortedData.length)} to{' '}
                {Math.min(ITEMS_PER_PAGE * currentPage, filteredAndSortedData.length)} of{' '}
                {filteredAndSortedData.length} initiatives
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-800/50 text-text-secondary hover:bg-gray-700/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>
        <Footer />
      </div>
    </div>
  );
}