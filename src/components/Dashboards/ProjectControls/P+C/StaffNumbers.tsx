import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { Card } from '../../../common/Card';
import { BackNavigation } from '../../../common/BackNavigation';
import { StaffChart } from './components/StaffChart';
import { StaffApiClient } from '../../../../api/staff/client';
import { StaffMember } from '../../../../api/staff/types';
import { calculateMonthlyStaffData } from '../../../../api/staff/transformations';
import { MultiSelectFilter } from '../../../Roadmap/components/MultiSelectFilter';
import { logger } from '../../../../lib/logger';

export function StaffNumbers() {
  const [selectedImplementers, setSelectedImplementers] = useState<Set<string>>(new Set(['all']));
  const [selectedSMEs, setSelectedSMEs] = useState<Set<string>>(new Set(['all']));
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof StaffMember;
    direction: 'asc' | 'desc';
  }>({
    field: 'lastName',
    direction: 'asc'
  });

  const ITEMS_PER_PAGE = 10;

  // Use useCallback to memoize the fetch function
  const fetchStaffData = useCallback(async () => {
    // Skip if we already have data
    if (staffData.length > 0) {
      logger.debug('Skipping staff data fetch - data already loaded');
      return;
    }

    try {
      logger.info('Initiating staff data fetch');
      const client = new StaffApiClient();
      const data = await client.fetchStaffData();
      setStaffData(data);
      logger.info('Staff data fetch completed successfully', { recordCount: data.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load staff data');
      logger.error('Staff data fetch failed', { error: error.message });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [staffData.length]); // Only recreate if staffData.length changes

  // Single useEffect for data fetching
  useEffect(() => {
    if (isLoading && staffData.length === 0) {
      logger.debug('Initial staff data fetch triggered');
      fetchStaffData();
    }
  }, [fetchStaffData, isLoading, staffData.length]);

  // Get unique values for filters
  const organizations = useMemo(() => 
    Array.from(new Set(staffData.map(staff => staff.organization))).sort()
  , [staffData]);

  const disciplines = useMemo(() => 
    Array.from(new Set(staffData.map(staff => staff.discipline))).sort()
  , [staffData]);

  // Filter staff data
  const filteredStaff = useMemo(() => {
    let filtered = staffData;

    if (!selectedImplementers.has('all')) {
      filtered = filtered.filter(staff => 
        selectedImplementers.has(staff.organization)
      );
    }

    if (!selectedSMEs.has('all')) {
      filtered = filtered.filter(staff => 
        selectedSMEs.has(staff.discipline)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(staff => staff.status === statusFilter);
    }

    return filtered;
  }, [statusFilter, selectedImplementers, selectedSMEs, staffData]);

  // Calculate monthly data based on filtered staff
  const monthlyData = useMemo(() => 
    calculateMonthlyStaffData(filteredStaff)
  , [filteredStaff]);

  // Sort filtered data
  const sortedStaff = useMemo(() => {
    return [...filteredStaff].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [filteredStaff, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = sortedStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof StaffMember) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-6">Staff Numbers</h1>
            <p className="text-text-secondary">
              Track and monitor project staffing levels and resource allocation
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Organization Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Organization</label>
              <select
                value={[...selectedImplementers][0]}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedImplementers(prev => {
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
                <option value="all">All Organizations</option>
                {organizations.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            {/* Discipline Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Discipline</label>
              <select
                value={[...selectedSMEs][0]}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSMEs(prev => {
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
                <option value="all">All Disciplines</option>
                {disciplines.map(discipline => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Status</option>
                <option value="onboarded">Onboarded</option>
                <option value="offboarded">Offboarded</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Chart */}
          <Card className="p-6 mb-6" hover>
            <StaffChart 
              data={filteredStaff}
              selectedOrganization={[...selectedImplementers][0]}
              selectedDiscipline={[...selectedSMEs][0]}
            />
          </Card>

          {/* Staff Table */}
          <Card className="p-6" hover>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    {staffData.length > 0 && Object.keys(staffData[0]).map((key) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key as keyof StaffMember)}
                        className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer hover:text-brand-primary"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedStaff.map((staff, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/50 hover:bg-gray-700/20"
                    >
                      {Object.values(staff).map((value, valueIndex) => (
                        <td key={valueIndex} className="py-3 px-4 text-sm text-text-primary">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                Showing {Math.min(ITEMS_PER_PAGE * (currentPage - 1) + 1, filteredStaff.length)} to{' '}
                {Math.min(ITEMS_PER_PAGE * currentPage, filteredStaff.length)} of{' '}
                {filteredStaff.length} entries
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
          </Card>
        </Section>
        <Footer />
      </div>
    </div>
  );
}