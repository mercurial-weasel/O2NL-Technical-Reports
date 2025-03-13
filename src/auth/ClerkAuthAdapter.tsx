import { useEffect, useCallback } from 'react';
import { useUser, useAuth, useSession } from '@clerk/clerk-react';
import { AccessRight } from '@lib/auth/types';

// A fake adapter to maintain compatibility with legacy code
export function useAuthAdapter() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { session } = useSession();
  const { user } = useUser();
  
  // Enhanced logging to track auth state changes
  useEffect(() => {
    console.log('[Clerk Debug] Auth adapter state changed:', { 
      isLoaded, 
      isSignedIn, 
      userId,
      sessionActive: session?.status || 'unknown'
    });
    
    // Track session expiration time
    if (session) {
      const expiresAt = new Date(session.expireAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      console.log('[Clerk Debug] Session expiration:', {
        expiresAt: expiresAt.toLocaleString(),
        timeRemaining: `${Math.round(timeUntilExpiry / 60000)} minutes`,
      });
    }
  }, [isLoaded, isSignedIn, userId, session]);

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
      console.log('[Clerk Debug] signIn called in adapter (unsupported)');
      throw new Error('Direct sign in not supported - use Clerk components instead');
    },
    signOut: async () => {
      console.log('[Clerk Debug] signOut called in adapter (unsupported)');
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
    
    console.log('[Clerk Debug] User access rights:', { roles });
    
    return roles as AccessRight[];
  } catch (error) {
    console.error('[Clerk Debug] Error parsing user access rights:', error);
    return [];
  }
}

// Create a wrapper component to replace the old AuthProvider
export function LegacyAuthWrapper({ children }: { children: React.ReactNode }) {
  const { session } = useSession();

  // Enhanced authentication debugging
  useEffect(() => {
    if (session) {
      console.log('[Clerk Debug] Session in LegacyAuthWrapper:', {
        id: session.id,
        status: session.status,
        lastActive: new Date(session.lastActiveAt).toLocaleString(),
        expiry: new Date(session.expireAt).toLocaleString()
      });
    } else {
      console.log('[Clerk Debug] No active session in LegacyAuthWrapper');
    }
  }, [session]);
  
  // Check if we're in the middle of a Clerk auth flow to prevent redirects
  const isInAuthFlow = window.location.pathname.includes('/login') || 
                     window.location.pathname.includes('/register') ||
                     window.location.search.includes('__clerk');
  
  // Prevent any redirects during the auth flow
  const preventRedirectsDuringAuth = useCallback((e: any) => {
    if (isInAuthFlow && e && e.preventDefault) {
      console.log('[Clerk Debug] Preventing redirect during auth flow');
      e.preventDefault();
      return false;
    }
    return true;
  }, [isInAuthFlow]);
  
  const auth = useAuthAdapter();
  console.log('[Clerk Debug] LegacyAuthWrapper initialized', { isInAuthFlow });
  
  return <>{children}</>;
}
