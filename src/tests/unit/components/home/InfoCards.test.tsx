import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoCards } from '../../../../components/home/components/InfoCards';

describe('InfoCards', () => {
  const defaultProps = {
    onGeotechnicalClick: vi.fn(),
    onEnvironmentalClick: vi.fn(),
    onProjectControlsClick: vi.fn()
  };

  it('renders all cards', () => {
    render(<InfoCards {...defaultProps} />);
    expect(screen.getByText('Project Controls')).toBeInTheDocument();
    expect(screen.getByText('Geotechnical')).toBeInTheDocument();
    expect(screen.getByText('Environmental')).toBeInTheDocument();
  });

  it('triggers click handlers', () => {
    render(<InfoCards {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Project Controls'));
    expect(defaultProps.onProjectControlsClick).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Geotechnical'));
    expect(defaultProps.onGeotechnicalClick).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Environmental'));
    expect(defaultProps.onEnvironmentalClick).toHaveBeenCalled();
  });

  it('applies grid layout', () => {
    render(<InfoCards {...defaultProps} />);
    const grid = screen.getByRole('region').firstChild;
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-3',
      'gap-6'
    );
  });

  it('maintains consistent card spacing', () => {
    render(<InfoCards {...defaultProps} />);
    const cards = screen.getAllByRole('button');
    expect(cards).toHaveLength(3);
    cards.forEach(card => {
      expect(card.closest('div')).toHaveClass('gap-6');
    });
  });
});