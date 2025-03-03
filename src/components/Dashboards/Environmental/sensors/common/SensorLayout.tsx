import React from 'react';
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { BackNavigation } from '../../../../common/BackNavigation';

interface SensorLayoutProps {
  children: React.ReactNode;
  backLink: string;
  backText: string;
}

export function SensorLayout({ children, backLink, backText }: SensorLayoutProps) {
  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to={backLink} text={backText} />
          {children}
        </Section>
      </div>
      <Footer />
    </div>
  );
}