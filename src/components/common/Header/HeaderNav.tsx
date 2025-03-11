import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { UserIcon, ChevronDownIcon, PencilSquareIcon, KeyIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getUserRole } from '@lib/roles';

export function HeaderNav() {
  const { isSignedIn } = useAuth();
  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Extract user info
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.primaryEmailAddress?.emailAddress || '';
  
  // Extract role from user metadata
  const userRole = React.useMemo(() => {
    if (!user) return '';
    
    const normalizedRole = getUserRole(user.organizationMemberships);
    console.log("HeaderNav - User Role:", {
      raw: user.organizationMemberships?.[0]?.role,
      normalized: normalizedRole
    });
    
    return normalizedRole || '';
  }, [user]);
  
  // Check if user is an admin - use the same logic as in the roles utility
  const isAdmin = userRole?.toLowerCase() === 'admin';
  
  console.log("HeaderNav - Admin Check:", { userRole, isAdmin });

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

  const handleEditProfile = () => {
    openUserProfile();
    setDropdownOpen(false);
  };

  const handleChangePassword = () => {
    openUserProfile({
      initialPage: 'security'
    });
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="hidden md:flex items-center gap-4">
      {/* Space for other navigation items */}
      <div className="flex-grow"></div>
      
      {/* User info, dropdown, and logout button */}
      <div className="flex items-center gap-4">
        {/* Admin Settings icon - only visible to admins */}
        {isSignedIn && isAdmin && (
          <Link 
            to="/admin/users" 
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-brand-primary/10 transition-colors"
            title="User Management"
            onClick={() => console.log("Admin gear icon clicked - navigating to /admin/users")}
          >
            <Cog6ToothIcon className="h-5 w-5 text-brand-primary" />
          </Link>
        )}
      
        {isSignedIn && (
          <>
            {/* User profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 py-2 px-3 rounded-md hover:bg-gray-700/20 transition-colors"
              >
                <UserIcon className="h-5 w-5 text-text-secondary" />
                <span className="text-text-secondary">Profile</span>
                <ChevronDownIcon className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-background-card-from border border-border-primary rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-brand-primary/10 w-full text-left"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-brand-primary/10 w-full text-left"
                    >
                      <KeyIcon className="h-4 w-4" />
                      Change Password
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User info moved to the right */}
            <div className="text-right">
              <div className="text-text-primary font-medium">{userName}</div>
              <div className="text-text-secondary text-sm">{userRole}</div>
            </div>
          </>
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