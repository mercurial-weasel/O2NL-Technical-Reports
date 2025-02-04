import { O2NL_Staff } from './types';
import { MonthColumn } from '../../components/Dashboards/ProjectControls/StaffFTE/types';


export interface OrgSummary {
  org: string;
  totals: { [key: string]: number };
}

export interface FTESummary {
  orgSummaries: OrgSummary[];
  grandTotal: { [key: string]: number };
}

export function calculateFTESummaries(data: O2NL_Staff[], monthColumns: MonthColumn[]): FTESummary {
  const orgSummaries = new Map<string, { [key: string]: number }>();
  const grandTotal: { [key: string]: number } = {};

  // Initialize totals
  monthColumns.forEach(month => {
    grandTotal[month.key] = 0;
  });

  // Calculate totals by organization
  data.forEach(item => {
    const org = item.Org;
    if (!orgSummaries.has(org)) {
      orgSummaries.set(org, {});
      monthColumns.forEach(month => {
        orgSummaries.get(org)![month.key] = 0;
      });
    }

    monthColumns.forEach(month => {
      const value = item[month.key as keyof O2NL_Staff] as number || 0;
      orgSummaries.get(org)![month.key] += value;
      grandTotal[month.key] += value;
    });
  });

  return {
    orgSummaries: Array.from(orgSummaries.entries())
      .map(([org, totals]) => ({ org, totals }))
      .sort((a, b) => a.org.localeCompare(b.org)),
    grandTotal
  };
}

// Additional helper functions for FTE calculations
export function calculateMonthlyFTE(data: O2NL_Staff[], month: string): number {
  return data.reduce((sum, item) => {
    return sum + (item[month as keyof O2NL_Staff] as number || 0);
  }, 0);
}

export function calculateAverageFTE(data: O2NL_Staff[], months: string[]): number {
  if (months.length === 0) return 0;
  const total = months.reduce((sum, month) => sum + calculateMonthlyFTE(data, month), 0);
  return total / months.length;
}

export function calculatePeakFTE(data: O2NL_Staff[], months: string[]): number {
  return Math.max(...months.map(month => calculateMonthlyFTE(data, month)));
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

export interface UserSummary {
  org: string;
  userCounts: { [key: string]: number };
}

export interface UserSummaries {
  orgSummaries: UserSummary[];
  totalUsers: { [key: string]: number };
  dateRange: {
    startDate: Date;
    endDate: Date;
    months: string[];
  };
}

export function calculateNumberUsersSummaries(data: O2NL_Staff[]): UserSummaries {
  // Initialize result structure
  const orgSummaries = new Map<string, { [key: string]: number }>();
  const totalUsers: { [key: string]: number } = {};

  // Find date range
  const dates = data.flatMap(record => [
    new Date(record.RequiredStart),
    new Date(record.RequiredFinish)
  ]).filter(date => !isNaN(date.getTime())); // Filter out invalid dates

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

  // Process each organization
  data.forEach(record => {
    const org = record.Org;
    const startDate = new Date(record.RequiredStart);
    const endDate = new Date(record.RequiredFinish);

    // Skip if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }

    // Initialize organization counters if not exists
    if (!orgSummaries.has(org)) {
      orgSummaries.set(org, {});
      months.forEach(month => {
        orgSummaries.get(org)![month] = 0;
      });
    }

    // Count active users for each month
    months.forEach(month => {
      const monthDate = new Date(month + '-01');
      const isActive = monthDate >= startDate && monthDate <= endDate;

      if (isActive) {
        orgSummaries.get(org)![month]++;
        totalUsers[month]++;
      }
    });
  });

  return {
    orgSummaries: Array.from(orgSummaries.entries())
      .map(([org, userCounts]) => ({ org, userCounts }))
      .sort((a, b) => a.org.localeCompare(b.org)),
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