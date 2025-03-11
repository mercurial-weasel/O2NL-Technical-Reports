import React from 'react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer, Section } from '@common';
import { useEffect } from 'react';

const LoginPage: React.FC = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  useEffect(() => {
    // Redirect if already signed in
    if (isLoaded && isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, from]);
  
  const handleLoginClick = () => {
    openSignIn({
      redirectUrl: from,
      appearance: {
        baseTheme: 'light',
        elements: {
          rootBox: "mx-auto",
          card: "bg-white shadow-md",
          header: "text-gray-800",
          footer: "text-gray-600",
          formButtonPrimary: "bg-brand-primary hover:bg-brand-primary/90",
          formFieldInput: "border-gray-300 text-gray-800",
          formFieldLabel: "text-gray-700",
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500"
        },
        layout: {
          shimmer: false,
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          showOptionalFields: true
        }
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-background-darker border border-border-subtle rounded-lg p-10 shadow-md">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Welcome Back</h2>
              <p className="text-text-secondary mb-8">
                Sign in to access your dashboard and project data
              </p>
              <button
                onClick={handleLoginClick}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-6 rounded-md w-full transition-colors text-lg"
              >
                Sign In
              </button>
              <p className="mt-6 text-sm text-text-secondary">
                Don't have an account?{' '}
                <a href="/register" className="text-brand-primary hover:underline">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
