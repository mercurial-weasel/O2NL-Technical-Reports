import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartContainer } from '../../../../components/Dashboards/Common/ChartContainer/ChartContainer';

// Mock Plot component from react-plotly.js
vi.mock('react-plotly.js', () => ({
  default: ({ data, layout, config }: any) => (
    <div data-testid="mock-plot" data-data={JSON.stringify(data)} data-layout={JSON.stringify(layout)} data-config={JSON.stringify(config)} />
  )
}));

describe('ChartContainer', () => {
  const defaultProps = {
    data: [
      {
        type: 'scatter',
        x: [1, 2, 3],
        y: [4, 5, 6],
        name: 'Test Series'
      }
    ],
    layout: {
      title: 'Test Chart'
    }
  };

  it('renders chart with default props', () => {
    render(<ChartContainer {...defaultProps} />);
    const plot = screen.getByTestId('mock-plot');
    expect(plot).toBeInTheDocument();
  });

  it('applies default layout settings', () => {
    render(<ChartContainer {...defaultProps} />);
    const plot = screen.getByTestId('mock-plot');
    const layout = JSON.parse(plot.getAttribute('data-layout') || '{}');

    expect(layout).toMatchObject({
      height: 600,
      margin: { l: 60, r: 180, t: 60, b: 50 },
      showlegend: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#FFFFFF' }
    });
  });

  it('merges custom layout with defaults', () => {
    const customLayout = {
      title: 'Custom Title',
      height: 400
    };

    render(<ChartContainer {...defaultProps} layout={customLayout} />);
    const plot = screen.getByTestId('mock-plot');
    const layout = JSON.parse(plot.getAttribute('data-layout') || '{}');

    expect(layout.title).toBe('Custom Title');
    expect(layout.height).toBe(400);
    expect(layout.showlegend).toBe(true); // Default setting preserved
  });

  it('applies custom height', () => {
    render(<ChartContainer {...defaultProps} height={800} />);
    const plot = screen.getByTestId('mock-plot');
    const layout = JSON.parse(plot.getAttribute('data-layout') || '{}');

    expect(layout.height).toBe(800);
  });

  it('configures plot options correctly', () => {
    render(<ChartContainer {...defaultProps} />);
    const plot = screen.getByTestId('mock-plot');
    const config = JSON.parse(plot.getAttribute('data-config') || '{}');

    expect(config).toMatchObject({
      displayModeBar: true,
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: [
        'select2d',
        'lasso2d',
        'autoScale2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian'
      ]
    });
  });

  it('handles title prop correctly', () => {
    render(<ChartContainer {...defaultProps} title="Test Title" />);
    const plot = screen.getByTestId('mock-plot');
    const layout = JSON.parse(plot.getAttribute('data-layout') || '{}');

    expect(layout.title).toMatchObject({
      text: 'Test Title',
      font: { color: '#FFFFFF', size: 16 }
    });
  });
});