export const TABLES = {
  POINTS: 'points',
  SPT_RESULTS: 'spt_results',
  STAFF: 'staff',
  MATERIALS: 'materials',
  ZONES: 'zones'
} as const;

export type TableName = typeof TABLES[keyof typeof TABLES];