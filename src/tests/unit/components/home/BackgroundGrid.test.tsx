import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BackgroundGrid } from '../../../../components/home/components/BackgroundGrid';

describe('BackgroundGrid', () => {
  it('renders grid container', () => {
    render(<BackgroundGrid />);
    const container = screen.getByRole('presentation');
    expect(container).toHaveClass('absolute', 'inset-0');
  });

  it('renders SVG with correct attributes', () => {
    render(<BackgroundGrid />);
    const svg = screen.getByRole('presentation').querySelector('svg');
    expect(svg).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full');
  });

  it('contains pattern definition', () => {
    render(<BackgroundGrid />);
    const pattern = screen.getByRole('presentation').querySelector('pattern');
    expect(pattern).toHaveAttribute('id', 'grid');
    expect(pattern).toHaveAttribute('width', '40');
    expect(pattern).toHaveAttribute('height', '40');
    expect(pattern).toHaveAttribute('patternUnits', 'userSpaceOnUse');
  });

  it('contains grid path with correct attributes', () => {
    render(<BackgroundGrid />);
    const path = screen.getByRole('presentation').querySelector('path');
    expect(path).toHaveAttribute('d', 'M 40 0 L 0 0 0 40');
    expect(path).toHaveAttribute('fill', 'none');
    expect(path).toHaveAttribute('stroke', 'currentColor');
    expect(path).toHaveAttribute('strokeWidth', '0.5');
    expect(path).toHaveClass('text-border-primary/20');
  });

  it('applies pattern to rectangle', () => {
    render(<BackgroundGrid />);
    const rect = screen.getByRole('presentation').querySelector('rect');
    expect(rect).toHaveAttribute('width', '100%');
    expect(rect).toHaveAttribute('height', '100%');
    expect(rect).toHaveAttribute('fill', 'url(#grid)');
  });
});