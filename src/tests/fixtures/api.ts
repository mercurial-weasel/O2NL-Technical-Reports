export const mockApiResponses = {
  success: {
    data: {},
    meta: {
      total: 0
    }
  },
  error: {
    message: 'API Error',
    code: 'ERROR_CODE',
    details: {}
  }
};

export const mockFetchResponses = {
  success: {
    ok: true,
    json: async () => mockApiResponses.success
  },
  error: {
    ok: false,
    json: async () => mockApiResponses.error
  }
};