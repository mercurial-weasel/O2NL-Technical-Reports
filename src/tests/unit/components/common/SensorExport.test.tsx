import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SensorExport } from '../../../../components/Dashboards/Common/SensorExport/SensorExport';

describe('SensorExport', () => {
  const defaultProps = {
    onExport: vi.fn(),
    loading: false
  };

  it('renders correctly with default props', () => {
    render(<SensorExport {...defaultProps} />);
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onExport when clicked', () => {
    render(<SensorExport {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onExport).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<SensorExport {...defaultProps} loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('disables button during loading', () => {
    render(<SensorExport {...defaultProps} loading={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('includes download icon', () => {
    render(<SensorExport {...defaultProps} />);
    expect(screen.getByTestId('download')).toBeInTheDocument();
  });

  it('applies correct button styles', () => {
    render(<SensorExport {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-gradient-to-b',
      'from-brand-secondary',
      'text-text-primary',
      'font-medium',
      'rounded-lg'
    );
  });

  it('maintains icon visibility during loading state', () => {
    const { rerender } = render(<SensorExport {...defaultProps} />);
    expect(screen.getByTestId('download')).toBeVisible();

    rerender(<SensorExport {...defaultProps} loading={true} />);
    expect(screen.queryByTestId('download')).not.toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeVisible();
  });
});