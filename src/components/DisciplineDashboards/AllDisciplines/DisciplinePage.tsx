import React, { useState } from 'react';
import { Header } from '../../common/Header';
import { Footer } from '../../common/Footer';
import { Section } from '../../common';
import { DisciplineSection } from './DisciplineSection';
import { DisciplineProps, DisciplineStatus } from './types';
import { StatusFilter } from './StatusFilter';

export function DisciplinePage({ title, sections }: DisciplineProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: true
    }), {})
  );
  
  // Initialize with published, draft, and concept selected by default
  const [selectedStatuses, setSelectedStatuses] = useState<Set<DisciplineStatus | 'all'>>(
    new Set(['published', 'draft', 'concept'])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleStatusChange = (status: DisciplineStatus | 'all') => {
    setSelectedStatuses(prev => {
      const next = new Set(prev);
      
      if (status === 'all') {
        // If 'all' is clicked, toggle between all selected and none selected
        return next.has('all') ? new Set() : new Set(['all']);
      }
      
      // Remove 'all' when selecting specific statuses
      next.delete('all');
      
      if (next.has(status)) {
        next.delete(status);
        // If no specific statuses are selected, select default statuses
        if (next.size === 0) {
          next.add('published');
          next.add('draft');
          next.add('concept');
        }
      } else {
        next.add(status);
      }
      
      return next;
    });
  };

  // Filter sections and only include those with matching tests
  const filteredSections = sections
    .map(section => ({
      ...section,
      tests: section.tests.filter(test => {
        // Handle both 'not-available' and 'not_available' as the same status
        const testStatus = test.status === 'not_available' ? 'not-available' : test.status;
        return selectedStatuses.has('all') || selectedStatuses.has(testStatus);
      })
    }))
    .filter(section => section.tests.length > 0); // Only include sections with tests

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
            <StatusFilter
              selectedStatus={selectedStatuses}
              onChange={handleStatusChange}
            />
          </div>
          
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <DisciplineSection
                key={section.id}
                title={section.title}
                icon={section.icon}
                tests={section.tests}
                isExpanded={expandedSections[section.id]}
                onToggle={() => toggleSection(section.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-text-secondary">
              No tests match the selected filters
            </div>
          )}
        </Section>
        <Footer />
      </div>
    </div>
  );
}