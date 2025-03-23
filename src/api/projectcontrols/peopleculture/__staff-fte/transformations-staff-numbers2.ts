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
    new Date(record.requiredStart),
    new Date(record.requiredFinish)
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
    const startDate = new Date(staff.requiredStart);
    const endDate = new Date(staff.requiredFinish);

    // Skip if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }

    // Initialize maps if needed
    if (!orgMap.has(staff.org)) {
      orgMap.set(staff.org, {});
      months.forEach(month => {
        orgMap.get(staff.org)![month] = { activeCount: 0, staffNames: [], staffTitles: [] };
      });
    }

    if (!disciplineMap.has(staff.team)) {
      disciplineMap.set(staff.team, {});
      months.forEach(month => {
        disciplineMap.get(staff.team)![month] = { activeCount: 0, staffNames: [], staffTitles: [] };
      });
    }

    if (!nopTypeMap.has(staff.nopType)) {
      nopTypeMap.set(staff.nopType, {});
      months.forEach(month => {
        nopTypeMap.get(staff.nopType)![month] = { activeCount: 0, staffNames: [], staffTitles: [] };
      });
    }

    // Check each month if staff member is active
    months.forEach(monthStr => {
      const month = new Date(monthStr + '-01');
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      if (startDate <= monthEnd && endDate >= month) {
        // Add to organization counts
        const orgCounts = orgMap.get(staff.org)![monthStr];
        orgCounts.activeCount++;
        orgCounts.staffNames.push({
          name: staff.name,
          projectRoleTitle: staff.projectRoleTitle
        });
        orgCounts.staffTitles.push(staff.projectRoleTitle);

        // Add to discipline counts
        const disciplineCounts = disciplineMap.get(staff.team)![monthStr];
        disciplineCounts.activeCount++;
        disciplineCounts.staffNames.push({
          name: staff.name,
          projectRoleTitle: staff.projectRoleTitle
        });
        disciplineCounts.staffTitles.push(staff.projectRoleTitle);

        // Add to NOP type counts
        const nopTypeCounts = nopTypeMap.get(staff.nopType)![monthStr];
        nopTypeCounts.activeCount++;
        nopTypeCounts.staffNames.push({
          name: staff.name,
          projectRoleTitle: staff.projectRoleTitle
        });
        nopTypeCounts.staffTitles.push(staff.projectRoleTitle);

        // Add to total counts
        totalStaff[monthStr].activeCount++;
        totalStaff[monthStr].staffNames.push({
          name: staff.name,
          projectRoleTitle: staff.projectRoleTitle
        });
        totalStaff[monthStr].staffTitles.push(staff.projectRoleTitle);
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

  return {
    organizations,
    disciplines,
    nopTypes,
    total: totalStaff,
    months
  };
}