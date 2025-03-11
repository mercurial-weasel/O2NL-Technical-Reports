import React, { useState, useMemo } from 'react';
import { Header } from '@common/Header';
import { Footer } from '@common/Footer';
import { Section } from '../../common';
import { DisciplineSection } from './DisciplineSection';
import { DisciplineProps, DisciplineStatus } from './types';
import { StatusFilter } from './StatusFilter';
import { logger } from '@lib/logger';
import { useUser } from '@clerk/clerk-react';
import { getUserRole } from '@lib/roles';

export function DisciplinePage({ title, sections }: DisciplineProps) {
  const { user } = useUser();
  const userRole = useMemo(() => getUserRole(user?.organizationMemberships), [user]);

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

  // Filter sections based on status and user role
  const filteredSections = sections.map(section => ({
    ...section,
    tests: section.tests.filter(test => {
      // Check status filter
      const statusMatch = selectedStatuses.has('all') || selectedStatuses.has(test.status);
      
      // Check role access - use normalized userRole (without org: prefix)
      const hasAccess = !test.accessFor || 
        test.accessFor.length === 0 || 
        test.accessFor.some(role => role.toLowerCase() === userRole?.toLowerCase()) ||
        userRole?.toLowerCase() === 'admin';
        
      return statusMatch && hasAccess;
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
              No tests available with the selected filters
            </div>
          )}
        </Section>
        <Footer />
      </div>
    </div>
  );
}