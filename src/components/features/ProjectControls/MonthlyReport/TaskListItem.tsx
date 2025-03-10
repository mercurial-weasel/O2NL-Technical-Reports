import React, { useState } from 'react';

interface Task {
  description: string;
  completion: number;
  status: string;
  critical_path: boolean;
}

interface TaskListItemProps {
  task: Task;
  index: number;
}

export function TaskListItem({ task, index }: TaskListItemProps) {
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number } | null>(null);

  return (
    <li 
      className="flex items-start gap-3"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setShowTooltip({ x: rect.left, y: rect.top });
      }}
      onMouseLeave={() => setShowTooltip(null)}
    >
      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs">
        {index + 1}
      </span>
      <div className="flex-1">
        <span className="text-text-secondary">{task.description}</span>
        <div className="mt-2 h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              task.status === 'on track' ? 'bg-green-500' :
              task.status === 'at risk' ? 'bg-orange-500' :
              'bg-red-500'
            } ${task.critical_path ? '' : 'opacity-50'}`}
            style={{ width: `${task.completion}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between items-center">
          <span className={`text-xs capitalize ${
            task.status === 'on track' ? 'text-green-400' :
            task.status === 'at risk' ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {task.status}
          </span>
          <span className="text-xs text-text-muted">{task.completion}% complete</span>
        </div>
      </div>

      {/* Task Details Tooltip */}
      {showTooltip && (
        <div 
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-xs"
          style={{
            top: `${showTooltip.y - 10}px`,
            left: `${showTooltip.x}px`,
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
      )}
    </li>
  );
}