import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
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
import { TimeLogsDashboard } from './components/Dashboards/P+C/TimeLogs';
import { EarnedValueSummary } from './components/Dashboards/ProjectControls/Commercial/EarnedValue/EarnedValueSummary';
import { SustainabilityInitiatives } from './components/Dashboards/ProjectControls/SustainabilityInitiatives';
import { SustainabilityTracking } from './components/Dashboards/ProjectControls/SustainabilityTracking';
import { ConsentingDashboard } from './components/Dashboards/ProjectControls/Consenting';
import { GeoDashboardSPT } from './components/Dashboards/Geo';
import { EquipmentStatus } from './components/Dashboards/ProjectControls/Equipment';
import { DustMonitoring } from './components/Dashboards/Environmental/sensors/dust';
import { routeConfig, getRequiredAccessRights } from './routes/accessControl';

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
              <SustainabilityInitiatives />
            </ProtectedRoute>
          } />
          
          <Route path="/project-controls/sustainability-tracking" element={
            <ProtectedRoute requiredAccess={getRequiredAccessRights('/project-controls/sustainability-tracking')}>
              <SustainabilityTracking />
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

          <Route path="/environmental/sensors/dust" element={
            <ProtectedRoute>
              <DustMonitoring />
            </ProtectedRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App2;