import React, { useState } from 'react';
import { HoursPivot } from '@api/projectcontrols/peopleculture';
import { MultiSelectFilter } from '@common/Filters';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TimeLogsTableProps {
  data: HoursPivot;
}

export function TimeLogsTable({ data }: TimeLogsTableProps) {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set(['all']));
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set(['all']));
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['Pending']));
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Get unique values for filters and data organization
  const projects = Object.keys(data);
  const tasks = new Set<string>();
  const statuses = new Set<string>();
  const monthYears = new Set<string>();

  // Collect unique values
  Object.values(data).forEach(projectData => {
    Object.entries(projectData).forEach(([task, taskData]) => {
      tasks.add(task);
      Object.values(taskData).forEach(userData => {
        Object.entries(userData).forEach(([status, monthData]) => {
          statuses.add(status);
          Object.keys(monthData).forEach(month => monthYears.add(month));
        });
      });
    });
  });

  // Filter data based on selections
  const filteredData = Object.entries(data).reduce((acc, [project, projectData]) => {
    if (selectedProjects.has('all') || selectedProjects.has(project)) {
      acc[project] = Object.entries(projectData).reduce((taskAcc, [task, taskData]) => {
        if (selectedTasks.has('all') || selectedTasks.has(task)) {
          taskAcc[task] = Object.entries(taskData).reduce((userAcc, [user, userData]) => {
            userAcc[user] = Object.entries(userData).reduce((statusAcc, [status, monthData]) => {
              if (selectedStatuses.has('all') || selectedStatuses.has(status)) {
                statusAcc[status] = monthData;
              }
              return statusAcc;
            }, {} as typeof userData);
            return userAcc;
          }, {} as typeof taskData);
        }
        return taskAcc;
      }, {} as typeof projectData);
    }
    return acc;
  }, {} as HoursPivot);

  // Calculate totals with fixed logic
  const calculateTotals = (level: 'project' | 'task' | 'user', project?: string, task?: string) => {
    const totals: Record<string, Record<string, number>> = {};
    
    // Initialize totals structure
    Array.from(statuses).forEach(status => {
      if (selectedStatuses.has('all') || selectedStatuses.has(status)) {
        totals[status] = {};
        Array.from(monthYears).forEach(month => {
          totals[status][month] = 0;
        });
      }
    });

    // Calculate totals based on level
    if (level === 'project') {
      // Project level - sum all tasks and users for the project
      const projectData = filteredData[project!];
      Object.values(projectData).forEach(taskData => {
        Object.values(taskData).forEach(userData => {
          Object.entries(userData).forEach(([status, monthData]) => {
            if (totals[status]) {
              Object.entries(monthData).forEach(([month, hours]) => {
                totals[status][month] += hours;
              });
            }
          });
        });
      });
    } else if (level === 'task') {
      // Task level - sum all users for the specific task
      const taskData = filteredData[project!][task!];
      Object.values(taskData).forEach(userData => {
        Object.entries(userData).forEach(([status, monthData]) => {
          if (totals[status]) {
            Object.entries(monthData).forEach(([month, hours]) => {
              totals[status][month] += hours;
            });
          }
        });
      });
    }
    
    return totals;
  };

  const sortedMonths = Array.from(monthYears).sort();
  const displayedStatuses = Array.from(statuses).filter(status => 
    selectedStatuses.has('all') || selectedStatuses.has(status)
  ).sort();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Project</label>
          <MultiSelectFilter
            options={projects.map(p => ({ value: p, label: p }))}
            selectedValues={selectedProjects}
            onChange={(value) => {
              setSelectedProjects(prev => {
                const next = new Set(prev);
                if (value === 'all') {
                  return next.has('all') ? new Set() : new Set(['all']);
                }
                next.delete('all');
                if (next.has(value)) {
                  next.delete(value);
                  if (next.size === 0) next.add('all');
                } else {
                  next.add(value);
                }
                return next;
              });
            }}
            placeholder="Select Projects"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Task</label>
          <MultiSelectFilter
            options={Array.from(tasks).map(t => ({ value: t, label: t }))}
            selectedValues={selectedTasks}
            onChange={(value) => {
              setSelectedTasks(prev => {
                const next = new Set(prev);
                if (value === 'all') {
                  return next.has('all') ? new Set() : new Set(['all']);
                }
                next.delete('all');
                if (next.has(value)) {
                  next.delete(value);
                  if (next.size === 0) next.add('all');
                } else {
                  next.add(value);
                }
                return next;
              });
            }}
            placeholder="Select Tasks"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
          <MultiSelectFilter
            options={Array.from(statuses).map(s => ({ value: s, label: s }))}
            selectedValues={selectedStatuses}
            onChange={(value) => {
              setSelectedStatuses(prev => {
                const next = new Set(prev);
                if (value === 'all') {
                  return next.has('all') ? new Set() : new Set(['all']);
                }
                next.delete('all');
                if (next.has(value)) {
                  next.delete(value);
                  if (next.size === 0) next.add('all');
                } else {
                  next.add(value);
                }
                return next;
              });
            }}
            placeholder="Select Statuses"
          />
        </div>
      </div>

      {/* Pivot Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Project / Task / User</th>
              {displayedStatuses.map(status => 
                sortedMonths.map(month => (
                  <th key={`${status}-${month}`} className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">
                    {`${status} ${month}`}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredData).map(([project, projectData]) => {
              const projectTotals = calculateTotals('project', project);
              const isProjectExpanded = expandedProjects.has(project);

              return (
                <React.Fragment key={project}>
                  {/* Project Row */}
                  <tr className="border-b border-gray-700/50 bg-gray-800/30">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setExpandedProjects(prev => {
                          const next = new Set(prev);
                          if (next.has(project)) {
                            next.delete(project);
                          } else {
                            next.add(project);
                          }
                          return next;
                        })}
                        className="flex items-center gap-2 text-sm font-medium text-text-primary"
                      >
                        {isProjectExpanded ? (
                          <ChevronDown className="w-4 h-4 text-brand-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-brand-primary" />
                        )}
                        {project}
                      </button>
                    </td>
                    {displayedStatuses.map(status => 
                      sortedMonths.map(month => (
                        <td key={`${status}-${month}`} className="py-3 px-4 text-right text-sm font-medium text-text-primary">
                          {projectTotals[status]?.[month]?.toFixed(2) || '-'}
                        </td>
                      ))
                    )}
                  </tr>

                  {/* Task and User Rows */}
                  {isProjectExpanded && Object.entries(projectData).map(([task, taskData]) => {
                    const taskTotals = calculateTotals('task', project, task);
                    const isTaskExpanded = expandedTasks.has(`${project}-${task}`);

                    return (
                      <React.Fragment key={`${project}-${task}`}>
                        {/* Task Row */}
                        <tr className="border-b border-gray-700/50 bg-gray-800/20">
                          <td className="py-3 px-4 pl-8">
                            <button
                              onClick={() => setExpandedTasks(prev => {
                                const next = new Set(prev);
                                if (next.has(`${project}-${task}`)) {
                                  next.delete(`${project}-${task}`);
                                } else {
                                  next.add(`${project}-${task}`);
                                }
                                return next;
                              })}
                              className="flex items-center gap-2 text-sm text-text-secondary"
                            >
                              {isTaskExpanded ? (
                                <ChevronDown className="w-4 h-4 text-brand-primary" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-brand-primary" />
                              )}
                              {task}
                            </button>
                          </td>
                          {displayedStatuses.map(status => 
                            sortedMonths.map(month => (
                              <td key={`${status}-${month}`} className="py-3 px-4 text-right text-sm text-text-secondary">
                                {taskTotals[status]?.[month]?.toFixed(2) || '-'}
                              </td>
                            ))
                          )}
                        </tr>

                        {/* User Rows */}
                        {isTaskExpanded && Object.entries(taskData).map(([user, userData]) => (
                          <tr key={`${project}-${task}-${user}`} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                            <td className="py-3 px-4 pl-12 text-sm text-text-secondary">
                              {user}
                            </td>
                            {displayedStatuses.map(status => 
                              sortedMonths.map(month => (
                                <td key={`${status}-${month}`} className="py-3 px-4 text-right text-sm text-text-secondary">
                                  {userData[status]?.[month]?.toFixed(2) || '-'}
                                </td>
                              ))
                            )}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}