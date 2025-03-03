import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../../../../components/Dashboards/Common/MetricCard/MetricCard';
import { Thermometer } from 'lucide-react';

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Temperature',
    value: 25.5,
    unit: '°C',
    icon: <Thermometer className="w-5 h-5 text-brand-primary" />
  };

  it('renders correctly with default props', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25.5°C')).toBeInTheDocument();
  });

  it('displays change indicator when provided', () => {
    render(<MetricCard {...defaultProps} change={2.5} />);
    expect(screen.getByText('2.5%')).toBeInTheDocument();
    expect(screen.getByText('2.5%').parentElement).toHaveClass('text-green-400');
  });

  it('handles negative change values', () => {
    render(<MetricCard {...defaultProps} change={-1.5} />);
    expect(screen.getByText('1.5%')).toBeInTheDocument();
    expect(screen.getByText('1.5%').parentElement).toHaveClass('text-red-400');
  });

  it('applies threshold-based colors', () => {
    const { rerender } = render(
      <MetricCard 
        {...defaultProps} 
        value={20}
        threshold={{ warning: 25, critical: 30 }}
      />
    );
    expect(screen.getByText('20.0°C')).toHaveClass('text-green-400');

    rerender(
      <MetricCard 
        {...defaultProps} 
        value={27}
        threshold={{ warning: 25, critical: 30 }}
      />
    );
    expect(screen.getByText('27.0°C')).toHaveClass('text-yellow-400');

    rerender(
      <MetricCard 
        {...defaultProps} 
        value={32}
        threshold={{ warning: 25, critical: 30 }}
      />
    );
    expect(screen.getByText('32.0°C')).toHaveClass('text-red-400');
  });

  it('renders icon when provided', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
  });

  it('formats value with one decimal place', () => {
    render(<MetricCard {...defaultProps} value={25.567} />);
    expect(screen.getByText('25.6°C')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByTestId('card-content')).toHaveClass(
      'p-4',
      'relative',
      'bg-gradient-to-br',
      'from-background-card-from',
      'to-background-card-to'
    );
  });

  it('handles zero change value', () => {
    render(<MetricCard {...defaultProps} change={0} />);
    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByText('0.0%').parentElement).toHaveClass('text-text-secondary');
  });

  it('handles missing change value', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });
});