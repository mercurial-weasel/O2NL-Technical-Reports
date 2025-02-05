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
    sustainability: '/api/sustainability'
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;