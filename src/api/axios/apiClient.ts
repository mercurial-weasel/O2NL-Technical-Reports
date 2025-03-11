import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuth } from '@clerk/clerk-react';

// Base API client
const baseApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook to get an authenticated API client
export function useApiClient(): AxiosInstance {
  const { getToken } = useAuth();
  
  // Add auth token to requests
  baseApiClient.interceptors.request.use(async (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Only add token if not already present
    if (!config.headers.Authorization) {
      try {
        const token = await getToken();
        if (token) {
          console.log('Adding Clerk authentication token to request');
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log('No Clerk token available for request');
        }
      } catch (error) {
        console.error('Error getting Clerk token:', error);
      }
    }
    return config;
  });
  
  // Add response interceptor for logging
  baseApiClient.interceptors.response.use(
    (response) => {
      console.log(`API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('API Error:', error.response?.status, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
  
  return baseApiClient;
}

// For non-React contexts
export async function createAuthenticatedRequest(config: AxiosRequestConfig) {
  console.log('Creating authenticated request outside of React context');
  return baseApiClient(config);
}
