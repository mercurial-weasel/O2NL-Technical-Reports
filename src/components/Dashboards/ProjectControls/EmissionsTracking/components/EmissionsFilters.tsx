import React from 'react';
import { MultiSelectFilter } from '../../../../common/Filters';

interface EmissionsFiltersProps {
  categories: string[];
  years: string[];
  selectedCategories: Set<string>;
  selectedYears: Set<string>;
  onCategoryChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export function EmissionsFilters({
  categories,
  years,
  selectedCategories,
  selectedYears,
  onCategoryChange,
  onYearChange
}: EmissionsFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Category
        </label>
        <MultiSelectFilter
          options={categories.map(category => ({ value: category, label: category }))}
          selectedValues={selectedCategories}
          onChange={onCategoryChange}
          placeholder="Select Categories"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Year
        </label>
        <MultiSelectFilter
          options={years.map(year => ({ value: year, label: year }))}
          selectedValues={selectedYears}
          onChange={onYearChange}
          placeholder="Select Years"
        />
      </div>
    </div>
  );
}