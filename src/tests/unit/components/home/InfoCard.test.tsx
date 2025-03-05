import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoCard } from '../../../../components/home/components/InfoCard';
import { LayoutDashboard } from 'lucide-react';

describe('InfoCard', () => {
  const defaultProps = {
    id: 'test-card',
    title: 'Test Card',
    description: 'Test description',
    icon: LayoutDashboard,
    color: '#6CC24A',
    enabled: true
  };

  it('renders card content correctly', () => {
    render(<InfoCard {...defaultProps} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('View Dashboards')).toBeInTheDocument();
  });

  it('handles click events when enabled', () => {
    const onClick = vi.fn();
    render(<InfoCard {...defaultProps} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('displays coming soon state', () => {
    render(<InfoCard {...defaultProps} comingSoon={true} />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.queryByText('View Dashboards')).not.toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<InfoCard {...defaultProps} enabled={false} />);
    const card = screen.getByText('Test Card').closest('div');
    expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies hover effects when enabled', () => {
    render(<InfoCard {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('group');
    expect(button.querySelector('.group-hover\\:opacity-100')).toBeInTheDocument();
  });

  it('displays icon with correct styles', () => {
    render(<InfoCard {...defaultProps} />);
    const iconContainer = screen.getByRole('button').querySelector('.p-2\\.5');
    expect(iconContainer).toHaveClass(
      'rounded-lg',
      'bg-brand-primary/5',
      'group-hover:bg-brand-primary/10'
    );
  });

  it('shows not available state when disabled', () => {
    render(<InfoCard {...defaultProps} enabled={false} />);
    expect(screen.getByText('Not Available')).toBeInTheDocument();
  });

  it('applies focus styles for accessibility', () => {
    render(<InfoCard {...defaultProps} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-brand-primary',
      'focus:ring-offset-2',
      'focus:ring-offset-background-base'
    );
  });
});