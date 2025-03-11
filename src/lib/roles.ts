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
  
  console.log('Role comparison:', {
    original: userRole,
    normalized: normalizedUserRole,
    requiredRoles: requiredRoles.map(r => r.toLowerCase())
  });

  // Admin always has access
  if (normalizedUserRole === 'admin') {
    console.log('Admin access granted');
    return true;
  }

  // Check if user's normalized role is in the list of required roles
  const hasRole = requiredRoles.map(r => r.toLowerCase()).includes(normalizedUserRole);
  console.log('Role match result:', hasRole);
  return hasRole;
}

/**
 * Get current user role from organization memberships
 */
export function getUserRole(organizationMemberships: any[] | null | undefined): string | null {
  if (!organizationMemberships || organizationMemberships.length === 0) {
    console.log('No organization memberships found');
    return null;
  }
  
  const roleWithPrefix = organizationMemberships[0].role || null;
  console.log('Raw role from organization:', roleWithPrefix);
  
  // Return the role without the 'org:' prefix if it exists
  const normalizedRole = roleWithPrefix ? roleWithPrefix.replace(/^org:/, '') : null;
  console.log('Normalized role:', normalizedRole);
  
  return normalizedRole;
}
