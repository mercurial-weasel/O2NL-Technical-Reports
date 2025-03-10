import React from 'react';
import { Container } from '@common/Container/Container';

interface SectionProps {
  children?: React.ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <section 
      data-testid="section"
      className={className}
      role="region"
      aria-label="Content Section"
    >
      <Container>
        {children}
      </Container>
    </section>
  );
}