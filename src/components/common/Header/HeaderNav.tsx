import React from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';

export function HeaderNav() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  
  // Extract user info
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.primaryEmailAddress?.emailAddress || '';
  
  // Extract role from user metadata
  const userRole = React.useMemo(() => {
    if (!user) return '';
    
    // Get the user's organization role
    const organizationMemberships = user.organizationMemberships || [];
    const roleWithPrefix = organizationMemberships.length > 0
      ? organizationMemberships[0].role // First organization role
      : "User"; // Default role if none found

    // Remove org: prefix if present
    const role = roleWithPrefix ? roleWithPrefix.replace(/^org:/, '') : roleWithPrefix;

    console.log("Raw User Role:", roleWithPrefix);
    console.log("Normalized User Role:", role);
    return role;
  }, [user]);
  
  const handleLogout = () => {
    if (isSignedIn) {
      console.log('Logout requested from header');
      signOut().then(() => {
        console.log('User signed out successfully');
      }).catch(error => {
        console.error('Error signing out:', error);
      });
    }
  };
  
  return (
    <nav className="hidden md:flex items-center gap-4">
      {/* Navigation items removed */}
      
      {/* User info and logout button */}
      <div className="flex items-center gap-4">
        {isSignedIn && (
          <div className="text-right mr-2">
            <div className="text-text-primary font-medium">{userName}</div>
            <div className="text-text-secondary text-sm">{userRole}</div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          disabled={!isSignedIn}
          className={`
            font-medium py-2 px-4 rounded transition-colors
            ${isSignedIn 
              ? 'bg-brand-primary hover:bg-brand-primary/90 text-white' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'}
          `}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}