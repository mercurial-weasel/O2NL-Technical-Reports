// Common test IDs used across components
export const TEST_IDS = {
  // Loading states
  loading: 'loading-spinner',
  loadingText: 'loading-text',
  
  // Error states
  errorAlert: 'error-alert',
  errorMessage: 'error-message',
  
  // Common components
  button: 'button',
  input: 'input',
  select: 'select',
  
  // Navigation
  navLink: 'nav-link',
  backButton: 'back-button',
  
  // Auth
  loginForm: 'login-form',
  logoutButton: 'logout-button',
  
  // Data display
  table: 'table',
  tableRow: 'table-row',
  tableCell: 'table-cell',
  
  // Charts
  chart: 'chart',
  chartLegend: 'chart-legend',
  
  // Filters
  filterSection: 'filter-section',
  dateFilter: 'date-filter',
  statusFilter: 'status-filter'
} as const;