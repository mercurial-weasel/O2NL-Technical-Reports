export type UserRole = 'admin' | 'amt' | 'commercial' | 'member' | 'people';

/**
 * Check if a user with the specified role has access to a resource requiring specific roles
 */
export function hasRequiredRole(
  userRole: string | null | undefined, 
  requiredRoles: UserRole[] | undefined
): boolean {
  // If no specific roles are required, everyone has access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // If no user role is provided, deny access to protected resources
  if (!userRole) {
    return false;
  }

  // Strip 'org:' prefix if present for comparison
  const normalizedUserRole = userRole.toLowerCase().replace(/^org:/, '');

  // Admin always has access
  if (normalizedUserRole === 'admin') {
    return true;
  }

  // Check if user's normalized role is in the list of required roles
  return requiredRoles.map(r => r.toLowerCase()).includes(normalizedUserRole);
}

/**
 * Get current user role from organization memberships
 */
export function getUserRole(organizationMemberships: any[] | null | undefined): string | null {
  if (!organizationMemberships || organizationMemberships.length === 0) {
    return null;
  }
  
  const roleWithPrefix = organizationMemberships[0].role || null;
  
  // Return the role without the 'org:' prefix if it exists
  return roleWithPrefix ? roleWithPrefix.replace(/^org:/, '') : null;
}
