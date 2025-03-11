import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Header, Footer, Section } from '@common';

export function LoginPage() {
  console.log('Rendering Clerk login page');
  
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
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "bg-transparent shadow-none",
                    header: "text-text-primary",
                    footer: "text-text-secondary"
                  },
                  layout: {
                    shimmer: false,
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "iconButton",
                    showOptionalFields: true
                  }
                }}
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
                signInMode="popup"
              />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}