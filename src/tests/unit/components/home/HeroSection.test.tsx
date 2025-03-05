import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../../../../components/home/components/HeroSection';

describe('HeroSection', () => {
  it('renders title and subtitle', () => {
    render(<HeroSection />);
    expect(screen.getByText('O2NL Technical Data')).toBeInTheDocument();
    expect(screen.getByText('Access and analyze O2NL project data')).toBeInTheDocument();
  });

  it('applies correct background classes', () => {
    render(<HeroSection />);
    const section = screen.getByRole('region');
    expect(section).toHaveClass(
      'relative',
      'bg-gradient-to-b',
      'from-background-base',
      'via-background-darker',
      'to-background-base',
      'py-12',
      'min-h-[300px]',
      'flex',
      'items-center',
      'overflow-hidden'
    );
  });

  it('includes background pattern image', () => {
    render(<HeroSection />);
    const pattern = screen.getByRole('region').querySelector('.bg-[url');
    expect(pattern).toHaveClass('opacity-10', 'mix-blend-overlay');
  });

  it('applies text styles correctly', () => {
    render(<HeroSection />);
    const title = screen.getByText('O2NL Technical Data');
    const subtitle = screen.getByText('Access and analyze O2NL project data');

    expect(title).toHaveClass('text-6xl', 'font-bold', 'text-text-primary', 'mb-4', 'drop-shadow-lg');
    expect(subtitle).toHaveClass('text-lg', 'text-text-secondary', 'drop-shadow-lg');
  });

  it('maintains proper z-index layering', () => {
    render(<HeroSection />);
    const contentOverlay = screen.getByRole('region').querySelector('.relative.z-10');
    expect(contentOverlay).toBeInTheDocument();
  });
});