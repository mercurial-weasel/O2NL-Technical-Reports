import { useState, useMemo } from 'react';
import { O2NL_Staff } from '@api/projectcontrols/peopleculture';
import { FilterState } from '../types';

export function useTableFilters(data: O2NL_Staff[]) {
  const [filterState, setFilterState] = useState<FilterState>({
    disciplines: new Set(['all']),
    locations: new Set(['all']),
    nopTypes: new Set(['all']),
    orgs: new Set(['all']),
    phases: new Set(['all']),
    statuses: new Set(['all'])
  });

  const uniqueValues = useMemo(() => ({
    disciplines: Array.from(new Set(data.map(item => item.Team))).sort(),
    locations: Array.from(new Set(data.map(item => item.Location))).sort(),
    nopTypes: Array.from(new Set(data.map(item => item.NOPType))).sort(),
    orgs: Array.from(new Set(data.map(item => item.Org))).sort(),
    phases: Array.from(new Set(data.map(item => item.Phase))).sort(),
    statuses: Array.from(new Set(data.map(item => item.Status))).sort(),
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
      const matchesDiscipline = filterState.disciplines.has('all') || filterState.disciplines.has(item.Team);
      const matchesLocation = filterState.locations.has('all') || filterState.locations.has(item.Location);
      const matchesNOPType = filterState.nopTypes.has('all') || filterState.nopTypes.has(item.NOPType);
      const matchesOrg = filterState.orgs.has('all') || filterState.orgs.has(item.Org);
      const matchesPhase = filterState.phases.has('all') || filterState.phases.has(item.Phase);
      const matchesStatus = filterState.statuses.has('all') || filterState.statuses.has(item.Status);

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