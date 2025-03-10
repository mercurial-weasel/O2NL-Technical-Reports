import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Card } from '@common/Card/Card';
import { EquipmentSummary } from '@api/equipment/transformations';

interface EquipmentCardProps {
  summary: EquipmentSummary;
  onClick?: () => void;
}

export function EquipmentCard({ summary, onClick }: EquipmentCardProps) {
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Calculate percentages for the progress bar
  const total = summary.total;
  const percentages = {
    operational: (summary.statusCounts.operational / total) * 100,
    maintenance: (summary.statusCounts.maintenance / total) * 100,
    fault: (summary.statusCounts.fault / total) * 100,
    offline: (summary.statusCounts.offline / total) * 100
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background-base rounded-lg"
    >
      <Card className="p-4 transition-transform duration-200 hover:scale-[1.02]" hover>
        {/* Title with total count and help icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-text-secondary hover:text-text-primary cursor-help"
                onMouseEnter={() => setShowHelpTooltip(true)}
                onMouseLeave={() => setShowHelpTooltip(false)}
              />
              {showHelpTooltip && (
                <div className="absolute z-50 left-0 top-0 transform -translate-y-full -translate-x-1/2 mt-[-8px] w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                  <p className="text-xs text-text-primary">
                    Equipment status is shown in the progress bar below:
                    <br /><br />
                    <span className="text-green-400">Green</span>: Operational
                    <br />
                    <span className="text-yellow-400">Yellow</span>: Under Maintenance
                    <br />
                    <span className="text-red-400">Red</span>: Fault Detected
                    <br />
                    <span className="text-orange-400">Orange</span>: Offline
                  </p>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{summary.name}</h3>
          </div>
          <span className="text-sm font-medium text-brand-primary">
            Total: {summary.total}
          </span>
        </div>

        {/* Progress bar with tooltips */}
        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden relative">
          <div className="h-full flex">
            {/* Operational */}
            {percentages.operational > 0 && (
              <div 
                className="h-full bg-green-500 transition-all duration-500 relative cursor-help"
                style={{ width: `${percentages.operational}%` }}
                onMouseEnter={() => setHoveredSection('operational')}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
            {/* Maintenance */}
            {percentages.maintenance > 0 && (
              <div 
                className="h-full bg-yellow-500 transition-all duration-500 relative cursor-help"
                style={{ width: `${percentages.maintenance}%` }}
                onMouseEnter={() => setHoveredSection('maintenance')}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
            {/* Fault */}
            {percentages.fault > 0 && (
              <div 
                className="h-full bg-red-500 transition-all duration-500 relative cursor-help"
                style={{ width: `${percentages.fault}%` }}
                onMouseEnter={() => setHoveredSection('fault')}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
            {/* Offline */}
            {percentages.offline > 0 && (
              <div 
                className="h-full bg-orange-500 transition-all duration-500 relative cursor-help"
                style={{ width: `${percentages.offline}%` }}
                onMouseEnter={() => setHoveredSection('offline')}
                onMouseLeave={() => setHoveredSection(null)}
              />
            )}
          </div>

          {/* Section Tooltip */}
          {hoveredSection && (
            <div 
              className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs whitespace-nowrap"
            >
              {hoveredSection === 'operational' && (
                <span className="text-green-400">
                  Operational: {summary.statusCounts.operational}/{total}
                </span>
              )}
              {hoveredSection === 'maintenance' && (
                <span className="text-yellow-400">
                  Maintenance: {summary.statusCounts.maintenance}/{total}
                </span>
              )}
              {hoveredSection === 'fault' && (
                <span className="text-red-400">
                  Fault: {summary.statusCounts.fault}/{total}
                </span>
              )}
              {hoveredSection === 'offline' && (
                <span className="text-orange-400">
                  Offline: {summary.statusCounts.offline}/{total}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </button>
  );
}