import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@lib/auth/context';

interface TestProvidersProps {
  children: React.ReactNode;
}

export function TestProviders({ children }: TestProvidersProps) {
  return (
    <AuthProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AuthProvider>
  );
}