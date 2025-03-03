import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackNavigation } from '../../../../components/common/BackNavigation';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate
  };
});

describe('BackNavigation', () => {
  it('renders correctly with default text', () => {
    render(
      <BrowserRouter>
        <BackNavigation to="/dashboard" />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(
      <BrowserRouter>
        <BackNavigation to="/dashboard" text="Back to Dashboard" />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('navigates to the correct path when clicked', () => {
    render(
      <BrowserRouter>
        <BackNavigation to="/dashboard" />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('applies correct styles', () => {
    render(
      <BrowserRouter>
        <BackNavigation to="/dashboard" />
      </BrowserRouter>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-text-secondary',
      'hover:text-brand-primary',
      'transition-colors',
      'mb-4'
    );
  });

  it('includes arrow icon', () => {
    render(
      <BrowserRouter>
        <BackNavigation to="/dashboard" />
      </BrowserRouter>
    );
    
    const icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-5', 'h-5');
  });
});