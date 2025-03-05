import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GradientOverlay } from '../../../../components/home/components/GradientOverlay';

describe('GradientOverlay', () => {
  it('renders with correct classes', () => {
    render(<GradientOverlay />);
    const overlay = screen.getByRole('presentation');
    expect(overlay).toHaveClass(
      'absolute',
      'inset-0',
      'bg-gradient-to-br',
      'from-border-primary/10',
      'to-background-base/10'
    );
  });

  it('maintains absolute positioning', () => {
    render(<GradientOverlay />);
    const overlay = screen.getByRole('presentation');
    expect(overlay).toHaveStyle({
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    });
  });
});