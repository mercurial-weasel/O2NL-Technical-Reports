import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@lib/auth';
import { ProtectedRoute } from '@components/Authentication/ProtectedRoute';
import { LoginPage } from '@components/Authentication/LoginPage';
import HomeTest from '@components/HomeTest';
import { GeotechnicalTests } from '@components/DisciplineDashboards/Geotechnical';
import { EnvironmentalTests } from '@components/DisciplineDashboards/Environmental';
import { ProjectControlsDashboards } from '@components/DisciplineDashboards/ProjectControls';
import { ProjectMilestones } from '@dashboards/ProjectControls/Milestones';
import { PABDashboard } from '@dashboards/ProjectControls/PAB';
import { AMTDashboard, AMTDetailPage, BudgetTracking } from '@dashboards/ProjectControls/AMT';
import { SystemsDashboard } from '@dashboards/ProjectControls/Systems';
import { StaffNumbers } from '@dashboards/ProjectControls/P+C';
import { StaffFTEDashboard } from '@dashboards/ProjectControls/StaffFTE';
import { StaffMovementDashboard } from '@dashboards/ProjectControls/P+C/StaffMovement';
import { TimeLogsDashboard } from '@dashboards/P+C/TimeLogs';
import { EarnedValueSummary } from '@dashboards/ProjectControls/Commercial/EarnedValue/EarnedValueSummary';
import { EmissionsTracking } from '@dashboards/ProjectControls/EmissionsTracking';
import { ConsentingDashboard } from '@dashboards/ProjectControls/Consenting';
import { GeoDashboardSPT } from '@dashboards/Geo';
import { EquipmentStatus } from '@dashboards/ProjectControls/Equipment';
//import { DustMonitoring } from '@environmental_dust'; // Fixed import path
import { getRequiredAccessRights } from '@routes/accessControl';
import { SustainabilityDashboard, SustainabilityDetailPage } from '@dashboards/ProjectControls/Sustainability';

function App2() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomeTest />
            </ProtectedRoute>
          } />
          
          {/* Project Controls Routes */}
          <Route path="/project-controls" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls')}>
              <ProjectControlsDashboards />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/pab" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/pab')}>
              <PABDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/amt" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/amt')}>
              <AMTDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/amt/:id" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/amt')}>
              <AMTDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/amt/budget" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/amt/budget')}>
              <BudgetTracking />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/systems" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/systems')}>
              <SystemsDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/staff-numbers" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/staff-numbers')}>
              <StaffNumbers />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/staff-fte" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/staff-fte')}>
              <StaffFTEDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/staff-movement" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/staff-movement')}>
              <StaffMovementDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/time-logs" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/time-logs')}>
              <TimeLogsDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/commercial/earned-value" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/commercial/earned-value')}>
              <EarnedValueSummary />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/sustainability" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/sustainability')}>
              <SustainabilityDashboard />
            </ProtectedRoute>
          } />

          <Route path="/project-controls/sustainability/:id" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/sustainability/:id')}>
              <SustainabilityDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/emissions" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/emissions')}>
              <EmissionsTracking />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/consenting" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/consenting')}>
              <ConsentingDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/equipment" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/equipment')}>
              <EquipmentStatus />
            </ProtectedRoute>
          } />
          
          {/* Geotechnical Routes */}
          <Route path="/geotechnical" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/geotechnical')}>
              <GeotechnicalTests />
            </ProtectedRoute>
          } />
          
          <Route path="/geotechnical/spt" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/geotechnical/spt')}>
              <GeoDashboardSPT />
            </ProtectedRoute>
          } />
          
          {/* Environmental Routes */}
          <Route path="/environmental" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/environmental')}>
              <EnvironmentalTests />
            </ProtectedRoute>
          } />

          {/* <Route path="/environmental/sensors/dust" element={
            <ProtectedRoute>
              <DustMonitoring />
            </ProtectedRoute>
          } /> */}
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App2;