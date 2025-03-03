import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SensorThresholds } from '../../../../components/Dashboards/Common/SensorThresholds/SensorThresholds';

describe('SensorThresholds', () => {
  const defaultProps = {
    title: 'Air Quality Thresholds',
    thresholds: [
      { label: 'Good', value: 50, unit: 'µg/m³', color: '#10B981' },
      { label: 'Moderate', value: 100, unit: 'µg/m³', color: '#F59E0B' },
      { label: 'Unhealthy', value: 150, unit: 'µg/m³', color: '#EF4444' }
    ]
  };

  it('renders correctly with default props', () => {
    render(<SensorThresholds {...defaultProps} />);
    expect(screen.getByText('Air Quality Thresholds')).toBeInTheDocument();
    defaultProps.thresholds.forEach(threshold => {
      expect(screen.getByText(threshold.label)).toBeInTheDocument();
      expect(screen.getByText(`${threshold.value} ${threshold.unit}`)).toBeInTheDocument();
    });
  });

  it('applies correct colors to threshold indicators', () => {
    render(<SensorThresholds {...defaultProps} />);
    
    defaultProps.thresholds.forEach((threshold, index) => {
      const indicator = screen.getByTestId(`threshold-indicator-${index}`);
      expect(indicator).toHaveStyle({ backgroundColor: threshold.color });
    });
  });

  it('applies correct container styles', () => {
    render(<SensorThresholds {...defaultProps} />);
    const container = screen.getByTestId('thresholds-container');
    expect(container).toHaveClass(
      'bg-gray-800/50',
      'border',
      'border-gray-700',
      'rounded-lg',
      'p-4'
    );
  });

  it('maintains proper list structure', () => {
    render(<SensorThresholds {...defaultProps} />);
    const list = screen.getByTestId('thresholds-list');
    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('space-y-3');
    expect(list.children).toHaveLength(defaultProps.thresholds.length);
  });

  it('provides proper ARIA attributes', () => {
    render(<SensorThresholds {...defaultProps} />);
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'Air Quality Thresholds');
  });

  it('handles empty thresholds array', () => {
    render(<SensorThresholds title="Empty Thresholds" thresholds={[]} />);
    expect(screen.getByText('Empty Thresholds')).toBeInTheDocument();
    expect(screen.getByTestId('thresholds-list').children).toHaveLength(0);
  });

  it('applies correct text styles', () => {
    render(<SensorThresholds {...defaultProps} />);
    
    const title = screen.getByText('Air Quality Thresholds');
    expect(title).toHaveClass('text-sm', 'font-medium', 'text-text-secondary', 'mb-4');
    
    const labels = screen.getAllByText(/Good|Moderate|Unhealthy/);
    labels.forEach(label => {
      expect(label).toHaveClass('text-sm', 'text-text-primary');
    });
    
    const values = screen.getAllByText(/\d+ µg\/m³/);
    values.forEach(value => {
      expect(value).toHaveClass('text-sm', 'text-text-secondary');
    });
  });
});