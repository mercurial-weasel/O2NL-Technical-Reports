import React from 'react';
import Plot from 'react-plotly.js';
import { Card } from '../../../common/Card';
import {
  months,
  plannedMonthly,
  actualMonthly,
  forecastMonthly,
  plannedCumulative,
  actualCumulative,
  forecastCumulative
} from './data/expenditureData';

export function ExpenditureChart() {
  return (
    <Card className="p-4" hover glow>
      <div className="w-full bg-purple-900 text-text-primary text-center py-1 px-3 mb-4 rounded-lg font-semibold text-base">
        CASHFLOW OVERVIEW
      </div>

      <Plot
        data={[
          {
            x: months,
            y: plannedMonthly,
            type: 'bar',
            name: 'Planned Monthly',
            marker: { color: '#C6C6C6' },  // Light gray color
          },
          {
            x: months,
            y: actualMonthly,
            type: 'bar',
            name: 'Actual Monthly',
            marker: { color: '#FFDC73' },  // Light yellow color
          },
          {
            x: months,
            y: forecastMonthly,
            type: 'bar',
            name: 'Forecast Monthly',
            marker: { color: '#4C7389' },  // Blue color
          },
          {
            x: months,
            y: plannedCumulative,
            type: 'scatter',
            mode: 'lines',
            name: 'Planned Cumulative',
            line: { dash: 'dash', color: '#C6C6C6' },
            yaxis: 'y2',
          },
          {
            x: months,
            y: actualCumulative,
            type: 'scatter',
            mode: 'lines',
            name: 'Actual Cumulative',
            line: { color: '#FFD700' },  // Gold color
            yaxis: 'y2',
          },
          {
            x: months,
            y: forecastCumulative,
            type: 'scatter',
            mode: 'lines',
            name: 'Forecast Cumulative',
            line: { color: '#166487' },  // Navy color
            yaxis: 'y2',
          },
        ]}
        layout={{
          // Remove the title since we now have the header div
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          barmode: 'group',
          height: 400,
          xaxis: {
            title: {
              text: 'Month-Year',
              font: { color: '#FFFFFF' }
            },
            tickfont: { color: '#FFFFFF' },
            gridcolor: '#333333',
            tickvals: months,
            showline: true,
            linecolor: '#333333',
            mirror: true
          },
          yaxis: {
            title: {
              text: 'Monthly Cashflow - Millions',
              font: { color: '#FFFFFF' }
            },
            tickfont: { color: '#FFFFFF' },
            gridcolor: '#333333',
            showline: true,
            linecolor: '#333333',
            mirror: true
          },
          yaxis2: {
            title: {
              text: 'Cumulative Cashflow - Millions',
              font: { color: '#FFFFFF' }
            },
            tickfont: { color: '#FFFFFF' },
            gridcolor: '#333333',
            overlaying: 'y',
            side: 'right',
            showline: true,
            linecolor: '#333333',
            mirror: true
          },
          legend: {
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: -0.2,
            font: { color: '#FFFFFF' },
            bgcolor: 'rgba(0,0,0,0)',
          },
          margin: {
            l: 80,
            r: 80,
            t: 20, // Reduced top margin since we removed the title
            b: 100
          },
          modebar: {
            bgcolor: 'rgba(0,0,0,0)',
            color: '#FFFFFF',
            activecolor: '#4C7389'
          },
          hoverlabel: {
            bgcolor: '#1a1a1a',
            bordercolor: '#333333',
            font: { color: '#FFFFFF' }
          }
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
          ],
          toImageButtonOptions: {
            format: 'png',
            filename: 'cashflow_chart',
            height: 500,
            width: 700,
            scale: 2
          }
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </Card>
  );
}