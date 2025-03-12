import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@common/Spinner/Spinner';

// Lazy load dashboard components
const GeotechnicalTests = React.lazy(() => import('@components/DashboardGroups/Geotechnical/GeotechnicalTests'));
const SPTDashboard = React.lazy(() => import('@components/Dashboards/Geo/SPT'));
const PSDDashboard = React.lazy(() => import('@components/Dashboards/Geo/PSD'));
const MDDDashboard = React.lazy(() => import('@components/Dashboards/Geo/MDD'));

const GeotechnicalRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<Spinner fullPage />}>
      <Routes>
        <Route index element={<GeotechnicalTests />} />
        <Route path="spt" element={<SPTDashboard />} />
        <Route path="psd" element={<PSDDashboard />} />
        <Route path="mdd" element={<MDDDashboard />} />
        <Route path="*" element={<Navigate to="/geotechnical" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default GeotechnicalRoutes;
