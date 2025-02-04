import React from 'react';

interface Task {
  description: string;
  completion: number;
  status: string;
  critical_path: boolean;
}

interface TaskTooltipProps {
  task: Task;
  x: number;
  y: number;
}

export function TaskTooltip({ task, x, y }: TaskTooltipProps) {
  return (
    <div 
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-xs"
      style={{
        top: `${y - 10}px`,
        left: `${x}px`,
        transform: 'translateY(-100%)',
        maxWidth: '300px'
      }}
    >
      <div className="space-y-2">
        <div className="font-medium text-brand-primary">Task Details</div>
        <div className="grid gap-2">
          <div>
            <span className="text-text-secondary">Status:</span>
            <span className={`ml-2 capitalize ${
              task.status === 'on track' ? 'text-green-400' :
              task.status === 'at risk' ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {task.status}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Completion:</span>
            <span className="ml-2 text-text-primary">{task.completion}%</span>
          </div>
          <div>
            <span className="text-text-secondary">Critical Path:</span>
            <span className="ml-2 text-text-primary">{task.critical_path ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}