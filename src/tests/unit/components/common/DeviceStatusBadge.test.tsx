import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeviceStatusBadge } from '../../../../components/Dashboards/Common/DeviceStatusBadge/DeviceStatusBadge';

describe('DeviceStatusBadge', () => {
  it('renders correctly with default size', () => {
    render(<DeviceStatusBadge status="active" />);
    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('w-3', 'h-3');
  });

  it('applies correct colors for different statuses', () => {
    const { rerender } = render(<DeviceStatusBadge status="active" />);
    expect(screen.getByRole('status')).toHaveClass('bg-green-500');

    rerender(<DeviceStatusBadge status="maintenance" />);
    expect(screen.getByRole('status')).toHaveClass('bg-yellow-500');

    rerender(<DeviceStatusBadge status="fault" />);
    expect(screen.getByRole('status')).toHaveClass('bg-red-500');

    rerender(<DeviceStatusBadge status="offline" />);
    expect(screen.getByRole('status')).toHaveClass('bg-gray-500');
  });

  it('handles different sizes correctly', () => {
    const { rerender } = render(<DeviceStatusBadge status="active" size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('w-2', 'h-2');

    rerender(<DeviceStatusBadge status="active" size="md" />);
    expect(screen.getByRole('status')).toHaveClass('w-3', 'h-3');

    rerender(<DeviceStatusBadge status="active" size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4');
  });

  it('applies default color for unknown status', () => {
    render(<DeviceStatusBadge status="unknown" />);
    expect(screen.getByRole('status')).toHaveClass('bg-blue-500');
  });

  it('maintains consistent base classes', () => {
    render(<DeviceStatusBadge status="active" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('rounded-full', 'animate-pulse');
  });

  it('handles case-insensitive status matching', () => {
    render(<DeviceStatusBadge status="ACTIVE" />);
    expect(screen.getByRole('status')).toHaveClass('bg-green-500');
  });

  it('handles empty status gracefully', () => {
    render(<DeviceStatusBadge status="" />);
    expect(screen.getByRole('status')).toHaveClass('bg-blue-500');
  });

  it('provides appropriate ARIA label', () => {
    render(<DeviceStatusBadge status="active" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Device status: active');
  });
});