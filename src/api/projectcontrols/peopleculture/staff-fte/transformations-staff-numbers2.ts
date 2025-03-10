import { O2NL_Staff } from './types';
import { logger } from '@lib/logger';

// Interface for active staff counts
export interface ActiveStaff {
  activeCount: number;
  staffNames: Array<{
    name: string;
    projectRoleTitle: string;
  }>;
  staffTitles: string[]; // Added new field for titles only
}

// Category movement interfaces
export interface CategoryStaff {
  name: string;
  staffCounts: { [month: string]: ActiveStaff };
}

export interface StaffSummary {
  organizations: CategoryStaff[];
  disciplines: CategoryStaff[];
  nopTypes: CategoryStaff[];
  total: { [month: string]: ActiveStaff };
  months: string[];
}

export function calculateStaffNumbers(data: O2NL_Staff[]): StaffSummary {
  // Find date range from the data
  const dates = data.flatMap(record => [
    new Date(record.Required_Start),
    new Date(record.Required_Finish)
  ]).filter(date => !isNaN(date.getTime()));

  //const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const startDate = new Date(2024, 0, 1); // January 1, 2024
  
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  logger.info('Date range calculated', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });

  // Generate array of months between start and end dates
  const months: string[] = [];
  const currentDate = new Date(startDate);
  currentDate.setDate(1); // Set to first of month

  while (currentDate <= endDate) {
    months.push(currentDate.toISOString().slice(0, 7)); // YYYY-MM format
    currentDate.setDate(1); // Ensure it's the first of the month
    currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
}


  
  logger.info('Generated months array', { months });

  // Initialize maps for each type of summary
  const orgMap = new Map<string, { [month: string]: ActiveStaff }>();
  const disciplineMap = new Map<string, { [month: string]: ActiveStaff }>();
  const nopTypeMap = new Map<string, { [month: string]: ActiveStaff }>();
  const totalStaff: { [month: string]: ActiveStaff } = {};

  // Initialize total staff counts for each month
  months.forEach(month => {
    totalStaff[month] = { activeCount: 0, staffNames: [], staffTitles: [] };
  });

  // Process each staff member
  data.forEach(staff => {
    const startDate = new Date(staff.Required_Start);
    const endDate = new Date(staff.Required_Finish);

    // Skip if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }

    // Initialize maps if needed
    if (!orgMap.has(staff.Org)) {
      orgMap.set(staff.Org, {});
      months.forEach(month => {
        orgMap.get(staff.Org)![month] = { activeCount: 0, staffNames: [], staffTitles: [] };
      });
    }

    if (!disciplineMap.has(staff.Team)) {
      disciplineMap.set(staff.Team, {});
      months.forEach(month => {
        disciplineMap.get(staff.Team)![month] = { activeCount: 0, staffNames: [], staffTitles: [] };
      });
    }

    if (!nopTypeMap.has(staff.NOP_Type)) {
      nopTypeMap.set(staff.NOP_Type, {});
      months.forEach(month => {
        nopTypeMap.get(staff.NOP_Type)![month] = { activeCount: 0, staffNames: [], staffTitles: [] };
      });
    }

    // Check each month if staff member is active
    months.forEach(monthStr => {
      const month = new Date(monthStr + '-01');
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      if (startDate <= monthEnd && endDate >= month) {
        // Add to organization counts
        const orgCounts = orgMap.get(staff.Org)![monthStr];
        orgCounts.activeCount++;
        orgCounts.staffNames.push({
          name: staff.Name,
          projectRoleTitle: staff.Project_Role_Title
        });
        orgCounts.staffTitles.push(staff.Project_Role_Title);

        // Add to discipline counts
        const disciplineCounts = disciplineMap.get(staff.Team)![monthStr];
        disciplineCounts.activeCount++;
        disciplineCounts.staffNames.push({
          name: staff.Name,
          projectRoleTitle: staff.Project_Role_Title
        });
        disciplineCounts.staffTitles.push(staff.Project_Role_Title);

        // Add to NOP type counts
        const nopTypeCounts = nopTypeMap.get(staff.NOP_Type)![monthStr];
        nopTypeCounts.activeCount++;
        nopTypeCounts.staffNames.push({
          name: staff.Name,
          projectRoleTitle: staff.Project_Role_Title
        });
        nopTypeCounts.staffTitles.push(staff.Project_Role_Title);

        // Add to total counts
        totalStaff[monthStr].activeCount++;
        totalStaff[monthStr].staffNames.push({
          name: staff.Name,
          projectRoleTitle: staff.Project_Role_Title
        });
        totalStaff[monthStr].staffTitles.push(staff.Project_Role_Title);
      }
    });
  });

  // Convert maps to sorted arrays
  const organizations = Array.from(orgMap.entries())
    .map(([name, staffCounts]) => ({ name, staffCounts }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const disciplines = Array.from(disciplineMap.entries())
    .map(([name, staffCounts]) => ({ name, staffCounts }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const nopTypes = Array.from(nopTypeMap.entries())
    .map(([name, staffCounts]) => ({ name, staffCounts }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Log summary statistics
  // logger.info('Staff numbers summary:', {
  //   totalMonths: months.length,
  //   organizations: organizations.map(org => ({
  //     name: org.name,
  //     counts: Object.entries(org.staffCounts).map(([month, data]) => ({
  //       month,
  //       activeCount: data.activeCount,
  //       staffCount: data.staffNames.length
  //     }))
  //   }))
  // });

  return {
    organizations,
    disciplines,
    nopTypes,
    total: totalStaff,
    months
  };
}