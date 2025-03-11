import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';

export function LoginButton() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // If already signed in, don't show the login button
  if (isSignedIn) {
    return null;
  }

  // Option 1: Use Clerk's SignInButton (modal approach)
  return (
    <SignInButton mode="modal">
      <button 
        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-4 rounded"
      >
        Login
      </button>
    </SignInButton>
  );
  
  // Option 2: Simple navigation to login page (uncomment to use)
  /*
  return (
    <button
      className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-4 rounded"
      onClick={() => navigate('/login')}
    >
      Login
    </button>
  );
  */
}