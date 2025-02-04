import React from 'react';
import { DisciplinePage } from '../AllDisciplines/DisciplinePage';
import { ENVIRONMENTAL_SECTIONS } from './constants';

function EnvironmentalTests() {
  return (
    <DisciplinePage
      title="Environmental Tests"
      sections={ENVIRONMENTAL_SECTIONS}
    />
  );
}

export default EnvironmentalTests;