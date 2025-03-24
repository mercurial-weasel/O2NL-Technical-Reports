// Environmental Dashboards
//export { EnvironmentalTests } from './Environmental';
// Remove or comment out this line since the component has moved
// export { DustMonitoring } from './Environmental/sensors/dust';

// Updated imports for environmental components that have been moved
import * as EnvironmentalComponents from '@features/environmental';

// Re-export for backward compatibility if needed
export const Environmental = {
  sensors: {
    dust: EnvironmentalComponents
  }
};

// Geotechnical Dashboards
//export { GeotechnicalTests } from './Geotechnical';
export { GeoDashboardSPT } from './Geo';

// Project Controls Dashboards
//export { ProjectControlsDashboards } from './ProjectControls';
export {  BudgetTracking, 
          EarnedValueSummary } from './ProjectControls/Commercial';


export { AMTDashboard, AMTDetailPage, 
        SystemsDashboard, 
        ProjectMilestones, 
        PABDashboard, 
        SustainabilityDashboard, SustainabilityDetailPage,  
        ConsentingDashboard } from './ProjectControls/Programme';

        // Export Other ProjectControls components
export {  EmissionsTracking, 
  EquipmentStatus, 
  SustainabilityInitiatives } from './ProjectControls/Other';

  
export { StaffNumbersDashboard, StaffFTEDashboard, StaffMovementDashboard, TimeLogsDashboard } from './ProjectControls/PeopleCulture';

