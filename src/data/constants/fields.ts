export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  DATE: 'date',
  DATETIME: 'datetime',
  CHECKBOX: 'checkbox'
} as const;

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];

export const GEOTECHNICAL_FIELDS = {
  DEPTH: 'depth',
  MATERIAL_TYPE: 'material_type',
  MOISTURE_CONTENT: 'moisture_content',
  DENSITY: 'density',
  STRENGTH: 'strength',
  NOTES: 'notes'
} as const;

export const POINT_FIELDS = {
  POINT_ID: 'point_id',
  ZONE: 'zone',
  LAT: 'lat',
  LON: 'lon'
} as const;

export const SPT_RESULT_FIELDS = {
  POINT_ID: 'point_id',
  MATERIAL: 'material',
  TOP: 'top',
  NUM_TEST_BLOW_COUNT: 'num_test_blow_count',
  TOTAL_BLOW_COUNT: 'total_blow_count'
} as const;