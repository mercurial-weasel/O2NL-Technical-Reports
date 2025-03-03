import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ChartLegend } from '../../../../components/Dashboards/Common/ChartLegend/ChartLegend';

describe('ChartLegend', () => {
  const defaultProps = {
    title: 'Test Legend',
    items: [
      { label: 'Series A', value: 45, color: '#6CC24A', unit: '%' },
      { label: 'Series B', value: 30, color: '#0077FF', unit: '%' }
    ]
  };

  it('renders correctly with default props', () => {
    render(<ChartLegend {...defaultProps} />);
    expect(screen.getByText('Test Legend')).toBeInTheDocument();
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('Series B')).toBeInTheDocument();
  });

  it('displays values and units correctly', () => {
    render(<ChartLegend {...defaultProps} />);
    defaultProps.items.forEach(item => {
      const valueContainer = screen.getByText(item.label).closest('.flex')?.querySelector('.text-text-secondary');
      expect(valueContainer).toHaveTextContent(`${item.value}${item.unit}`);
    });
  });

  it('renders color indicators when provided', () => {
    render(<ChartLegend {...defaultProps} />);
    const colorIndicators = screen.getAllByRole('presentation');
    expect(colorIndicators).toHaveLength(defaultProps.items.length);
    
    colorIndicators.forEach((indicator, index) => {
      expect(indicator).toHaveStyle({
        backgroundColor: `${defaultProps.items[index].color}40`
      });
    });
  });

  it('handles items without units', () => {
    const props = {
      title: 'Test Legend',
      items: [
        { label: 'Item A', value: 100 },
        { label: 'Item B', value: 200 }
      ]
    };

    render(<ChartLegend {...props} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('handles items without colors', () => {
    const props = {
      title: 'Test Legend',
      items: [
        { label: 'Item A', value: 100, unit: 'units' },
        { label: 'Item B', value: 200, unit: 'units' }
      ]
    };

    render(<ChartLegend {...props} />);
    const colorIndicators = screen.queryAllByRole('presentation');
    expect(colorIndicators).toHaveLength(0);
  });

  it('applies correct styles', () => {
    render(<ChartLegend {...defaultProps} />);
    
    const container = screen.getByRole('region');
    expect(container).toHaveClass(
      'bg-gray-800/50',
      'border',
      'border-gray-700',
      'rounded-lg',
      'p-4'
    );

    const title = screen.getByText('Test Legend');
    expect(title).toHaveClass('text-sm', 'font-medium', 'text-text-secondary', 'mb-4');
  });

  it('handles empty items array', () => {
    render(<ChartLegend title="Empty Legend" items={[]} />);
    expect(screen.getByText('Empty Legend')).toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('provides proper ARIA labeling', () => {
    render(<ChartLegend {...defaultProps} />);
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'Test Legend');
  });
});