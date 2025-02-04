import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { BackNavigation } from '../../../common/BackNavigation';
import { StatusIndicator } from './components/StatusIndicator';
import { TrendIndicator } from './components/TrendIndicator';
import { TaskList } from './components/TaskList';
import { RisksCard } from './components/RisksCard';
import { DependenciesCard } from './components/DependenciesCard';
import { amtData } from './data/amtData';

export function AMTDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the item and month
  const { item, currentMonth } = useMemo(() => {
    const months = Object.keys(amtData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const mostRecentMonth = months[0];
    return {
      item: amtData[mostRecentMonth]?.find(item => item.id === id),
      currentMonth: mostRecentMonth
    };
  }, [id]);

  const sortedRisks = useMemo(() => {
    if (!item) return [];
    return [...item.keyRisks].sort((a, b) => 
      (b.likelihood * b.consequence) - (a.likelihood * a.consequence)
    );
  }, [item]);

  const criticalPathTasks = useMemo(() => {
    if (!item) return [];
    return item.tasksToComplete.filter(task => task.critical_path);
  }, [item]);

  const nonCriticalPathTasks = useMemo(() => {
    if (!item) return [];
    return item.tasksToComplete.filter(task => !task.critical_path);
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <BackNavigation to="/project-controls/amt" text="Back to AMT Report" />
            <div className="text-text-primary">Item not found</div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          {/* Header */}
          <div className="mb-8">
            <BackNavigation to="/project-controls/amt" text="Back to AMT Report" />

            {/* Title and Status Row */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">{item.title}</h1>
              <div className="flex items-center gap-4">
                {/* Date next to status indicators */}
                <span className="text-lg text-text-primary font-medium">
                  {currentMonth}
                </span>
                <StatusIndicator status={item.status} size="lg" />
                <TrendIndicator trend={item.trend} size={24} />
              </div>
            </div>

            {/* Key Issue on the right */}
            <div className="flex justify-end">
              <div className="max-w-xl text-text-muted text-sm italic">
                {item.keyIssue}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <RisksCard risks={sortedRisks} />
              <DependenciesCard dependencies={item.dependencies} />
            </div>

            {/* Right Column - Tasks to Complete */}
            <div className="space-y-6">
              <TaskList
                title="Tasks to Complete - Critical Path"
                tasks={criticalPathTasks}
                showHelp={true}
              />

              <TaskList
                title="Tasks to Complete - non critical path"
                tasks={nonCriticalPathTasks}
                showHelp={true}
              />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}