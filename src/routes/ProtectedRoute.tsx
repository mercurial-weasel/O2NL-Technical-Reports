import { ReactNode, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AuthGuard } from '@auth/AuthComponents';
import { useUser } from '@clerk/clerk-react';
import { hasRequiredRole, getUserRole, UserRole } from '@lib/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

// Extracted component for access denied screen
function AccessDeniedScreen({ userRole, requiredRoles }: { userRole: string | null, requiredRoles: UserRole[] }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-base">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-text-secondary mb-6">
          You don't have the required permissions to access this page.
          Your current role: <span className="font-semibold">{userRole || 'None'}</span>
        </p>
        <p className="text-xs text-text-secondary mb-4">
          Required roles: {requiredRoles.join(', ')}
        </p>
        <div className="mt-4">
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isLoaded } = useUser();
  
  // Enhanced debugging for role-based access
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = getUserRole(user?.organizationMemberships);
      const hasAccess = hasRequiredRole(userRole, requiredRoles);
      
      console.log('ProtectedRoute: Access check', {
        path: location.pathname,
        requiredRoles: requiredRoles?.join(', ') || 'none',
        userRole,
        rawRole: user?.organizationMemberships?.[0]?.role,
        hasAccess,
      });
    }
  }, [location.pathname, requiredRoles, isLoaded, user]);

  // Early check - if no role requirements or not loaded, just render children
  if (!isLoaded || !requiredRoles || requiredRoles.length === 0) {
    return <AuthGuard fallbackUrl="/login">{children}</AuthGuard>;
  }

  // Get user role and check permissions
  const userRole = getUserRole(user?.organizationMemberships);
  
  // Debug raw role data
  console.log('Role check raw data:', { 
    userRole, 
    organizationMemberships: user?.organizationMemberships,
    requiredRoles 
  });
  
  // Check if user has required role
  const hasAccess = hasRequiredRole(userRole, requiredRoles);

  return (
    <AuthGuard fallbackUrl="/login">
      {hasAccess ? children : <AccessDeniedScreen userRole={userRole} requiredRoles={requiredRoles} />}
    </AuthGuard>
  );
}
