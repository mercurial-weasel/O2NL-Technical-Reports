import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getUserRole, hasRequiredRole, UserRole } from '@lib/roles';

interface RBACWrapperProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

// Extracted component for access denied screen
function AccessDeniedScreen({ userRole, fallbackPath }: { userRole: string | null, fallbackPath: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-base">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-text-secondary mb-6">
          You don't have the required permissions to access this page.
          Your current role: <span className="font-semibold">{userRole || 'None'}</span>
        </p>
        <div className="mt-4">
          <Navigate to={fallbackPath} replace />
        </div>
      </div>
    </div>
  );
}

export function RBACWrapper({ 
  children, 
  requiredRoles, 
  fallbackPath = '/dashboard' 
}: RBACWrapperProps) {
  const { user, isLoaded } = useUser();
  
  // Wait for auth to load
  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  // Get user role and check permissions
  const userRole = getUserRole(user?.organizationMemberships);
  const hasPermission = hasRequiredRole(userRole, requiredRoles);
  
  console.log('RBAC Check:', {
    userRole,
    requiredRoles,
    hasPermission,
    path: window.location.pathname
  });
  
  // If user doesn't have permission, show access denied
  if (!hasPermission) {
    return <AccessDeniedScreen userRole={userRole} fallbackPath={fallbackPath} />;
  }
  
  // User has permission, render children
  return <>{children}</>;
}
