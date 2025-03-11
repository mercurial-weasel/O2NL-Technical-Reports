import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ClerkLoginPage } from '@components/Authentication/LoginPage/ClerkLoginPage';
import { ClerkRegisterPage } from '@components/Authentication/RegisterPage/ClerkRegisterPage';
import { useAuth } from '@clerk/clerk-react';

// Import components directly from their source locations
import { HomeTest } from '@home/HomeTest'; 

import { ProjectControlsDashboards } from '@dashboardGroups/ProjectControls';
'@dashboards/ProjectControls';
import { StaffFTEDashboard } from '@dashboards/ProjectControls/PeopleCulture/StaffFTE';


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
        
        {/* Protected routes */}
        <Route 
          path="/project-controls" 
          element={
            <ProtectedRoute>
              <ProjectControlsDashboards />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/project-controls/staff-fte" 
          element={
            <ProtectedRoute>
              <StaffFTEDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Add similar protection to other routes that require authentication */}
      </Routes>
    </BrowserRouter>
  );
}