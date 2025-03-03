import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DisciplinePage } from '../AllDisciplines/DisciplinePage';
import { PROJECT_CONTROLS_SECTIONS } from './constants';

function ProjectControlsDashboards() {
  const navigate = useNavigate();

  // Clone the sections to add onClick handlers
  const sectionsWithHandlers = PROJECT_CONTROLS_SECTIONS.map(section => ({
    ...section,
    tests: section.tests.map(test => ({
      ...test,
      onClick: test.name === 'Programme Milestones' 
        ? () => navigate('/project-controls/milestones')
        : test.name === 'Systems/Software'
        ? () => navigate('/project-controls/systems')
        : test.name === 'PAB Report'
        ? () => navigate('/project-controls/pab')
        : test.name === 'AMT Report'
        ? () => navigate('/project-controls/amt')
        : test.name === 'Sustainability Report'
        ? () => navigate('/project-controls/sustainability')
        : test.name === 'Staff Numbers'
        ? () => navigate('/project-controls/staff-numbers')
        : test.name === 'Staff FTE'
        ? () => navigate('/project-controls/staff-fte')
        : test.name === 'Staff Movement'
        ? () => navigate('/project-controls/staff-movement')
        : test.name === 'Time Logs'
        ? () => navigate('/project-controls/time-logs')
        : test.name === 'AMT Budget Tracking'
        ? () => navigate('/project-controls/amt/budget')
        : test.name === 'Earned Value'
        ? () => navigate('/project-controls/commercial/earned-value')
        : test.name === 'Sustainability Initiatives'
        ? () => navigate('/project-controls/sustainability')
        : test.name === 'Emission Tracking'
        ? () => navigate('/project-controls/emissions')
        : test.name === 'Consenting'
        ? () => navigate('/project-controls/consenting')
        : test.name === 'Equipment Status'
        ? () => navigate('/project-controls/equipment')
        : undefined
    }))
  }));

  return (
    <DisciplinePage
      title="Project Controls"
      sections={sectionsWithHandlers}
    />
  );
}

export default ProjectControlsDashboards;