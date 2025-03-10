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
export { ProjectMilestones } from './ProjectControls/Milestones';
export { PABDashboard } from './ProjectControls/PAB';
export { AMTDashboard, AMTDetailPage, BudgetTracking } from './ProjectControls/AMT';
export { SystemsDashboard } from './ProjectControls/Systems';
export { StaffNumbers } from './ProjectControls/P+C';
export { StaffFTEDashboard } from './ProjectControls/StaffFTE';
export { StaffChart } from './ProjectControls/P+C/StaffComponents/StaffChart';
export { StaffMovementDashboard } from './ProjectControls/P+C/StaffMovement';
//export { TimeLogsDashboard } from './ProjectControls/P+C/TimeLogs';
export { EarnedValueSummary } from './ProjectControls/Commercial/EarnedValue/EarnedValueSummary';
export { SustainabilityInitiatives } from './ProjectControls/SustainabilityInitiatives';
export { EmissionsTracking } from './ProjectControls/EmissionsTracking';
export { ConsentingDashboard } from './ProjectControls/Consenting';
export { EquipmentStatus } from './ProjectControls/Equipment';
export { SustainabilityDashboard, SustainabilityDetailPage } from './ProjectControls/Sustainability';