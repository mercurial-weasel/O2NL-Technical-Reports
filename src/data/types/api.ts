// src/data/types/api.ts
export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
  status?: number;
}

export interface ApiQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string | Record<string, 'asc' | 'desc'>;
  filter?: Record<string, unknown>;
  include?: string[];
}

export interface ApiOptions extends RequestInit {
  params?: ApiQueryParams;
}
