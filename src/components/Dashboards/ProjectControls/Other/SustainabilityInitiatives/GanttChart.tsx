import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { SustainabilityInitiative } from './data';

interface GanttChartProps {
  initiatives: SustainabilityInitiative[];
}

interface TooltipContent {
  initiative: SustainabilityInitiative;
  x: number;
  y: number;
}

export function GanttChart({ initiatives }: GanttChartProps) {
  const [tooltipContent, setTooltipContent] = useState<TooltipContent | null>(null);

  // Group initiatives by theme
  const themeGroups = useMemo(() => {
    const groups = new Map<string, SustainabilityInitiative[]>();
    initiatives.forEach(initiative => {
      if (!groups.has(initiative.theme)) {
        groups.set(initiative.theme, []);
      }
      groups.get(initiative.theme)!.push(initiative);
    });
    return groups;
  }, [initiatives]);

  // Calculate date ranges for each theme
  const themeRanges = useMemo(() => {
    return Array.from(themeGroups.entries()).map(([theme, initiatives]) => {
      const dates = initiatives.map(i => new Date(i.targetDate).getTime());
      return {
        theme,
        start: new Date(Math.min(...dates)),
        end: new Date(Math.max(...dates))
      };
    });
  }, [themeGroups]);

  // Get overall min and max dates for chart range
  const dates = initiatives.map(i => new Date(i.targetDate));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Add 1 month padding on each side
  minDate.setMonth(minDate.getMonth() - 1);
  maxDate.setMonth(maxDate.getMonth() + 1);

  // Create theme bar traces
  const themeBarTraces = themeRanges.map(({ theme, start, end }) => ({
    type: 'bar' as const,
    name: theme + ' (Range)',
    y: [theme],
    x: [end.getTime() - start.getTime()],
    base: [start.getTime()],
    orientation: 'h' as const,
    marker: {
      color: 'rgba(255, 255, 255, 0.1)'
    },
    showlegend: false,
    hoverinfo: 'skip' as const,
  }));

  // Create initiative marker traces
  const initiativeTraces = Array.from(themeGroups.entries()).map(([theme, themeInitiatives]) => ({
    type: 'scatter' as const,
    mode: 'markers' as const,
    name: theme,
    x: themeInitiatives.map(i => i.targetDate),
    y: Array(themeInitiatives.length).fill(theme),
    marker: {
      symbol: 'diamond',
      size: 12,
      color: themeInitiatives.map(i => 
        i.status === 'Implemented' ? '#10B981' :  // Green
        i.status === 'Pending' ? '#F59E0B' :      // Yellow
        i.status === 'Delayed' ? '#EF4444' :      // Red
        '#3B82F6'                                 // Blue for Proposed
      ),
      line: {
        color: '#FFFFFF',
        width: 1
      }
    },
    customdata: themeInitiatives,
    hoverinfo: 'none' as const
  }));

  // Create current date line trace
  const currentDate = new Date();
  const currentDateTrace = {
    type: 'scatter' as const,
    mode: 'lines' as const,
    name: 'Current Date',
    x: [currentDate, currentDate],
    y: [Array.from(themeGroups.keys())[0], Array.from(themeGroups.keys())[themeGroups.size - 1]],
    line: {
      color: '#EF4444',
      width: 2,
      dash: 'dash'
    },
    showlegend: false
  };

  const handleHover = (event: any) => {
    if (event.points && event.points[0]) {
      const point = event.points[0];
      const initiative = point.customdata;
      
      if (initiative) {
        setTooltipContent({
          initiative,
          x: event.event.pageX,
          y: event.event.pageY
        });
      }
    }
  };

  const handleUnhover = () => {
    setTooltipContent(null);
  };

  return (
    <div className="relative">
      <Plot
        data={[...themeBarTraces, ...initiativeTraces, currentDateTrace]}
        layout={{
          title: {
            text: 'Sustainability Initiatives Timeline',
            font: { color: '#FFFFFF', size: 16 }
          },
          height: Math.max(400, themeGroups.size * 60),
          margin: { l: 150, r: 50, t: 50, b: 50 },
          showlegend: false,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: {
            type: 'date',
            range: [minDate, maxDate],
            gridcolor: '#333333',
            tickfont: { color: '#FFFFFF' },
            title: {
              text: 'Target Date',
              font: { color: '#FFFFFF' }
            }
          },
          yaxis: {
            gridcolor: '#333333',
            tickfont: { color: '#FFFFFF' },
            title: {
              text: 'Theme',
              font: { color: '#FFFFFF' }
            }
          },
          barmode: 'overlay' as const
        }}
        config={{
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
        }}
        onHover={handleHover}
        onUnhover={handleUnhover}
        style={{ width: '100%' }}
      />

      {/* Tooltip */}
      {tooltipContent && (
        <div 
          className="absolute z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 text-sm"
          style={{
            left: `${tooltipContent.x}px`,
            top: `${tooltipContent.y - 200}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '400px'
          }}
        >
          <div className="space-y-2">
            <div>
              <span className="text-text-secondary">Outcome:</span>
              <p className="text-text-primary font-medium">{tooltipContent.initiative.outcome}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-text-secondary">Status:</span>
                <p className={`font-medium ${
                  tooltipContent.initiative.status === 'Implemented' ? 'text-green-400' :
                  tooltipContent.initiative.status === 'Pending' ? 'text-yellow-400' :
                  tooltipContent.initiative.status === 'Delayed' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {tooltipContent.initiative.status}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">Priority:</span>
                <p className="text-text-primary font-medium">{tooltipContent.initiative.priority}</p>
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Owner:</span>
              <p className="text-text-primary font-medium">
                {tooltipContent.initiative.measureOwner || 'Not assigned'}
              </p>
            </div>
            <div>
              <span className="text-text-secondary">Target Date:</span>
              <p className="text-text-primary font-medium">
                {new Date(tooltipContent.initiative.targetDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}