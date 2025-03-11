import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { AccessRight } from '@lib/auth/types';

// A fake adapter to maintain compatibility with legacy code
export function useAuthAdapter() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  
  useEffect(() => {
    console.log('ClerkAuthAdapter: Initializing auth adapter', { 
      isLoaded, 
      isSignedIn, 
      userId 
    });
  }, [isLoaded, isSignedIn, userId]);

  // Map Clerk user to the legacy AuthUser format
  const authUser = isSignedIn && user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    accessRights: getUserAccessRights(user),
    created_at: user.createdAt || new Date().toISOString()
  } : null;
  
  return {
    state: {
      user: authUser,
      loading: !isLoaded,
      error: null
    },
    signIn: async (email: string, password: string) => {
      console.log('ClerkAuthAdapter: signIn called, but this is a no-op since Clerk handles sign-in');
      throw new Error('Direct sign in not supported - use Clerk components instead');
    },
    signOut: async () => {
      console.log('ClerkAuthAdapter: signOut called, but this is a no-op since Clerk handles sign-out');
      throw new Error('Direct sign out not supported - use Clerk components instead');
    }
  };
}

// Helper to extract access rights from Clerk user metadata
// This can be customized based on how you store roles in Clerk
function getUserAccessRights(user: any): AccessRight[] {
  try {
    // Check if user has public metadata with roles
    const publicMetadata = user.publicMetadata || {};
    const roles = publicMetadata.roles || [];
    
    console.log('ClerkAuthAdapter: Parsed user access rights', { roles });
    
    return roles as AccessRight[];
  } catch (error) {
    console.error('Error parsing user access rights:', error);
    return [];
  }
}

// Create a wrapper component to replace the old AuthProvider
export function LegacyAuthWrapper({ children }: { children: React.ReactNode }) {
  // Check if we're in the middle of a Clerk auth flow to prevent redirects
  const isInAuthFlow = window.location.pathname.includes('/login') || 
                       window.location.pathname.includes('/register') ||
                       window.location.search.includes('__clerk');
  
  // Prevent any redirects during the auth flow
  const preventRedirectsDuringAuth = (e) => {
    if (isInAuthFlow && e && e.preventDefault) {
      console.log('Preventing redirect during auth flow');
      e.preventDefault();
      return false;
    }
    return true;
  };
  
  const auth = useAuthAdapter();
  console.log('LegacyAuthWrapper: Providing backwards compatibility for legacy auth code');
  
  // You might want to set up a context provider here if needed for legacy code
  return <>{children}</>;
}
