import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DisciplinePage } from '../AllDisciplines/DisciplinePage';
import { ENVIRONMENTAL_SECTIONS } from './constants';

function EnvironmentalTests() {
  const navigate = useNavigate();

  // Clone the sections to add onClick handlers
  const sectionsWithHandlers = ENVIRONMENTAL_SECTIONS.map(section => ({
    ...section,
    tests: section.tests.map(test => ({
      ...test,
      onClick: test.name === 'Dust'
        ? () => navigate('/environmental/sensors/dust')
        : undefined
    }))
  }));

  return (
    <DisciplinePage
      title="Environmental Tests"
      sections={sectionsWithHandlers}
    />
  );
}

export default EnvironmentalTests;