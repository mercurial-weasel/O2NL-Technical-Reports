import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../../../components/common/Header';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../lib/auth';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders logo and title', () => {
    renderHeader();
    expect(screen.getByText('O2NL Intelligence')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /o2nl intelligence/i })).toBeInTheDocument();
  });

  it('renders logo icon', () => {
    renderHeader();
    const logoIcon = screen.getByRole('link', { name: /o2nl intelligence/i }).querySelector('svg');
    expect(logoIcon).toBeInTheDocument();
    expect(logoIcon).toHaveClass('w-8', 'h-8');
  });

  it('applies correct styles to header container', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('shows loading state initially', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('loading-pulse')).toBeInTheDocument();
  });

  it('applies hover effects to logo', () => {
    renderHeader();
    const logoLink = screen.getByRole('link', { name: /o2nl intelligence/i });
    expect(logoLink).toHaveClass('group');
    expect(logoLink.querySelector('svg')).toHaveClass('transition-transform', 'duration-200', 'group-hover:scale-110');
  });
});