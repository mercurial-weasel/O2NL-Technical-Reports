import { useAuth } from '../lib/auth';
import { hasRouteAccess } from '../routes/accessControl';
import { AccessRight } from '../lib/auth/types';
import { logger } from '../lib/logger';

export function useAccessControl() {
  const { state: authState } = useAuth();

  const checkAccess = (path: string): boolean => {
    if (!authState.user) {
      logger.debug('Access denied - no user', { path });
      return false;
    }

    // Admin has access to everything
    if (authState.user.accessRights.includes('Admin')) {
      return true;
    }

    const hasAccess = hasRouteAccess(path, authState.user.accessRights);
    
    if (!hasAccess) {
      logger.debug('Access denied', { 
        path, 
        userAccessRights: authState.user.accessRights 
      });
    }

    return hasAccess;
  };

  const checkAccessRights = (requiredRights: AccessRight[]): boolean => {
    if (!authState.user) {
      logger.debug('Access denied - no user', { requiredRights });
      return false;
    }

    // Admin has access to everything
    if (authState.user.accessRights.includes('Admin')) {
      return true;
    }

    const hasAccess = requiredRights.some(right => 
      authState.user.accessRights.includes(right)
    );

    if (!hasAccess) {
      logger.debug('Access denied', {
        requiredRights,
        userAccessRights: authState.user.accessRights
      });
    }

    return hasAccess;
  };

  return {
    checkAccess,
    checkAccessRights,
    userAccessRights: authState.user?.accessRights || [],
    isAdmin: authState.user?.accessRights.includes('Admin') || false
  };
}