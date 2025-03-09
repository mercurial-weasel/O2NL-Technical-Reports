import React, { useState } from 'react';
import { Card } from '../../../../common/Card/Card';
import { HelpCircle } from 'lucide-react';
import { TaskListItem } from './TaskListItem';

interface Task {
  description: string;
  completion: number;
  status: string;
  critical_path: boolean;
}

interface TaskListProps {
  title: string;
  tasks: Task[];
  showHelp?: boolean;
}

export function TaskList({
  title,
  tasks,
  showHelp = false
}: TaskListProps) {
  const [helpTooltip, setHelpTooltip] = useState<{ x: number; y: number } | null>(null);

  return (
    <Card className="p-6" hover>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        {showHelp && (
          <div 
            className="relative"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHelpTooltip({ x: rect.left, y: rect.top });
            }}
            onMouseLeave={() => setHelpTooltip(null)}
          >
            <HelpCircle className="w-5 h-5 text-text-secondary hover:text-text-primary cursor-help" />
            {helpTooltip && (
              <div 
                className="absolute z-50 w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-xs text-text-primary"
                style={{
                  top: '-120px',
                  right: '0',
                }}
              >
                <h4 className="font-medium mb-2">Status Colors:</h4>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>On Track</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>At Risk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Delayed</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <ul className="space-y-4">
        {tasks.map((task, index) => (
          <TaskListItem
            key={index}
            task={task}
            index={index}
          />
        ))}
      </ul>
    </Card>
  );
}