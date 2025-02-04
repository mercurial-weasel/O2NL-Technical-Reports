import React from 'react';
import Plot from 'react-plotly.js';
import { Card } from '../../../common/Card';
import { MilestoneTask } from './types';

interface TimelineProps {
  filteredTasks: MilestoneTask[];
}

export function Timeline({ filteredTasks }: TimelineProps) {
  // Professional color palette with full and faded variants
  const categoryColors = {
    Marketing: {
      full: '#E63946',
      faded: '#F8A5AC'
    },
    Finance: {
      full: '#F4A261',
      faded: '#FBDCC0'
    },
    Engineering: {
      full: '#2A9D8F',
      faded: '#A4D5CA'
    },
    Production: {
      full: '#457B9D',
      faded: '#A5C3D7'
    },
    IT: {
      full: '#264653',
      faded: '#8BA6B0'
    }
  };

  // Find earliest start date and latest end date
  const dateRange = filteredTasks.reduce((acc, task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    
    return {
      start: acc.start ? (startDate < acc.start ? startDate : acc.start) : startDate,
      end: acc.end ? (endDate > acc.end ? endDate : acc.end) : endDate
    };
  }, { start: null as Date | null, end: null as Date | null });

  // Create traces for tasks and milestones
  const traces = filteredTasks.flatMap((task, index) => {
    const today = new Date();
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const category = task.category as keyof typeof categoryColors;

    // Common hover text
    const hoverText = `
      ${task.name}<br>
      Start: ${startDate.toLocaleDateString()}<br>
      End: ${endDate.toLocaleDateString()}<br>
      Completion: ${task.completion}%<br>
      Department: ${task.category}<br>
      Owner: ${task.owner}
    `;

    // Base trace properties
    const baseTrace = {
      type: 'bar' as const,
      y: [task.name],
      orientation: 'h' as const,
      text: [`${task.completion}%`],
      textposition: 'outside' as const,
      textfont: { color: '#FFFFFF', size: 10 },
      hoverinfo: 'text' as const,
      hovertext: hoverText,
      name: task.category,
      showlegend: index === filteredTasks.findIndex(t => t.category === task.category),
      width: 0.3, // Reduce bar height
    };

    const traces = [];

    // Past/current portion (full color)
    if (startDate < today) {
      const pastEndDate = endDate < today ? endDate : today;
      traces.push({
        ...baseTrace,
        x: [pastEndDate.getTime() - startDate.getTime()],
        base: [startDate.getTime()],
        marker: { color: categoryColors[category].full },
        showlegend: baseTrace.showlegend,
      });
    }

    // Future portion (faded color)
    if (endDate > today) {
      const futureStartDate = startDate > today ? startDate : today;
      traces.push({
        ...baseTrace,
        x: [endDate.getTime() - futureStartDate.getTime()],
        base: [futureStartDate.getTime()],
        marker: { color: categoryColors[category].faded },
        showlegend: false,
        text: [''],
      });
    }

    // Add milestone diamonds
    if (task.milestones) {
      traces.push({
        type: 'scatter' as const,
        x: task.milestones.map(m => new Date(m.date).getTime()),
        y: task.milestones.map(() => task.name),
        mode: 'markers',
        marker: {
          symbol: 'diamond',
          size: 12,
          color: '#000000', // Black diamonds for milestones
          line: {
            color: '#FFFFFF',
            width: 1
          }
        },
        name: 'Milestones',
        showlegend: false,
        hoverinfo: 'text' as const,
        hovertext: task.milestones.map(m => `
          Milestone: ${m.name}<br>
          Date: ${new Date(m.date).toLocaleDateString()}<br>
          Status: ${m.status}<br>
          ${m.description}
        `),
      });
    }

    return traces;
  });

  // Add padding to date range (1 week on each side)
  const rangeStart = new Date(dateRange.start!);
  const rangeEnd = new Date(dateRange.end!);
  rangeStart.setDate(rangeStart.getDate() - 7);
  rangeEnd.setDate(rangeEnd.getDate() + 7);

  const layout = {
    height: 600,
    paper_bgcolor: '#2e3b4e',
    plot_bgcolor: '#2e3b4e',
    barmode: 'overlay',
    bargap: 0.2,
    bargroupgap: 0.1,
    xaxis: {
      type: 'date',
      showgrid: true,
      gridcolor: '#404b5d',
      gridwidth: 1,
      zeroline: false,
      tickfont: { color: '#FFFFFF', size: 10 },
      tickformat: '%m/%d/%y',
      range: [rangeStart.getTime(), rangeEnd.getTime()],
      dtick: 'M1',
    },
    yaxis: {
      showgrid: true,
      gridcolor: '#404b5d',
      gridwidth: 1,
      tickfont: { color: '#FFFFFF', size: 11 },
      automargin: true,
      tickson: "boundaries",
      ticklen: 4,
      tickwidth: 1,
    },
    margin: { l: 150, r: 100, t: 40, b: 80 },
    showlegend: true,
    legend: {
      orientation: 'h',
      y: -0.2,
      x: 0.5,
      xanchor: 'center',
      bgcolor: 'transparent',
      font: { color: '#FFFFFF' }
    },
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: '#2e3b4e',
      font: { color: '#FFFFFF' }
    }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'select2d',
      'lasso2d',
      'autoScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
  };

  return (
    <Card className="p-4" hover>
      <div className="w-full">
        <Plot
          data={traces}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '600px' }}
          useResizeHandler={true}
        />
      </div>
    </Card>
  );
}