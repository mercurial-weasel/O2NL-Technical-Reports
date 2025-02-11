import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeTest from './components/HomeTest';
import { GeotechnicalTests } from './components/DisciplineDashboards/Geotechnical';
import { EnvironmentalTests } from './components/DisciplineDashboards/Environmental';
import { ProjectControlsDashboards } from './components/DisciplineDashboards/ProjectControls';
import { ProjectMilestones } from './components/Dashboards/ProjectControls/Milestones';
import { PABDashboard } from './components/Dashboards/ProjectControls/PAB';
import { AMTDashboard, AMTDetailPage, BudgetTracking } from './components/Dashboards/ProjectControls/AMT';
import { SystemsDashboard } from './components/Dashboards/ProjectControls/Systems';
import { StaffNumbers } from './components/Dashboards/ProjectControls/P+C';
import { StaffFTEDashboard } from './components/Dashboards/ProjectControls/StaffFTE';
import { StaffMovementDashboard } from './components/Dashboards/ProjectControls/P+C/StaffMovement';
import { EarnedValueSummary } from './components/Dashboards/ProjectControls/Commercial/EarnedValue/EarnedValueSummary';
import { SustainabilityInitiatives } from './components/Dashboards/ProjectControls/SustainabilityInitiatives';
import { SustainabilityTracking } from './components/Dashboards/ProjectControls/SustainabilityTracking';
import { GeoDashboardSPT } from './components/Dashboards/Geo';
import { RoadmapPage } from './components/Roadmap';

function App2() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomeTest />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        
        {/* Discipline Routes */}
        <Route path="/geotechnical" element={<GeotechnicalTests />} />
        <Route path="/environmental" element={<EnvironmentalTests />} />
        <Route path="/project-controls" element={<ProjectControlsDashboards />} />
        
        {/* Dashboard Routes */}
        <Route path="/geotechnical/spt" element={<GeoDashboardSPT />} />
        <Route path="/project-controls/milestones" element={<ProjectMilestones />} />
        <Route path="/project-controls/pab" element={<PABDashboard />} />
        <Route path="/project-controls/amt" element={<AMTDashboard />} />
        <Route path="/project-controls/amt/:id" element={<AMTDetailPage />} />
        <Route path="/project-controls/amt/budget" element={<BudgetTracking />} />
        <Route path="/project-controls/systems" element={<SystemsDashboard />} />
        <Route path="/project-controls/staff-numbers" element={<StaffNumbers />} />
        <Route path="/project-controls/staff-fte" element={<StaffFTEDashboard />} />
        <Route path="/project-controls/staff-movement" element={<StaffMovementDashboard />} />
        <Route path="/project-controls/commercial/earned-value" element={<EarnedValueSummary />} />
        <Route path="/project-controls/sustainability" element={<SustainabilityInitiatives />} />
        <Route path="/project-controls/sustainability-tracking" element={<SustainabilityTracking />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App2;