import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeSelector } from '../../../../components/Dashboards/Common/DateRangeSelector';

describe('DateRangeSelector', () => {
  const defaultProps = {
    dateRange: [null, null] as [Date | null, Date | null],
    onChange: vi.fn()
  };

  it('renders correctly with default props', () => {
    render(<DateRangeSelector {...defaultProps} />);
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('displays placeholder text when no dates selected', () => {
    render(<DateRangeSelector {...defaultProps} />);
    const [startInput, endInput] = screen.getAllByRole('textbox');
    expect(startInput).toHaveAttribute('placeholder', 'Start Date');
    expect(endInput).toHaveAttribute('placeholder', 'End Date');
  });

  it('displays selected dates correctly', () => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 11, 31);
    render(
      <DateRangeSelector
        dateRange={[startDate, endDate]}
        onChange={defaultProps.onChange}
      />
    );
    
    const [startInput, endInput] = screen.getAllByRole('textbox');
    expect(startInput).toHaveValue('01/01/2025');
    expect(endInput).toHaveValue('12/31/2025');
  });

  it('calls onChange when dates are selected', () => {
    render(<DateRangeSelector {...defaultProps} />);
    
    const [startInput] = screen.getAllByRole('textbox');
    fireEvent.change(startInput, { target: { value: '01/01/2025' } });
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('applies correct styles', () => {
    render(<DateRangeSelector {...defaultProps} />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveClass(
        'bg-gray-800/50',
        'border',
        'border-gray-700',
        'rounded-lg',
        'px-4',
        'py-2',
        'text-sm',
        'text-text-primary'
      );
    });
  });
});