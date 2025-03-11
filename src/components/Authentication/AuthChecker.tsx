import { useEffect, ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthCheckerProps {
  children: ReactNode;
}

export function AuthChecker({ children }: AuthCheckerProps) {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for auth paths to prevent interference with the Clerk flow
  const isAuthPath = location.pathname.startsWith('/login') || 
                    location.pathname.startsWith('/register') ||
                    location.search.includes('__clerk');
  
  useEffect(() => {
    // Only run auth checks if not in an auth path
    if (isLoaded && !isAuthPath) {
      // Only check after Clerk has loaded
      if (!isLoaded) return;
      
      console.log('AuthChecker: Authentication state loaded', { userId, path: location.pathname });
      
      // List of public paths that don't require authentication
      const publicPaths = ['/', '/login', '/register', '/forgot-password', '/privacy', '/terms'];
      // Check if current path starts with any of the public paths
      const isPublicPath = publicPaths.some(path => 
        location.pathname === path || 
        (path !== '/' && location.pathname.startsWith(path + '/'))
      );
      
      // List of auth-only paths that require authentication
      const authOnlyPaths = ['/login', '/register', '/forgot-password'];
      const isAuthOnlyPath = authOnlyPaths.some(path => location.pathname === path);
      
      // Get redirect destination from location state or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      
      // Redirect to login if at root path and not signed in
      if (location.pathname === '/' && !userId) {
        console.log('User at root path and not authenticated, redirecting to login');
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }
      
      if (userId && isAuthOnlyPath) {
        // If user is signed in and tries to access login/register pages, 
        // redirect to previous location or dashboard
        console.log(`User already authenticated, redirecting to ${from}`);
        navigate(from, { replace: true });
      } else if (!userId && !isPublicPath) {
        // If user is not signed in and tries to access a protected route
        console.log('User not authenticated, redirecting to login');
        navigate('/login', { state: { from: location }, replace: true });
      }
    }
  }, [isLoaded, userId, navigate, location.pathname, isAuthPath]);
  
  // Show a simple loading indicator when auth is being determined
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-base">
        <div className="animate-pulse text-text-secondary">
          Loading authentication...
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
