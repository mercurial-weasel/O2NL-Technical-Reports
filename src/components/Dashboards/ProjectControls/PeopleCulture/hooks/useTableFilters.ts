import { useState, useMemo } from 'react';
import { StaffMember } from '@api/projectcontrols/peopleculture/staff';
import { FilterState } from '@features_ProjectControls/Staff/types';

export function useTableFilters(data: StaffMember[]) {
  const [filterState, setFilterState] = useState<FilterState>({
    disciplines: new Set(['all']),
    locations: new Set(['all']),
    nopTypes: new Set(['all']),
    orgs: new Set(['all']),
    phases: new Set(['all']),
    statuses: new Set(['all'])
  });

  const uniqueValues = useMemo(() => ({
    disciplines: Array.from(new Set(data.map(item => item.team))).sort(),
    locations: Array.from(new Set(data.map(item => item.location))).sort(),
    nopTypes: Array.from(new Set(data.map(item => item.nopType))).sort(),
    orgs: Array.from(new Set(data.map(item => item.org))).sort(),
    phases: Array.from(new Set(data.map(item => item.phase))).sort(),
    statuses: Array.from(new Set(data.map(item => item.status))).sort(),
  }), [data]);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilterState(prev => {
      const next = new Set(prev[filterType]);
      if (value === 'all') {
        return {
          ...prev,
          [filterType]: next.has('all') ? new Set() : new Set(['all'])
        };
      }
      next.delete('all');
      if (next.has(value)) {
        next.delete(value);
        if (next.size === 0) next.add('all');
      } else {
        next.add(value);
      }
      return {
        ...prev,
        [filterType]: next
      };
    });
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesDiscipline = filterState.disciplines.has('all') || filterState.disciplines.has(item.team);
      const matchesLocation = filterState.locations.has('all') || filterState.locations.has(item.location);
      const matchesNOPType = filterState.nopTypes.has('all') || filterState.nopTypes.has(item.nopType);
      const matchesOrg = filterState.orgs.has('all') || filterState.orgs.has(item.org);
      const matchesPhase = filterState.phases.has('all') || filterState.phases.has(item.phase);
      const matchesStatus = filterState.statuses.has('all') || filterState.statuses.has(item.status);

      return matchesDiscipline && matchesLocation && matchesNOPType && 
             matchesOrg && matchesPhase && matchesStatus;
    });
  }, [data, filterState]);

  return {
    filterState,
    uniqueValues,
    handleFilterChange,
    filteredData
  };
}