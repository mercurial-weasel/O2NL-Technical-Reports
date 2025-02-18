import React, { useState } from 'react';
import { Header } from '../../common/Header';
import { Footer } from '../../common/Footer';
import { Section } from '../../common';
import { DisciplineSection } from './DisciplineSection';
import { DisciplineProps, DisciplineStatus } from './types';
import { StatusFilter } from './StatusFilter';
import { useAuth } from '../../../lib/auth';
import { logger } from '../../../lib/logger';

export function DisciplinePage({ title, sections }: DisciplineProps) {
  const { state: authState } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: true
    }), {})
  );
  
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
        return next.has('all') ? new Set() : new Set(['all']);
      }
      
      next.delete('all');
      
      if (next.has(status)) {
        next.delete(status);
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

  // Filter sections based on user access rights
  const accessibleSections = sections.filter(section => {
    // Admin has access to all sections
    if (authState.user?.accessRights.includes('Admin')) {
      return true;
    }

    // Check if user has access to the section
    const hasAccess = section.accessFor.some(right => 
      authState.user?.accessRights.includes(right)
    );

    if (!hasAccess) {
      logger.debug('User does not have access to section', { 
        section: section.title, 
        requiredAccess: section.accessFor,
        userAccess: authState.user?.accessRights 
      });
      return false;
    }

    return true;
  });

  // Filter sections and tests based on status and access
  const filteredSections = accessibleSections.map(section => ({
    ...section,
    tests: section.tests.filter(test => {
      // Check status filter
      const statusMatch = selectedStatuses.has('all') || selectedStatuses.has(test.status);
      
      // Admin has access to all tests
      if (authState.user?.accessRights.includes('Admin')) {
        return statusMatch;
      }

      // Check access rights
      const accessMatch = test.accessFor.some(right => 
        authState.user?.accessRights.includes(right)
      );

      if (!accessMatch) {
        logger.debug('User does not have access to test', {
          test: test.name,
          requiredAccess: test.accessFor,
          userAccess: authState.user?.accessRights
        });
      }

      return statusMatch && accessMatch;
    })
  })).filter(section => section.tests.length > 0);

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
              {authState.user ? 
                "You don't have access to any tests in this section" : 
                "Please sign in to view available tests"}
            </div>
          )}
        </Section>
        <Footer />
      </div>
    </div>
  );
}