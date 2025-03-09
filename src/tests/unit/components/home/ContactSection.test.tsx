import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactSection } from '../../../../components/home/components/ContactSection';

describe('ContactSection', () => {
  it('renders section title', () => {
    render(<ContactSection />);
    expect(screen.getByText('Contact & Resources')).toBeInTheDocument();
  });

  it('renders all contact links', () => {
    render(<ContactSection />);
    expect(screen.getByText('support@o2nl.nz')).toBeInTheDocument();
    expect(screen.getByText('O2NL Alliance Hub')).toBeInTheDocument();
  });

  it('applies correct link attributes', () => {
    render(<ContactSection />);
    const externalLink = screen.getByText('O2NL Alliance Hub').closest('a');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('includes icons for links', () => {
    render(<ContactSection />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('applies hover effects to links', () => {
    render(<ContactSection />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass(
        'text-text-secondary',
        'hover:text-brand-primary',
        'transition-colors',
        'group'
      );
    });
  });

  it('displays support text', () => {
    render(<ContactSection />);
    expect(screen.getByText(/For technical support or access to additional resources/)).toBeInTheDocument();
  });

  it('applies correct section styles', () => {
    render(<ContactSection />);
    const section = screen.getByRole('region');
    expect(section).toHaveClass('py-16', 'bg-background-darker');
  });

  it('maintains responsive layout', () => {
    render(<ContactSection />);
    const grid = screen.getByRole('region').querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'gap-8');
  });
});