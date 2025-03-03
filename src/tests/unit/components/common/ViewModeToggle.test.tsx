import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewModeToggle } from '../../../../components/Dashboards/Common/ViewModeToggle';

describe('ViewModeToggle', () => {
  const defaultProps = {
    mode: 'chart' as const,
    onChange: vi.fn()
  };

  it('renders all view mode options', () => {
    render(<ViewModeToggle {...defaultProps} />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Chart')).toBeInTheDocument();
    expect(screen.getByText('Table')).toBeInTheDocument();
  });

  it('highlights active mode', () => {
    render(<ViewModeToggle {...defaultProps} />);
    const chartButton = screen.getByText('Chart').closest('button');
    expect(chartButton).toHaveClass('bg-brand-primary', 'text-white');
  });

  it('calls onChange when mode is selected', () => {
    render(<ViewModeToggle {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Table'));
    expect(defaultProps.onChange).toHaveBeenCalledWith('table');
  });

  it('applies correct styles to inactive modes', () => {
    render(<ViewModeToggle {...defaultProps} />);
    
    const tableButton = screen.getByText('Table').closest('button');
    expect(tableButton).toHaveClass('text-text-secondary', 'hover:text-text-primary');
  });
});