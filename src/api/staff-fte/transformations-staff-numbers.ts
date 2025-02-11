import { O2NL_Staff } from './types';

// Staff Numbers Types
export interface UserSummary {
  org: string;
  userCounts: { [key: string]: number };
  monthlyMovement: {
    [month: string]: {
      onboarded: number;
      offboarded: number;
      net: number;
    };
  };
}

export interface DisciplineUserSummary {
  discipline: string;
  userCounts: { [key: string]: number };
  monthlyMovement: {
    [month: string]: {
      onboarded: number;
      offboarded: number;
      net: number;
    };
  };
}

export interface NOPTypeUserSummary {
  nopType: string;
  userCounts: { [key: string]: number };
  monthlyMovement: {
    [month: string]: {
      onboarded: number;
      offboarded: number;
      net: number;
    };
  };
}

export interface UserSummaries {
  orgSummaries: UserSummary[];
  disciplineSummaries: DisciplineUserSummary[];
  nopTypeSummaries: NOPTypeUserSummary[];
  totalUsers: { [key: string]: number };
  totalMovement: {
    [month: string]: {
      onboarded: number;
      offboarded: number;
      net: number;
    };
  };
  dateRange: {
    startDate: Date;
    endDate: Date;
    months: string[];
  };
}

export function calculateNumberUsersSummaries(data: O2NL_Staff[]): UserSummaries {
  // Initialize maps for each type of summary
  const orgMap = new Map<string, UserSummary>();
  const disciplineMap = new Map<string, DisciplineUserSummary>();
  const nopTypeMap = new Map<string, NOPTypeUserSummary>();
  const totalUsers: { [key: string]: number } = {};
  const totalMovement: { [key: string]: { onboarded: number; offboarded: number; net: number } } = {};

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
    totalMovement[month] = {
      onboarded: 0,
      offboarded: 0,
      net: 0
    };
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
      orgMap.set(staff.Org, {
        org: staff.Org,
        userCounts: {},
        monthlyMovement: {}
      });
      months.forEach(month => {
        orgMap.get(staff.Org)!.userCounts[month] = 0;
        orgMap.get(staff.Org)!.monthlyMovement[month] = {
          onboarded: 0,
          offboarded: 0,
          net: 0
        };
      });
    }

    // Initialize discipline counters if not exists
    if (!disciplineMap.has(staff.Team)) {
      disciplineMap.set(staff.Team, {
        discipline: staff.Team,
        userCounts: {},
        monthlyMovement: {}
      });
      months.forEach(month => {
        disciplineMap.get(staff.Team)!.userCounts[month] = 0;
        disciplineMap.get(staff.Team)!.monthlyMovement[month] = {
          onboarded: 0,
          offboarded: 0,
          net: 0
        };
      });
    }

    // Initialize NOP type counters if not exists
    if (!nopTypeMap.has(staff.NOPType)) {
      nopTypeMap.set(staff.NOPType, {
        nopType: staff.NOPType,
        userCounts: {},
        monthlyMovement: {}
      });
      months.forEach(month => {
        nopTypeMap.get(staff.NOPType)!.userCounts[month] = 0;
        nopTypeMap.get(staff.NOPType)!.monthlyMovement[month] = {
          onboarded: 0,
          offboarded: 0,
          net: 0
        };
      });
    }

    // Count active users and track movement for each month
    months.forEach(month => {
      const monthDate = new Date(month + '-01');
      const isActive = monthDate >= startDate && monthDate <= endDate;
      const isStartMonth = monthDate.getMonth() === startDate.getMonth() && 
                          monthDate.getFullYear() === startDate.getFullYear();
      const isEndMonth = monthDate.getMonth() === endDate.getMonth() && 
                        monthDate.getFullYear() === endDate.getFullYear();

      if (isActive) {
        // Update user counts
        orgMap.get(staff.Org)!.userCounts[month]++;
        disciplineMap.get(staff.Team)!.userCounts[month]++;
        nopTypeMap.get(staff.NOPType)!.userCounts[month]++;
        totalUsers[month]++;

        // Track onboarding
        if (isStartMonth) {
          orgMap.get(staff.Org)!.monthlyMovement[month].onboarded++;
          disciplineMap.get(staff.Team)!.monthlyMovement[month].onboarded++;
          nopTypeMap.get(staff.NOPType)!.monthlyMovement[month].onboarded++;
          totalMovement[month].onboarded++;
        }

        // Track offboarding
        if (isEndMonth) {
          orgMap.get(staff.Org)!.monthlyMovement[month].offboarded++;
          disciplineMap.get(staff.Team)!.monthlyMovement[month].offboarded++;
          nopTypeMap.get(staff.NOPType)!.monthlyMovement[month].offboarded++;
          totalMovement[month].offboarded++;
        }
      }
    });
  });

  // Calculate net movement for all categories
  months.forEach(month => {
    // Organizations
    orgMap.forEach(org => {
      org.monthlyMovement[month].net = 
        org.monthlyMovement[month].onboarded - org.monthlyMovement[month].offboarded;
    });

    // Disciplines
    disciplineMap.forEach(discipline => {
      discipline.monthlyMovement[month].net = 
        discipline.monthlyMovement[month].onboarded - discipline.monthlyMovement[month].offboarded;
    });

    // NOP Types
    nopTypeMap.forEach(nopType => {
      nopType.monthlyMovement[month].net = 
        nopType.monthlyMovement[month].onboarded - nopType.monthlyMovement[month].offboarded;
    });

    // Totals
    totalMovement[month].net = 
      totalMovement[month].onboarded - totalMovement[month].offboarded;
  });

  // Convert maps to sorted arrays
  const orgSummaries = Array.from(orgMap.values())
    .sort((a, b) => a.org.localeCompare(b.org));

  const disciplineSummaries = Array.from(disciplineMap.values())
    .sort((a, b) => a.discipline.localeCompare(b.discipline));

  const nopTypeSummaries = Array.from(nopTypeMap.values())
    .sort((a, b) => a.nopType.localeCompare(b.nopType));

  return {
    orgSummaries,
    disciplineSummaries,
    nopTypeSummaries,
    totalUsers,
    totalMovement,
    dateRange: {
      startDate,
      endDate,
      months
    }
  };
}

// Helper functions
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

export function getUserCountByOrg(data: O2NL_Staff[], month: string): Map<string, number> {
  const activeUsers = getActiveUsersForMonth(data, month);
  const orgCounts = new Map<string, number>();

  activeUsers.forEach(user => {
    const org = user.Org;
    orgCounts.set(org, (orgCounts.get(org) || 0) + 1);
  });

  return orgCounts;
}