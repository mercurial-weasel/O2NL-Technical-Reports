import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplianceIndicator } from '../../../../components/Dashboards/Common/ComplianceIndicator/ComplianceIndicator';

describe('ComplianceIndicator', () => {
  it('renders correctly with default size', () => {
    render(<ComplianceIndicator status="Compliant" />);
    const indicator = screen.getByTestId('compliance-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('px-2', 'py-1', 'text-xs');
  });

  it('applies correct color classes for different statuses', () => {
    const { rerender } = render(<ComplianceIndicator status="Compliant" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('bg-green-500/20', 'text-green-400');

    rerender(<ComplianceIndicator status="Warning" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('bg-yellow-500/20', 'text-yellow-400');

    rerender(<ComplianceIndicator status="Non-Compliant" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('bg-red-500/20', 'text-red-400');

    rerender(<ComplianceIndicator status="Under Review" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('bg-blue-500/20', 'text-blue-400');
  });

  it('handles different sizes correctly', () => {
    const { rerender } = render(<ComplianceIndicator status="Compliant" size="sm" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('px-1.5', 'py-0.5', 'text-xs');

    rerender(<ComplianceIndicator status="Compliant" size="md" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('px-2', 'py-1', 'text-xs');

    rerender(<ComplianceIndicator status="Compliant" size="lg" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('applies default color for unknown status', () => {
    render(<ComplianceIndicator status="Unknown Status" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('bg-gray-500/20', 'text-gray-400');
  });

  it('maintains consistent base classes', () => {
    render(<ComplianceIndicator status="Compliant" />);
    const indicator = screen.getByTestId('compliance-indicator');
    expect(indicator).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'font-medium'
    );
  });

  it('handles empty status gracefully', () => {
    render(<ComplianceIndicator status="" />);
    const indicator = screen.getByTestId('compliance-indicator');
    expect(indicator).toHaveClass('bg-gray-500/20', 'text-gray-400');
    expect(indicator).toHaveTextContent('Unknown');
  });

  it('handles case-insensitive status matching', () => {
    render(<ComplianceIndicator status="compliant" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveClass('bg-green-500/20', 'text-green-400');
  });

  it('provides appropriate ARIA label', () => {
    render(<ComplianceIndicator status="Compliant" />);
    expect(screen.getByTestId('compliance-indicator')).toHaveAttribute('aria-label', 'Compliance status: compliant');
  });
});