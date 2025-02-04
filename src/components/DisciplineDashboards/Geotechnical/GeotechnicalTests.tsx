import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DisciplinePage } from '../AllDisciplines/DisciplinePage';
import { GEOTECHNICAL_SECTIONS } from './constants';

function GeotechnicalTests() {
  const navigate = useNavigate();

  // Clone the sections to add onClick handlers
  const sectionsWithHandlers = GEOTECHNICAL_SECTIONS.map(section => ({
    ...section,
    tests: section.tests.map(test => ({
      ...test,
      onClick: test.name === 'Standard Penetrometer Test (SPT)' 
        ? () => navigate('/geotechnical/spt')
        : undefined
    }))
  }));

  return (
    <DisciplinePage
      title="Geotechnical Tests"
      sections={sectionsWithHandlers}
    />
  );
}

export default GeotechnicalTests;