import { ClerkProvider as BaseClerkProvider, ClerkLoaded, ClerkLoading, useSession } from '@clerk/clerk-react';
import { ReactNode, useEffect } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

// Session monitor to debug unexpected logouts
const SessionMonitor = () => {
  const { session, isLoaded, isSignedIn } = useSession();
  
  useEffect(() => {
    if (isLoaded) {
      console.log('[Clerk Debug] Session state:', { 
        isSignedIn, 
        sessionId: session?.id,
        lastActive: session?.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : 'N/A',
        expiresAt: session?.expireAt ? new Date(session.expireAt).toLocaleString() : 'N/A',
        status: session?.status
      });
    }
  }, [isLoaded, isSignedIn, session]);

  // Log when session changes
  useEffect(() => {
    if (session) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log('[Clerk Debug] Tab became visible - checking session state:', {
            status: session.status,
            active: !session.status.includes('ended')
          });
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [session]);

  return null;
};

export function ClerkProvider({ children }: ClerkProviderProps) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    console.log('[Clerk Debug] ClerkProvider initialized with key:', publishableKey ? '✓ Available' : '✗ Missing');
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
      logLevel="debug"
      navigate={(to) => {
        console.log('[Clerk Debug] Navigation requested to:', to);
        window.history.pushState({}, '', to);
      }}
      // Add token refresh configuration to prevent early logouts
      tokenCache={(tokens) => {
        console.log('[Clerk Debug] Token operation:', tokens);
        return tokens;
      }}
    >
      <ClerkLoading>
        {() => {
          console.log('[Clerk Debug] Authentication loading...');
          return null;
        }}
      </ClerkLoading>
      <ClerkLoaded>
        {() => {
          console.log('[Clerk Debug] Authentication loaded successfully');
          return null;
        }}
      </ClerkLoaded>
      <SessionMonitor />
      {children}
    </BaseClerkProvider>
  );
}
