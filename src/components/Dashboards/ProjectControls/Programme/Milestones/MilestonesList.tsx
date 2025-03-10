import React, { useState } from 'react';
import { Card } from '@common/Card';
import { MilestoneTask } from './types';

interface MilestonesListProps {
  tasks: MilestoneTask[];
}

interface HoverDetails {
  visible: boolean;
  x: number;
  y: number;
  milestone: {
    name: string;
    date: string;
    status: string;
    description: string;
    taskName: string;
    category: string;
  } | null;
}

export function MilestonesList({ tasks }: MilestonesListProps) {
  const [hoverDetails, setHoverDetails] = useState<HoverDetails>({
    visible: false,
    x: 0,
    y: 0,
    milestone: null,
  });

  // Get all milestones from all tasks and sort by date
  const allMilestones = tasks
    .flatMap(task => task.milestones.map(milestone => ({
      ...milestone,
      taskName: task.name,
      category: task.category
    })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLTableRowElement>,
    milestone: any
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverDetails({
      visible: true,
      x: rect.left - 320, // Position tooltip to the left of the row
      y: rect.top,
      milestone,
    });
  };

  const handleMouseLeave = () => {
    setHoverDetails(prev => ({ ...prev, visible: false }));
  };

  return (
    <Card className="p-4 h-full" hover>
      <div className="flex flex-col h-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Milestone</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Date</th>
              </tr>
            </thead>
            <tbody>
              {allMilestones.map((milestone) => (
                <tr
                  key={milestone.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(e, milestone)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td className="py-2 px-4 text-sm text-text-primary">
                    {milestone.name}
                  </td>
                  <td className="py-2 px-4 text-sm text-text-secondary">
                    {new Date(milestone.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hover Details Tooltip */}
        {hoverDetails.visible && hoverDetails.milestone && (
          <div
            className="fixed z-50 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4"
            style={{
              top: `${hoverDetails.y}px`,
              left: `${hoverDetails.x}px`,
              transform: 'translateY(-25%)',
            }}
          >
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-text-primary">
                  {hoverDetails.milestone.name}
                </h4>
                <p className="text-xs text-brand-secondary mt-1">
                  {new Date(hoverDetails.milestone.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-text-secondary mb-1">Description</h5>
                <p className="text-xs text-text-primary">
                  {hoverDetails.milestone.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{hoverDetails.milestone.taskName}</span>
                <span>{hoverDetails.milestone.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary capitalize">
                  Status: {hoverDetails.milestone.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}