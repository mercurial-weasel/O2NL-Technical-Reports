import { SignInButton, SignOutButton, SignUpButton, UserButton, useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

// Sign In Button Component
export function LoginButton() {
  console.log('Rendering LoginButton component');
  return (
    <SignInButton mode="modal" afterSignInUrl="/dashboard">
      <button 
        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-4 rounded"
        onClick={() => console.log('Login button clicked')}
      >
        Login
      </button>
    </SignInButton>
  );
}

// Sign Up Button Component
export function RegisterButton() {
  console.log('Rendering RegisterButton component');
  return (
    <SignUpButton mode="modal">
      <button 
        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        onClick={() => console.log('Register button clicked')}
      >
        Register
      </button>
    </SignUpButton>
  );
}

// User Profile Button Component
export function ProfileButton() {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      console.log('ProfileButton: User loaded', { 
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }, [user]);

  return <UserButton 
    afterSignOutUrl="/" 
    afterMultiSessionSingleSignOutUrl="/"
    afterSwitchSessionUrl="/dashboard"
    signInUrl="/login"
    userProfileMode="modal"
    userProfileUrl="/profile"
  />;
}

// Sign Out Button Component
export function LogoutButton() {
  const { signOut } = useClerk();
  
  const handleSignOut = () => {
    console.log('Logout requested');
    signOut().then(() => {
      console.log('User signed out successfully');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };
  
  return (
    <button 
      onClick={handleSignOut}
      className="text-text-secondary hover:text-text-primary"
    >
      Logout
    </button>
  );
}

// Authentication Guard Component
interface AuthGuardProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function AuthGuard({ children, fallbackUrl = '/login' }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('AuthGuard: Checking authentication', { 
      isLoaded, 
      isSignedIn, 
      path: location.pathname 
    });
  }, [isLoaded, isSignedIn, location.pathname]);
  
  if (!isLoaded) {
    console.log('AuthGuard: Authentication still loading...');
    return <div>Loading authentication status...</div>;
  }
  
  if (!isSignedIn) {
    console.log(`AuthGuard: User not authenticated, redirecting to ${fallbackUrl}`);
    return <Navigate to={fallbackUrl} state={{ from: location }} replace />;
  }
  
  console.log('AuthGuard: Authentication successful, rendering protected content');
  return <>{children}</>;
}

// Hook to get current user data
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  useEffect(() => {
    if (isLoaded) {
      console.log('useCurrentUser: Auth state loaded', { 
        isSignedIn, 
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress
      });
    }
  }, [isLoaded, isSignedIn, user]);
  
  return {
    user,
    isLoaded,
    isSignedIn,
    // Easy access to common user properties
    userId: user?.id,
    username: user?.username,
    fullName: user?.fullName,
    email: user?.primaryEmailAddress?.emailAddress,
    imageUrl: user?.imageUrl
  };
}
