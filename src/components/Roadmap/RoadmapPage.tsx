import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { Section } from '../common';
import { roadmapData } from './roadmapData';
import { Priority, RoadmapItem, Status } from '../../types/roadmap';
import { MultiSelectFilter } from './components/MultiSelectFilter';
import { SortableTable } from './components/SortableTable';

export function RoadmapPage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['all']));
  const [selectedImplementers, setSelectedImplementers] = useState<Set<string>>(new Set(['all']));
  const [selectedSMEs, setSelectedSMEs] = useState<Set<string>>(new Set(['all']));
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{
    field: keyof RoadmapItem | 'category';
    direction: 'asc' | 'desc';
  }>({
    field: 'priority',
    direction: 'asc'
  });

  // Get unique values for filters
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      roadmapData.map(item => `${item.discipline} - ${item.subCategory}`)
    );
    return Array.from(uniqueCategories).sort();
  }, []);

  const implementers = useMemo(() => {
    const uniqueImplementers = new Set(roadmapData.map(item => item.implementer));
    return Array.from(uniqueImplementers).sort();
  }, []);

  const smes = useMemo(() => {
    const uniqueSMEs = new Set(roadmapData.map(item => item.sme));
    return Array.from(uniqueSMEs).sort();
  }, []);

  // Filter handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (category === 'all') {
        return next.has('all') ? new Set() : new Set(['all']);
      }
      next.delete('all');
      if (next.has(category)) {
        next.delete(category);
        if (next.size === 0) next.add('all');
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleImplementerChange = (implementer: string) => {
    setSelectedImplementers(prev => {
      const next = new Set(prev);
      if (implementer === 'all') {
        return next.has('all') ? new Set() : new Set(['all']);
      }
      next.delete('all');
      if (next.has(implementer)) {
        next.delete(implementer);
        if (next.size === 0) next.add('all');
      } else {
        next.add(implementer);
      }
      return next;
    });
  };

  const handleSMEChange = (sme: string) => {
    setSelectedSMEs(prev => {
      const next = new Set(prev);
      if (sme === 'all') {
        return next.has('all') ? new Set() : new Set(['all']);
      }
      next.delete('all');
      if (next.has(sme)) {
        next.delete(sme);
        if (next.size === 0) next.add('all');
      } else {
        next.add(sme);
      }
      return next;
    });
  };

  // Handle sorting
  const handleSort = (field: keyof RoadmapItem | 'category') => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = roadmapData;

    if (!selectedCategories.has('all')) {
      filtered = filtered.filter(item => 
        selectedCategories.has(`${item.discipline} - ${item.subCategory}`)
      );
    }

    if (!selectedImplementers.has('all')) {
      filtered = filtered.filter(item => 
        selectedImplementers.has(item.implementer)
      );
    }

    if (!selectedSMEs.has('all')) {
      filtered = filtered.filter(item => 
        selectedSMEs.has(item.sme)
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (sortConfig.field === 'category') {
        const catA = `${a.discipline} - ${a.subCategory}`;
        const catB = `${b.discipline} - ${b.subCategory}`;
        return catA.localeCompare(catB) * direction;
      }
      
      if (sortConfig.field === 'targetDate') {
        return (new Date(a[sortConfig.field]).getTime() - new Date(b[sortConfig.field]).getTime()) * direction;
      }
      
      if (typeof a[sortConfig.field] === 'string') {
        return (a[sortConfig.field] as string).localeCompare(b[sortConfig.field] as string) * direction;
      }
      
      return ((a[sortConfig.field] as number) - (b[sortConfig.field] as number)) * direction;
    });
  }, [selectedCategories, selectedImplementers, selectedSMEs, priorityFilter, statusFilter, sortConfig]);

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Dashboard Roadmap</h1>
            
            {/* Filters */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              {/* Category Filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-secondary">Category</span>
                <MultiSelectFilter
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  selectedValues={selectedCategories}
                  onChange={handleCategoryChange}
                  placeholder="Select Categories"
                />
              </div>

              {/* Implementer Filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-secondary">Implementer</span>
                <MultiSelectFilter
                  options={implementers.map(imp => ({ value: imp, label: imp }))}
                  selectedValues={selectedImplementers}
                  onChange={handleImplementerChange}
                  placeholder="Select Implementers"
                />
              </div>

              {/* SME Filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-secondary">SME</span>
                <MultiSelectFilter
                  options={smes.map(sme => ({ value: sme, label: sme }))}
                  selectedValues={selectedSMEs}
                  onChange={handleSMEChange}
                  placeholder="Select SMEs"
                />
              </div>

              {/* Priority Filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-secondary">Priority</span>
                <select
                  value={priorityFilter === 'all' ? 'all' : priorityFilter.toString()}
                  onChange={(e) => setPriorityFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as Priority)}
                  className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary hover:bg-gray-700/50 transition-colors"
                >
                  <option value="all">All Priorities</option>
                  <option value="1">Priority 1</option>
                  <option value="2">Priority 2</option>
                  <option value="3">Priority 3</option>
                  <option value="4">Priority 4</option>
                  <option value="5">Priority 5</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-secondary">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
                  className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary hover:bg-gray-700/50 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <SortableTable
              data={filteredAndSortedData}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>
        </Section>
        <Footer />
      </div>
    </div>
  );
}