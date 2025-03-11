import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LegacyAuthWrapper } from '@auth/ClerkAuthAdapter'; // Wraps authentication
import { AuthChecker } from '@components/Authentication/AuthChecker'; // Middleware to check auth

// Auth Pages
import LoginPage from '@pages/AuthPages/LoginPage';
import RegisterPage from '@pages/AuthPages/RegisterPage';

// Public Pages
import HomePage from '@pages/home/HomeTest';

// Geotechnical & Environmental Dashboards
import { ProjectControlsDashboards } from '@dashboardGroups/ProjectControls';
import { GeotechnicalTests } from '@dashboardGroups/Geotechnical';
import { EnvironmentalTests } from '@dashboardGroups/Environmental';

import { GeoDashboardSPT } from '@dashboards/Geo';

import { EarnedValueSummary } from '@dashboards/ProjectControls/Commercial/EarnedValue/EarnedValueSummary';
import { BudgetTracking } from '@dashboards/ProjectControls/Commercial/BudgetTracking';

// Project Control Dashboards
import { AMTDashboard, AMTDetailPage } from '@dashboards/ProjectControls/Programme/AMT';
import { PABDashboard } from '@dashboards/ProjectControls/Programme/PAB';
import { SystemsDashboard } from '@dashboards/ProjectControls/Programme/Systems';
import { ConsentingDashboard } from '@dashboards/ProjectControls/Programme/Consenting';
import { SustainabilityDashboard, SustainabilityDetailPage } from '@dashboards/ProjectControls/Programme/Sustainability';

import { StaffNumbers2Dashboard } from '@dashboards/ProjectControls/PeopleCulture/StaffNumbers2';
import { StaffFTEDashboard } from '@dashboards/ProjectControls/PeopleCulture/StaffFTE';
import { StaffMovementDashboard } from '@dashboards/ProjectControls/PeopleCulture/StaffMovement';
import { TimeLogsDashboard } from '@dashboards/ProjectControls/PeopleCulture/TimeLogs';

import { SustainabilityInitiatives } from '@dashboards/ProjectControls/SustainabilityInitiatives';
import { EmissionsTracking } from '@dashboards/ProjectControls/Other/EmissionsTracking';
import { EquipmentStatus } from '@dashboards/ProjectControls/Other/Equipment';


function App() {
  return (
    <LegacyAuthWrapper>
      <Router>
        <AuthChecker>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={<HomePage />} />
            
            {/* Project Controls Routes */}
            <Route path="/project-controls" element={<ProjectControlsDashboards />} />
            <Route path="/project-controls/pab" element={<PABDashboard />} />
            <Route path="/project-controls/amt" element={<AMTDashboard />} />
            <Route path="/project-controls/amt/:id" element={<AMTDetailPage />} />
            <Route path="/project-controls/amt/budget" element={<BudgetTracking />} />
            <Route path="/project-controls/systems" element={<SystemsDashboard />} />
            <Route path="/project-controls/staff-numbers" element={<StaffNumbers2Dashboard />} />
            <Route path="/project-controls/staff-fte" element={<StaffFTEDashboard />} />
            <Route path="/project-controls/staff-movement" element={<StaffMovementDashboard />} />
            <Route path="/project-controls/time-logs" element={<TimeLogsDashboard />} />
            <Route path="/project-controls/commercial/earned-value" element={<EarnedValueSummary />} />
            <Route path="/project-controls/sustainability" element={<SustainabilityDashboard />} />
            <Route path="/project-controls/sustainability/:id" element={<SustainabilityDetailPage />} />
            <Route path="/project-controls/emissions" element={<EmissionsTracking />} />
            <Route path="/project-controls/consenting" element={<ConsentingDashboard />} />
            
            {/* Geotechnical Routes */}
            <Route path="/geotechnical" element={<GeotechnicalTests />} />
            <Route path="/geotechnical/spt" element={<GeoDashboardSPT />} />

            {/* Environmental Routes */}
            <Route path="/environmental" element={<EnvironmentalTests />} />
            {/* <Route path="/environmental/sensors/dust" element={<DustMonitoring />} /> */}
            <Route path="/project-controls/equipment" element={<EquipmentStatus />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthChecker>
      </Router>
    </LegacyAuthWrapper>
  );
}

export default App;
