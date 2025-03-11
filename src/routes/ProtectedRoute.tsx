import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthGuard } from '@auth/AuthComponents';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute: Component initialized', {
      path: location.pathname,
      requiredRole: requiredRole || 'none'
    });
  }, [location.pathname, requiredRole]);

  return (
    <AuthGuard fallbackUrl="/login">
      {children}
    </AuthGuard>
  );
}
