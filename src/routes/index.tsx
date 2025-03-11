import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ClerkLoginPage } from '@components/Authentication/LoginPage/ClerkLoginPage';
import { ClerkRegisterPage } from '@components/Authentication/RegisterPage/ClerkRegisterPage';
import { useAuth } from '@clerk/clerk-react';
import { UserRole } from '@lib/roles';

// Import components directly from their source locations
import { HomeTest } from '@home/HomeTest'; 

import { ProjectControlsDashboards } from '@dashboardGroups/ProjectControls';
import { StaffFTEDashboard } from '@dashboards/ProjectControls/PeopleCulture/StaffFTE';
import { UserManagementPage } from '@components/AdminTools/UserManagement/UserManagementPage';

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
  
  // If route is for non-authenticated users but user is signed in, redirect 
  if (!requireAuth && isSignedIn && redirectTo) {
    console.log('AuthAwareRoute: Already authenticated, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  // Otherwise, render the element
  return element;
}

export function AppRoutes() {
  console.log('AppRoutes: Initializing application routes');
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomeTest />} />
        
        {/* Auth routes with redirects for authenticated users */}
        <Route 
          path="/login" 
          element={
            <AuthAwareRoute 
              element={<ClerkLoginPage />} 
              requireAuth={false}
              redirectTo="/dashboard"
            />
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <AuthAwareRoute 
              element={<ClerkRegisterPage />} 
              requireAuth={false}
              redirectTo="/dashboard"
            />
          } 
        />
        
        {/* Protected routes with role requirements */}
        <Route 
          path="/project-controls" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'amt', 'commercial', 'people']}>
              <ProjectControlsDashboards />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/project-controls/staff-fte" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'amt', 'people']}>
              <StaffFTEDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <UserManagementPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Explicit route for admin page access debugging */}
        <Route 
          path="/admin" 
          element={
            <Navigate to="/admin/users" replace />
          } 
        />
        
        {/* Dashboard as fallback route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <HomeTest />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}