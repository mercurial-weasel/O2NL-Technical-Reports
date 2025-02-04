import React, { useState, useMemo } from 'react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { BackNavigation } from '../../../common/BackNavigation';
import { ThemeCard } from './ThemeCard';
import { ThemeDetail } from './ThemeDetail';
import { GanttChart } from './GanttChart';
import { sustainabilityData } from './data';
import { Card } from '../../../common/Card';

export function SustainabilityInitiatives() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showGantt, setShowGantt] = useState(false);

  // Group initiatives by theme
  const themeGroups = useMemo(() => {
    const groups = new Map<string, typeof sustainabilityData>();
    sustainabilityData.forEach(initiative => {
      if (!groups.has(initiative.theme)) {
        groups.set(initiative.theme, []);
      }
      groups.get(initiative.theme)!.push(initiative);
    });
    return groups;
  }, []);

  // Calculate overall stats
  const overallStats = useMemo(() => ({
    total: sustainabilityData.length,
    must: sustainabilityData.filter(i => i.mustOrShould === 'Must').length,
    should: sustainabilityData.filter(i => i.mustOrShould === 'Should').length,
    implemented: sustainabilityData.filter(i => i.status === 'Implemented').length,
    pending: sustainabilityData.filter(i => i.status === 'Pending').length,
    delayed: sustainabilityData.filter(i => i.status === 'Delayed').length,
    proposed: sustainabilityData.filter(i => i.status === 'Proposed').length,
  }), []);

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">Sustainability Initiatives</h1>
              <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-lg">
                <button
                  onClick={() => setShowGantt(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showGantt 
                      ? 'bg-brand-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setShowGantt(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showGantt 
                      ? 'bg-brand-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>
            <p className="text-text-secondary">
              Track and monitor project sustainability initiatives and environmental impact metrics
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-1">Total Initiatives</h3>
              <div className="text-2xl font-bold text-text-primary">{overallStats.total}</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-1">Must Have</h3>
              <div className="text-2xl font-bold text-brand-primary">{overallStats.must}</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-1">Should Have</h3>
              <div className="text-2xl font-bold text-brand-secondary">{overallStats.should}</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-1">Implementation Status</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-green-400">{overallStats.implemented}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-yellow-400">{overallStats.pending}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-sm text-red-400">{overallStats.delayed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-blue-400">{overallStats.proposed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {showGantt ? (
            <Card className="p-6" hover>
              <GanttChart initiatives={sustainabilityData} />
            </Card>
          ) : selectedTheme ? (
            <ThemeDetail 
              theme={selectedTheme}
              initiatives={themeGroups.get(selectedTheme)!}
              onClose={() => setSelectedTheme(null)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(themeGroups.entries()).map(([theme, initiatives]) => (
                <ThemeCard
                  key={theme}
                  theme={theme}
                  initiatives={initiatives}
                  onClick={() => setSelectedTheme(theme)}
                />
              ))}
            </div>
          )}
        </Section>
        <Footer />
      </div>
    </div>
  );
}