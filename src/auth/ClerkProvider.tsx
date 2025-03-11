import { ClerkProvider as BaseClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { ReactNode, useEffect } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    console.log('ClerkProvider initialized with key:', publishableKey ? '✓ Available' : '✗ Missing');
  }, [publishableKey]);

  if (!publishableKey) {
    console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
  }

  // Determine if we should use dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <BaseClerkProvider 
      publishableKey={publishableKey}
      appearance={{
        variables: { colorPrimary: '#10b981' },
        baseTheme: prefersDarkMode ? 'dark' : 'light'
      }}
      navigate={(to) => {
        console.log('Clerk navigation requested to:', to);
        window.history.pushState({}, '', to);
      }}
    >
      <ClerkLoading>
        {() => {
          console.log('Clerk: Loading authentication...');
          return null;
        }}
      </ClerkLoading>
      <ClerkLoaded>
        {() => {
          console.log('Clerk: Authentication loaded successfully');
          return null;
        }}
      </ClerkLoaded>
      {children}
    </BaseClerkProvider>
  );
}
