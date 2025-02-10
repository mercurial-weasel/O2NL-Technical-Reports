import { O2NL_Staff } from './types';
import { MonthColumn } from '../../components/Dashboards/ProjectControls/StaffFTE/types';

// FTE Summary Types
export interface OrgSummary {
  org: string;
  totals: { [key: string]: number };
}

export interface DisciplineSummary {
  discipline: string;
  totals: { [key: string]: number };
}

export interface NOPTypeSummary {
  nopType: string;
  totals: { [key: string]: number };
}

export interface FTESummary {
  orgSummaries: OrgSummary[];
  disciplineSummaries: DisciplineSummary[];
  nopTypeSummaries: NOPTypeSummary[];
  grandTotal: { [key: string]: number };
}

// Staff Numbers Types
export interface UserSummary {
  org: string;
  userCounts: { [key: string]: number };
}

export interface DisciplineUserSummary {
  discipline: string;
  userCounts: { [key: string]: number };
}

export interface NOPTypeUserSummary {
  nopType: string;
  userCounts: { [key: string]: number };
}

export interface UserSummaries {
  orgSummaries: UserSummary[];
  disciplineSummaries: DisciplineUserSummary[];
  nopTypeSummaries: NOPTypeUserSummary[];
  totalUsers: { [key: string]: number };
  dateRange: {
    startDate: Date;
    endDate: Date;
    months: string[];
  };
}

// FTE Calculations
export function calculateFTESummaries(data: O2NL_Staff[], monthColumns: MonthColumn[]): FTESummary {
  // Initialize maps for each type of summary
  const orgMap = new Map<string, { [key: string]: number }>();
  const disciplineMap = new Map<string, { [key: string]: number }>();
  const nopTypeMap = new Map<string, { [key: string]: number }>();
  const grandTotal: { [key: string]: number } = {};

  // Initialize grand total for each month
  monthColumns.forEach(month => {
    grandTotal[month.key] = 0;
  });

  // Process each staff member
  data.forEach(staff => {
    // Get or create organization totals
    if (!orgMap.has(staff.Org)) {
      orgMap.set(staff.Org, {});
      monthColumns.forEach(month => {
        orgMap.get(staff.Org)![month.key] = 0;
      });
    }

    // Get or create discipline totals
    if (!disciplineMap.has(staff.Team)) {
      disciplineMap.set(staff.Team, {});
      monthColumns.forEach(month => {
        disciplineMap.get(staff.Team)![month.key] = 0;
      });
    }

    // Get or create NOP type totals
    if (!nopTypeMap.has(staff.NOPType)) {
      nopTypeMap.set(staff.NOPType, {});
      monthColumns.forEach(month => {
        nopTypeMap.get(staff.NOPType)![month.key] = 0;
      });
    }

    // Calculate totals for each month
    monthColumns.forEach(month => {
      const fte = staff[month.key as keyof O2NL_Staff] as number || 0;
      
      // Add to organization totals
      orgMap.get(staff.Org)![month.key] += fte;
      
      // Add to discipline totals
      disciplineMap.get(staff.Team)![month.key] += fte;
      
      // Add to NOP type totals
      nopTypeMap.get(staff.NOPType)![month.key] += fte;
      
      // Add to grand total
      grandTotal[month.key] += fte;
    });
  });

  // Convert maps to arrays and sort
  const orgSummaries = Array.from(orgMap.entries())
    .map(([org, totals]) => ({ org, totals }))
    .sort((a, b) => a.org.localeCompare(b.org));

  const disciplineSummaries = Array.from(disciplineMap.entries())
    .map(([discipline, totals]) => ({ discipline, totals }))
    .sort((a, b) => a.discipline.localeCompare(b.discipline));

  const nopTypeSummaries = Array.from(nopTypeMap.entries())
    .map(([nopType, totals]) => ({ nopType, totals }))
    .sort((a, b) => a.nopType.localeCompare(b.nopType));

  return {
    orgSummaries,
    disciplineSummaries,
    nopTypeSummaries,
    grandTotal
  };
}

// Staff Numbers Calculations
export function calculateNumberUsersSummaries(data: O2NL_Staff[]): UserSummaries {
  // Initialize maps for each type of summary
  const orgMap = new Map<string, { [key: string]: number }>();
  const disciplineMap = new Map<string, { [key: string]: number }>();
  const nopTypeMap = new Map<string, { [key: string]: number }>();
  const totalUsers: { [key: string]: number } = {};

  // Find date range
  const dates = data.flatMap(record => [
    new Date(record.RequiredStart),
    new Date(record.RequiredFinish)
  ]).filter(date => !isNaN(date.getTime()));

  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Generate array of months between start and end dates
  const months: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push(currentDate.toISOString().slice(0, 7)); // YYYY-MM format
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Initialize counters for each month
  months.forEach(month => {
    totalUsers[month] = 0;
  });

  // Process each staff member
  data.forEach(staff => {
    const startDate = new Date(staff.RequiredStart);
    const endDate = new Date(staff.RequiredFinish);

    // Skip if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }

    // Initialize organization counters if not exists
    if (!orgMap.has(staff.Org)) {
      orgMap.set(staff.Org, {});
      months.forEach(month => {
        orgMap.get(staff.Org)![month] = 0;
      });
    }

    // Initialize discipline counters if not exists
    if (!disciplineMap.has(staff.Team)) {
      disciplineMap.set(staff.Team, {});
      months.forEach(month => {
        disciplineMap.get(staff.Team)![month] = 0;
      });
    }

    // Initialize NOP type counters if not exists
    if (!nopTypeMap.has(staff.NOPType)) {
      nopTypeMap.set(staff.NOPType, {});
      months.forEach(month => {
        nopTypeMap.get(staff.NOPType)![month] = 0;
      });
    }

    // Count active users for each month
    months.forEach(month => {
      const monthDate = new Date(month + '-01');
      const isActive = monthDate >= startDate && monthDate <= endDate;

      if (isActive) {
        orgMap.get(staff.Org)![month]++;
        disciplineMap.get(staff.Team)![month]++;
        nopTypeMap.get(staff.NOPType)![month]++;
        totalUsers[month]++;
      }
    });
  });

  // Convert maps to arrays and sort
  const orgSummaries = Array.from(orgMap.entries())
    .map(([org, userCounts]) => ({ org, userCounts }))
    .sort((a, b) => a.org.localeCompare(b.org));

  const disciplineSummaries = Array.from(disciplineMap.entries())
    .map(([discipline, userCounts]) => ({ discipline, userCounts }))
    .sort((a, b) => a.discipline.localeCompare(b.discipline));

  const nopTypeSummaries = Array.from(nopTypeMap.entries())
    .map(([nopType, userCounts]) => ({ nopType, userCounts }))
    .sort((a, b) => a.nopType.localeCompare(b.nopType));

  return {
    orgSummaries,
    disciplineSummaries,
    nopTypeSummaries,
    totalUsers,
    dateRange: {
      startDate,
      endDate,
      months
    }
  };
}

// Helper function to get active users for a specific month
export function getActiveUsersForMonth(data: O2NL_Staff[], month: string): O2NL_Staff[] {
  const monthDate = new Date(month + '-01');
  
  return data.filter(record => {
    const startDate = new Date(record.RequiredStart);
    const endDate = new Date(record.RequiredFinish);
    
    // Skip invalid dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    
    return monthDate >= startDate && monthDate <= endDate;
  });
}

// Helper function to get user count by organization for a specific month
export function getUserCountByOrg(data: O2NL_Staff[], month: string): Map<string, number> {
  const activeUsers = getActiveUsersForMonth(data, month);
  const orgCounts = new Map<string, number>();

  activeUsers.forEach(user => {
    const org = user.Org;
    orgCounts.set(org, (orgCounts.get(org) || 0) + 1);
  });

  return orgCounts;
}