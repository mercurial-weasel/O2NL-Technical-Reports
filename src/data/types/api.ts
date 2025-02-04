export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

// Common query parameters for API requests
export interface ApiQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: Record<string, unknown>;
}