import React, { useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Header, Footer } from '@common';
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
    <div className="min-h-screen flex flex-col bg-background-base">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-6">
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/register"
            appearance={{
              baseTheme: "light", // Explicitly set light theme
              layout: {
                logoPlacement: "inside",
                socialButtonsVariant: "iconButton",
              },
              elements: {
                rootBox: "mx-auto",
                card: "bg-white shadow-lg border border-gray-200",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-600",
                formFieldLabel: "text-gray-700",
                formFieldInput: "bg-white border-gray-300 text-gray-900",
                formButtonPrimary: "bg-brand-primary hover:bg-brand-primary/90",
                footerActionText: "text-gray-600",
                footerActionLink: "text-brand-primary hover:text-brand-secondary",
                dividerText: "text-gray-500",
                formFieldError: "text-red-500",
              },
            }}
            redirectUrl={from}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
