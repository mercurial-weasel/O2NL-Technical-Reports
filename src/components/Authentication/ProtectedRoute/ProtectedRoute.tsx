import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@lib/auth';
import { AccessRight } from '@lib/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAccess?: AccessRight[];
}

export function ProtectedRoute({ children, requiredAccess }: ProtectedRouteProps) {
  const { state } = useAuth();
  const location = useLocation();

  if (state.loading) {
    return (
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredAccess && !requiredAccess.some(right => state.user.accessRights.includes(right))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}