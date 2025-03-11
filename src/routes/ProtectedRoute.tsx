import { ReactNode, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AuthGuard } from '@auth/AuthComponents';
import { useUser } from '@clerk/clerk-react';
import { hasRequiredRole, getUserRole, UserRole } from '@lib/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isLoaded } = useUser();
  
  useEffect(() => {
    console.log('ProtectedRoute: Component initialized', {
      path: location.pathname,
      requiredRoles: requiredRoles?.join(', ') || 'none'
    });
  }, [location.pathname, requiredRoles]);

  return (
    <AuthGuard fallbackUrl="/login">
      {isLoaded && requiredRoles && requiredRoles.length > 0 ? (
        // Check role-based access
        (() => {
          const userRole = getUserRole(user?.organizationMemberships);
          
          console.log('Role check:', { userRole, requiredRoles });
          
          if (hasRequiredRole(userRole, requiredRoles)) {
            return children;
          } else {
            // Unauthorized access
            return (
              <div className="min-h-screen flex flex-col items-center justify-center bg-background-base">
                <div className="text-center p-8 max-w-md">
                  <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                  <p className="text-text-secondary mb-6">
                    You don't have the required permissions to access this page.
                    Your current role: <span className="font-semibold">{userRole || 'None'}</span>
                  </p>
                  <div className="mt-4">
                    <Navigate to="/dashboard" replace />
                  </div>
                </div>
              </div>
            );
          }
        })()
      ) : (
        // No specific role required
        children
      )}
    </AuthGuard>
  );
}
