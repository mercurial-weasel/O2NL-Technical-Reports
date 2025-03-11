import React from 'react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Section } from '@common';
import { useEffect } from 'react';

const RegisterPage: React.FC = () => {
  const { openSignUp } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already signed in
    if (isLoaded && isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  const handleRegisterClick = () => {
    openSignUp({
      redirectUrl: '/dashboard',
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
              <h2 className="text-2xl font-bold text-text-primary mb-6">Create Account</h2>
              <p className="text-text-secondary mb-8">
                Register to get access to project dashboards and data
              </p>
              <button
                onClick={handleRegisterClick}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-6 rounded-md w-full transition-colors text-lg"
              >
                Register Now
              </button>
              <p className="mt-6 text-sm text-text-secondary">
                Already have an account?{' '}
                <a href="/login" className="text-brand-primary hover:underline">
                  Sign in here
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

export default RegisterPage;
