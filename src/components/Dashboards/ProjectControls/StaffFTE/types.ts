export interface MonthColumn {
  key: string;
  label: string;
}

export interface FilterState {
  disciplines: Set<string>;
  locations: Set<string>;
  nopTypes: Set<string>;
  orgs: Set<string>;
  phases: Set<string>;
  statuses: Set<string>;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}