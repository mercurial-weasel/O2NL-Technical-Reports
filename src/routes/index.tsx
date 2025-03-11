import { Routes, Route, Navigate } from 'react-router-dom';
import { RBACWrapper } from '@components/Authentication/RBACWrapper';
import { useAuth } from '@clerk/clerk-react';

// Auth Pages
import { ClerkLoginPage } from '@components/Authentication/LoginPage/ClerkLoginPage';
import { ClerkRegisterPage } from '@components/Authentication/RegisterPage/ClerkRegisterPage';

// Public Pages
import HomeTest from '@pages/home/HomeTest';

// Admin components
import { UserManagementPage } from '@components/AdminTools/UserManagement/UserManagementPage';

// Geotechnical & Environmental Dashboards
import { ProjectControlsDashboards } from '@dashboardGroups/ProjectControls';
import { GeotechnicalTests } from '@dashboardGroups/Geotechnical';
import { EnvironmentalTests } from '@dashboardGroups/Environmental';

import GeoDashboardSPT from '@dashboards/Geo/SPT/GeoDashboardSPT';
import GeoDashboardPSD from '@dashboards/Geo/PSD/GeoDashboardPSD';

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

// Auth-aware route component
function AuthAwareRoute({ element, requireAuth, redirectTo }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  console.log('AuthAwareRoute: Evaluating route access', { 
    isLoaded, 
    isSignedIn, 
    requireAuth, 
    redirectTo 
  });
  
  // Wait for auth to load
  if (!isLoaded) return <div>Loading...</div>;
  
  // If route requires auth and user is not signed in, redirect
  if (requireAuth && !isSignedIn) {
    console.log('AuthAwareRoute: Access denied, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  // This condition may be causing the redirect loop - let's fix it
  // Only redirect if we're on a specific auth page, not during the auth flow
  if (!requireAuth && isSignedIn && redirectTo && 
      (location.pathname === '/login' || location.pathname === '/register')) {
    console.log('AuthAwareRoute: Already authenticated, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  // Otherwise, render the element
  return element;
}

export function AppRoutes() {
  console.log('AppRoutes: Initializing application routes');
  
  // FIXED: Removed BrowserRouter wrapper - it's now in App.tsx
  return (
    <Routes>
      {/* Public Routes - Fix login flow */}
      <Route path="/login/*" element={<ClerkLoginPage />} />
      <Route path="/register/*" element={<ClerkRegisterPage />} />
      
      {/* Redirect root to dashboard if authenticated */}
      <Route path="/" element={<HomeTest />} />
      
      {/* Admin routes */}
      <Route path="/admin/users" element={
        <RBACWrapper requiredRoles={['admin']}>
          <UserManagementPage />
        </RBACWrapper>
      } />
      
      {/* Admin redirect route */}
      <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
      
      {/* Project Controls Routes */}
      <Route path="/project-controls" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'commercial', 'people']}>
          <ProjectControlsDashboards />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/pab" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <PABDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/amt" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <AMTDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/amt/:id" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <AMTDetailPage />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/amt/budget" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'commercial']}>
          <BudgetTracking />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/systems" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <SystemsDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/staff-numbers" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'people']}>
          <StaffNumbers2Dashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/staff-fte" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'people']}>
          <StaffFTEDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/staff-movement" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'people']}>
          <StaffMovementDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/time-logs" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <TimeLogsDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/commercial/earned-value" element={
        <RBACWrapper requiredRoles={['admin', 'commercial']}>
          <EarnedValueSummary />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/sustainability" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'commercial']}>
          <SustainabilityDashboard />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/sustainability/:id" element={
        <RBACWrapper requiredRoles={['admin', 'amt', 'commercial']}>
          <SustainabilityDetailPage />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/emissions" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <EmissionsTracking />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/consenting" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <ConsentingDashboard />
        </RBACWrapper>
      } />
      
      {/* Geotechnical Routes */}
      <Route path="/geotechnical" element={
        <RBACWrapper>
          <GeotechnicalTests />
        </RBACWrapper>
      } />
      
      <Route path="/geotechnical/spt" element={
        <RBACWrapper>
          <GeoDashboardSPT />
        </RBACWrapper>
      } />

      {/* Add this new route for PSD dashboard */}
      <Route path="/geotechnical/psd" element={
        <RBACWrapper>
          <GeoDashboardPSD />
        </RBACWrapper>
      } />
      
      {/* Environmental Routes */}
      <Route path="/environmental" element={
        <RBACWrapper>
          <EnvironmentalTests />
        </RBACWrapper>
      } />
      
      <Route path="/project-controls/equipment" element={
        <RBACWrapper requiredRoles={['admin', 'amt']}>
          <EquipmentStatus />
        </RBACWrapper>
      } />
      
      {/* Dashboard as fallback route */}
      <Route path="/dashboard" element={
        <RBACWrapper>
          <HomeTest />
        </RBACWrapper>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}