export const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:8000',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true', 
  endpoints: {
    spt: '/spt/data',
    staff: '/api/appGKLkgJPRufHGtg/Staff',
    staffFTE: '/api/staff-fte',
    materials: '/materials',
    zones: '/zones',
    systems: '/api/systems',
    sustainability: '/api/sustainability',
    emissions: '/api/emissions',
    amtBudget: '/api/cost/amt-budgets',
    earnedValue: '/api/cost/earned-value',
    consenting: '/api/programme/consenting',
    hours: '/api/cost/hours'
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;