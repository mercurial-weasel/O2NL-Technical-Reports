import React, { useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Header, Footer, Section } from '@common';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export function ClerkRegisterPage() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  
  useEffect(() => {
    console.log('ClerkRegisterPage: Component mounted', { isLoaded, isSignedIn });
    
    // Redirect to dashboard if already signed in
    if (isLoaded && isSignedIn) {
      console.log('ClerkRegisterPage: User already signed in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-background-darker border border-border-subtle rounded-lg overflow-hidden">
              <SignUp 
                path="/register" 
                routing="path" 
                signInUrl="/login"
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "bg-transparent shadow-none",
                    header: "text-text-primary",
                    footer: "text-text-secondary"
                  }
                }}
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
