import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthlyDustData, getDustLevelColor, getDustLevelStatus } from '../../../../../../api/sensors/dust/transformations';

interface DustCalendarProps {
  data: MonthlyDustData[];
  selectedParameters: Set<'pm10' | 'pm2_5'>;
  onParameterChange: (parameters: Set<'pm10' | 'pm2_5'>) => void;
}

interface TooltipState {
  visible: boolean;
  dayIndex: number | null;
}

export function DustCalendar({ data, selectedParameters, onParameterChange }: DustCalendarProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, dayIndex: null });
  const tooltipTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  if (data.length === 0) return null;

  const monthData = data[currentMonthIndex];
  const [year, month] = monthData.month.split('-');
  const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
  
  // Get all days in the month
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1).getDay();
  
  // Create array of day cells
  const dayCells = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    
    const dateString = `${monthData.month}-${dayNumber.toString().padStart(2, '0')}`;
    const dayData = monthData.days.find(d => d.date === dateString);
    
    return {
      dayNumber,
      data: dayData
    };
  });

  const handlePreviousMonth = () => {
    setCurrentMonthIndex(prev => Math.min(prev + 1, data.length - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => Math.max(prev - 1, 0));
  };

  const handleDayMouseEnter = (index: number) => {
    // Clear any existing timeout
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }

    // Set new timeout for showing tooltip
    tooltipTimeout.current = setTimeout(() => {
      setTooltip({ visible: true, dayIndex: index });
    }, 200); // 200ms delay
  };

  const handleDayMouseLeave = () => {
    // Clear timeout if mouse leaves before it triggers
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    setTooltip({ visible: false, dayIndex: null });
  };

  return (
    <div className="flex gap-6">
      {/* Calendar */}
      <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousMonth}
            disabled={currentMonthIndex >= data.length - 1}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <h3 className="text-lg font-medium text-text-primary">
            {monthName} {year}
          </h3>
          
          <button
            onClick={handleNextMonth}
            disabled={currentMonthIndex <= 0}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-text-secondary py-2">
              {day}
            </div>
          ))}
          
          {/* Day Cells */}
          {dayCells.map((cell, i) => {
            if (!cell) {
              return <div key={i} className="aspect-square" />;
            }

            const { dayNumber, data } = cell;
            const hasData = !!data;
            const dustLevel = hasData ? data.combinedAverage : 0;
            const backgroundColor = hasData ? getDustLevelColor(dustLevel) : 'transparent';
            const status = hasData ? getDustLevelStatus(dustLevel) : 'No Data';

            return (
              <div
                key={i}
                className="aspect-square relative"
                onMouseEnter={() => handleDayMouseEnter(i)}
                onMouseLeave={handleDayMouseLeave}
              >
                <div 
                  className={`
                    absolute inset-0 rounded-lg border 
                    ${hasData ? 'border-transparent' : 'border-gray-700/50'} 
                    transition-colors duration-200
                  `}
                  style={{ backgroundColor: `${backgroundColor}20` }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-medium text-text-primary">
                      {dayNumber}
                    </span>
                    {hasData && (
                      <span className="text-xs text-text-secondary mt-1">
                        {dustLevel.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tooltip */}
                {tooltip.visible && tooltip.dayIndex === i && (
                  <div className="absolute top-0 left-0 transform -translate-y-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 text-xs whitespace-nowrap z-10">
                    <div className="font-medium text-text-primary">
                      {new Date(parseInt(year), parseInt(month) - 1, dayNumber).toLocaleDateString()}
                    </div>
                    {hasData ? (
                      <>
                        <div className="text-text-secondary mt-1">
                          Status: <span style={{ color: backgroundColor }}>{status}</span>
                        </div>
                        <div className="text-text-secondary">
                          PM10: {data.pm10Average.toFixed(1)} µg/m³
                        </div>
                        <div className="text-text-secondary">
                          PM2.5: {data.pm2_5Average.toFixed(1)} µg/m³
                        </div>
                        <div className="text-text-secondary">
                          Readings: {data.readings}
                        </div>
                      </>
                    ) : (
                      <div className="text-text-secondary mt-1">No data available</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-64 space-y-6">
        {/* Parameters Selector */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-text-secondary mb-4">Parameters</h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onParameterChange(prev => {
                const next = new Set(prev);
                if (next.has('pm10')) {
                  next.delete('pm10');
                  if (next.size === 0) next.add('pm2_5');
                } else {
                  next.add('pm10');
                }
                return next;
              })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedParameters.has('pm10')
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-700/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              PM10
            </button>
            <button
              onClick={() => onParameterChange(prev => {
                const next = new Set(prev);
                if (next.has('pm2_5')) {
                  next.delete('pm2_5');
                  if (next.size === 0) next.add('pm10');
                } else {
                  next.add('pm2_5');
                }
                return next;
              })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedParameters.has('pm2_5')
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-700/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              PM2.5
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-text-secondary mb-4">Air Quality Index</h4>
          <div className="space-y-4">
            {[
              { range: '0-50', label: 'Good', color: '#10B981' },
              { range: '51-100', label: 'Moderate', color: '#FBBF24' },
              { range: '101-150', label: 'Unhealthy for Sensitive Groups', color: '#F97316' },
              { range: '151-200', label: 'Unhealthy', color: '#EF4444' },
              { range: '201-300', label: 'Very Unhealthy', color: '#9333EA' },
              { range: '>300', label: 'Hazardous', color: '#7F1D1D' }
            ].map(level => (
              <div key={level.range} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: `${level.color}40` }}
                />
                <div className="text-xs">
                  <div className="text-text-primary">{level.label}</div>
                  <div className="text-text-secondary">{level.range} µg/m³</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}