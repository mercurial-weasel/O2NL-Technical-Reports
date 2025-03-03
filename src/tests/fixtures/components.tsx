import React from 'react';
import { Card } from '../../components/common/Card';

// Mock components for testing
export const MockCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="p-4" hover>
    {children}
  </Card>
);

export const MockErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="error-boundary">
    {children}
  </div>
);

export const MockLoadingSpinner = () => (
  <div data-testid="loading-spinner">Loading...</div>
);

export const MockErrorMessage = ({ message }: { message: string }) => (
  <div data-testid="error-message" className="text-red-400">
    {message}
  </div>
);