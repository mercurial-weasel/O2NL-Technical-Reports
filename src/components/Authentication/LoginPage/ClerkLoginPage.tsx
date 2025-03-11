import React, { useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Header, Footer, Section } from '@common';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export function ClerkLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  
  // Get the redirect URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  useEffect(() => {
    console.log('ClerkLoginPage: Component mounted', { isLoaded, isSignedIn, redirectTo: from });
    
    // Redirect to intended destination if already signed in
    if (isLoaded && isSignedIn) {
      console.log(`ClerkLoginPage: User already signed in, redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, from]);
  
  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-background-darker border border-border-subtle rounded-lg overflow-hidden">
              <SignIn 
                path="/login" 
                routing="path" 
                signUpUrl="/register"
                redirectUrl={from}
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "bg-transparent shadow-none",
                    header: "text-text-primary",
                    footer: "text-text-secondary"
                  }
                }}
                afterSignInUrl={from}
              />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
