import React from 'react';
import { MultiSelectFilter } from '../../../../common/Filters';

interface FilterOption {
  value: string;
  label: string;
}

interface TableFiltersProps {
  filters: {
    disciplines: FilterOption[];
    locations: FilterOption[];
    nopTypes: FilterOption[];
    orgs: FilterOption[];
    phases: FilterOption[];
    statuses: FilterOption[];
  };
  selectedValues: {
    disciplines: Set<string>;
    locations: Set<string>;
    nopTypes: Set<string>;
    orgs: Set<string>;
    phases: Set<string>;
    statuses: Set<string>;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

export function TableFilters({ filters, selectedValues, onFilterChange }: TableFiltersProps) {
  return (
    <div className="flex items-end gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">Discipline</label>
        <MultiSelectFilter
          options={filters.disciplines}
          selectedValues={selectedValues.disciplines}
          onChange={(value) => onFilterChange('disciplines', value)}
          placeholder="Select Disciplines"
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">Location</label>
        <MultiSelectFilter
          options={filters.locations}
          selectedValues={selectedValues.locations}
          onChange={(value) => onFilterChange('locations', value)}
          placeholder="Select Locations"
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">NOP Type</label>
        <MultiSelectFilter
          options={filters.nopTypes}
          selectedValues={selectedValues.nopTypes}
          onChange={(value) => onFilterChange('nopTypes', value)}
          placeholder="Select NOP Types"
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">Organization</label>
        <MultiSelectFilter
          options={filters.orgs}
          selectedValues={selectedValues.orgs}
          onChange={(value) => onFilterChange('orgs', value)}
          placeholder="Select Organizations"
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">Phase</label>
        <MultiSelectFilter
          options={filters.phases}
          selectedValues={selectedValues.phases}
          onChange={(value) => onFilterChange('phases', value)}
          placeholder="Select Phases"
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
        <MultiSelectFilter
          options={filters.statuses}
          selectedValues={selectedValues.statuses}
          onChange={(value) => onFilterChange('statuses', value)}
          placeholder="Select Statuses"
        />
      </div>
    </div>
  );
}