import { vi } from 'vitest';

// Mock API response data
export const mockApiResponse = {
  data: {},
  meta: {
    total: 0
  }
};

// Mock API error
export const mockApiError = {
  message: 'API Error',
  code: 'ERROR_CODE',
  details: {}
};

// Mock fetch function
export const mockFetch = vi.fn();

// Reset all mocks between tests
export function resetMocks() {
  mockFetch.mockReset();
}

// Setup successful API response
export function setupSuccessResponse(data: any) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data, meta: { total: 1 } })
  });
}

// Setup failed API response
export function setupErrorResponse(error: any = mockApiError) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    json: async () => error
  });
}