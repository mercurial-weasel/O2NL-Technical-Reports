import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { SensorStats } from '../../../../components/Dashboards/Common/SensorStats/SensorStats';

describe('SensorStats', () => {
  const defaultProps = {
    title: 'Sensor Statistics',
    stats: [
      {
        label: 'Average Reading',
        value: 25.5,
        unit: 'µg/m³',
        change: 2.3,
        status: 'positive' as const
      },
      {
        label: 'Maximum Reading',
        value: 45.2,
        unit: 'µg/m³',
        change: -1.5,
        status: 'negative' as const
      }
    ]
  };

  it('renders correctly with default props', () => {
    render(<SensorStats {...defaultProps} />);
    expect(screen.getByText('Sensor Statistics')).toBeInTheDocument();
    expect(screen.getByText('Average Reading')).toBeInTheDocument();
    expect(screen.getByText('Maximum Reading')).toBeInTheDocument();
  });

  it('displays values and units correctly', () => {
    render(<SensorStats {...defaultProps} />);
    
    defaultProps.stats.forEach(stat => {
      const statContainer = screen.getByText(stat.label).closest('li');
      expect(statContainer).toBeInTheDocument();
      
      if (statContainer) {
        const valueElement = within(statContainer).getByText(stat.value.toString());
        expect(valueElement).toBeInTheDocument();
        
        if (stat.unit) {
          const unitElement = within(statContainer).getByText(stat.unit);
          expect(unitElement).toBeInTheDocument();
        }
      }
    });
  });

  it('shows change percentages with correct colors', () => {
    render(<SensorStats {...defaultProps} />);
    
    // Check for positive change
    const positiveChange = screen.getByText('+2.3%');
    expect(positiveChange).toHaveClass('text-green-400');
    
    // Check for negative change
    const negativeChange = screen.getByText('-1.5%');
    expect(negativeChange).toHaveClass('text-red-400');
  });

  it('handles stats without changes', () => {
    const props = {
      title: 'Basic Stats',
      stats: [
        {
          label: 'Reading',
          value: 25.5,
          unit: 'units'
        }
      ]
    };

    render(<SensorStats {...props} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('handles stats without units', () => {
    const props = {
      title: 'Count Stats',
      stats: [
        {
          label: 'Total Readings',
          value: 1234
        }
      ]
    };

    render(<SensorStats {...props} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    render(<SensorStats {...defaultProps} />);
    
    const title = screen.getByText('Sensor Statistics');
    expect(title).toHaveClass('text-lg', 'font-medium', 'text-text-primary', 'mb-4');
    
    const grid = screen.getByRole('list');
    expect(grid).toHaveClass('grid', 'grid-cols-2', 'gap-4');
  });

  it('handles neutral status correctly', () => {
    const props = {
      title: 'Stats',
      stats: [
        {
          label: 'Reading',
          value: 25.5,
          change: 0,
          status: 'neutral' as const
        }
      ]
    };

    render(<SensorStats {...props} />);
    const change = screen.getByText('0%');
    expect(change).toHaveClass('text-text-secondary');
  });

  it('handles empty stats array', () => {
    render(<SensorStats title="Empty Stats" stats={[]} />);
    expect(screen.getByText('Empty Stats')).toBeInTheDocument();
  });
});