import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusLegend } from '../../../../components/Dashboards/Common/StatusLegend/StatusLegend';

describe('StatusLegend', () => {
  const defaultProps = {
    title: 'Air Quality Index',
    levels: [
      { range: '0-50', label: 'Good', color: '#10B981' },
      { range: '51-100', label: 'Moderate', color: '#F59E0B' },
      { range: '101-150', label: 'Unhealthy', color: '#EF4444' }
    ]
  };

  it('renders correctly with default props', () => {
    render(<StatusLegend {...defaultProps} />);
    expect(screen.getByText('Air Quality Index')).toBeInTheDocument();
    defaultProps.levels.forEach(level => {
      expect(screen.getByText(level.label)).toBeInTheDocument();
      expect(screen.getByText(level.range)).toBeInTheDocument();
    });
  });

  it('applies correct colors to level indicators', () => {
    render(<StatusLegend {...defaultProps} />);
    
    defaultProps.levels.forEach(level => {
      const indicator = screen.getByText(level.label)
        .parentElement
        ?.parentElement
        ?.querySelector('.w-4.h-4');
      expect(indicator).toHaveStyle({
        backgroundColor: `${level.color}40`
      });
    });
  });

  it('applies correct container styles', () => {
    render(<StatusLegend {...defaultProps} />);
    const container = screen.getByText('Air Quality Index').closest('div');
    expect(container).toHaveClass(
      'bg-gray-800/50',
      'border',
      'border-gray-700',
      'rounded-lg',
      'p-4'
    );
  });

  it('applies correct text styles', () => {
    render(<StatusLegend {...defaultProps} />);
    
    const title = screen.getByText('Air Quality Index');
    expect(title).toHaveClass('text-sm', 'font-medium', 'text-text-secondary', 'mb-4');
    
    defaultProps.levels.forEach(level => {
      const label = screen.getByText(level.label);
      expect(label).toHaveClass('text-text-primary');
      
      const range = screen.getByText(level.range);
      expect(range).toHaveClass('text-text-secondary');
    });
  });

  it('handles empty levels array', () => {
    render(<StatusLegend title="Empty Legend" levels={[]} />);
    expect(screen.getByText('Empty Legend')).toBeInTheDocument();
    const container = screen.getByText('Empty Legend').parentElement;
    expect(container?.children[1].children.length).toBe(0);
  });

  it('maintains correct spacing between levels', () => {
    render(<StatusLegend {...defaultProps} />);
    const levelsContainer = screen.getByText('Air Quality Index').parentElement?.children[1];
    expect(levelsContainer).toHaveClass('space-y-4');
  });

  it('handles long labels and ranges', () => {
    const props = {
      title: 'Complex Legend',
      levels: [
        {
          range: 'Very Low Range (0-10)',
          label: 'Extremely Good Conditions',
          color: '#10B981'
        }
      ]
    };

    render(<StatusLegend {...props} />);
    expect(screen.getByText('Extremely Good Conditions')).toBeInTheDocument();
    expect(screen.getByText('Very Low Range (0-10)')).toBeInTheDocument();
  });

  it('handles missing colors gracefully', () => {
    const props = {
      title: 'Basic Legend',
      levels: [
        { range: '1-5', label: 'Level 1', color: '' }
      ]
    };

    render(<StatusLegend {...props} />);
    const indicator = screen.getByText('Level 1')
      .parentElement
      ?.parentElement
      ?.querySelector('.w-4.h-4');
    expect(indicator).toBeInTheDocument();
  });

  it('maintains consistent layout for varying number of levels', () => {
    const { rerender } = render(<StatusLegend {...defaultProps} />);
    let levelsContainer = screen.getByText('Air Quality Index').parentElement?.children[1];
    expect(levelsContainer?.children.length).toBe(3);

    const singleLevel = {
      title: 'Single Level',
      levels: [defaultProps.levels[0]]
    };

    rerender(<StatusLegend {...singleLevel} />);
    levelsContainer = screen.getByText('Single Level').parentElement?.children[1];
    expect(levelsContainer?.children.length).toBe(1);
    expect(levelsContainer).toHaveClass('space-y-4');
  });
});