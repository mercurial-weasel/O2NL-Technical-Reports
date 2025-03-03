import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../../../components/common/Footer';

describe('Footer', () => {
  it('renders correctly', () => {
    render(<Footer />);
    expect(screen.getByText('O2NL Intelligence')).toBeInTheDocument();
    expect(screen.getByText(/© 2025 O2NL Alliance\. All rights reserved\./i)).toBeInTheDocument();
  });

  it('includes logo icon', () => {
    render(<Footer />);
    const logoIcon = screen.getByText('O2NL Intelligence').previousElementSibling;
    expect(logoIcon).toBeInTheDocument();
    expect(logoIcon?.tagName.toLowerCase()).toBe('svg');
    expect(logoIcon).toHaveClass('w-5', 'h-5', 'text-text-muted');
  });

  it('applies correct styles', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(
      'bg-background-darker',
      'border-t',
      'border-border-divider',
      'py-4'
    );
  });

  it('has correct layout structure', () => {
    render(<Footer />);
    const container = screen.getByRole('contentinfo').firstElementChild;
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
  });

  it('displays copyright text with correct styling', () => {
    render(<Footer />);
    const copyright = screen.getByText(/© 2025/);
    expect(copyright).toHaveClass('text-xs', 'text-text-muted');
  });
});