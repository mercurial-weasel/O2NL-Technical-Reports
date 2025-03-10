import { MultiSelectFilter } from '../../../common/Filters';
import React, { useState, useEffect, useMemo } from 'react';
import { Filter, BarChart2, Table2 } from 'lucide-react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { BackNavigation } from '../../../common/BackNavigation';
import { PivotTable } from './components/PivotTable';
import { SystemsChart } from './components/SystemsChart';
import { SystemsApiClient } from '@api/systems/client';
import { getPivotData } from '@api/systems/transformations';
import { SystemData } from '@api/systems/types';
import { logger } from '../../../../lib/logger';

type ViewMode = 'table' | 'chart';

export function SystemsDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedImplementers, setSelectedImplementers] = useState<Set<string>>(new Set(['all']));
  const [selectedSMEs, setSelectedSMEs] = useState<Set<string>>(new Set(['all']));
  const [selectedAdoptionLevels, setSelectedAdoptionLevels] = useState<Set<string>>(new Set(['all']));
  const [systemsData, setSystemsData] = useState<SystemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch systems data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new SystemsApiClient();
        const data = await client.fetchSystemsData();
        setSystemsData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load systems data');
        logger.error('Systems data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique values for filters
  const implementers = useMemo(() => 
    Array.from(new Set(systemsData.map(system => system.HostedBy))).sort()
  , [systemsData]);

  const smes = useMemo(() => 
    Array.from(new Set(systemsData.map(system => system.SMEResponsible))).sort()
  , [systemsData]);

  const adoptionLevels = useMemo(() => 
    Array.from(new Set(systemsData.map(system => system.Adoption))).sort()
  , [systemsData]);

  // Get pivot data with filters
  const { data: pivotData, columnTotals, adoptionLevels: pivotAdoptionLevels } = useMemo(() => 
    getPivotData(systemsData, {
      businessAreas: new Set(['all']),
      licenseTypes: new Set(['all']),
      smeResponsibles: selectedSMEs,
      adoptionLevels: selectedAdoptionLevels
    })
  , [systemsData, selectedSMEs, selectedAdoptionLevels]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedImplementers(new Set(['all']));
    setSelectedSMEs(new Set(['all']));
    setSelectedAdoptionLevels(new Set(['all']));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading systems data...</div>
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
                Error loading systems data: {error.message}
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
            <h1 className="text-4xl font-bold text-text-primary mb-6">Systems Overview</h1>
            <p className="text-text-secondary">
              Monitor and manage project systems and infrastructure
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-lg font-medium text-brand-secondary">Filters</h3>
              </div>
              
              {/* Reset Filters Button */}
              <button
                onClick={handleResetFilters}
                className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
              >
                Reset Filters
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Implementer Filter */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Implementer</label>
                <MultiSelectFilter
                  options={implementers.map(impl => ({ value: impl, label: impl }))}
                  selectedValues={selectedImplementers}
                  onChange={(value) => setSelectedImplementers(prev => {
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
                  })}
                  placeholder="Select Implementers"
                />
              </div>

              {/* SME Filter */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">SME</label>
                <MultiSelectFilter
                  options={smes.map(sme => ({ value: sme, label: sme }))}
                  selectedValues={selectedSMEs}
                  onChange={(value) => setSelectedSMEs(prev => {
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
                  })}
                  placeholder="Select SMEs"
                />
              </div>

              {/* Adoption Filter */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Adoption Level</label>
                <MultiSelectFilter
                  options={adoptionLevels.map(level => ({ value: level, label: level }))}
                  selectedValues={selectedAdoptionLevels}
                  onChange={(value) => setSelectedAdoptionLevels(prev => {
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
                  })}
                  placeholder="Select Adoption Levels"
                />
              </div>
            </div>
          </div>

          {/* Systems Adoption Matrix */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Systems Adoption Matrix</h2>
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-700/50 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Table2 className="w-4 h-4" />
                  <span className="text-sm">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    viewMode === 'chart'
                      ? 'bg-brand-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span className="text-sm">Chart</span>
                </button>
              </div>
            </div>

            {viewMode === 'table' ? (
              <PivotTable 
                data={pivotData}
                columnTotals={columnTotals}
                adoptionLevels={pivotAdoptionLevels}
              />
            ) : (
              <SystemsChart 
                data={pivotData}
                adoptionLevels={pivotAdoptionLevels}
              />
            )}
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}