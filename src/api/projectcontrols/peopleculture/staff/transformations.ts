import { StaffMember, StaffData, StaffSummary, MonthlyFTEData } from './types';

/**
 * Calculates the duration between required start and finish dates
 */
function calculateDuration(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Formats staff member data for display
 */
export function formatStaffMember(staffMember: StaffMember): StaffMember {
  return {
    ...staffMember,
    // Add any specific formatting if needed
  };
}

/**
 * Creates a summary view of staff data for display in tables or lists
 */
export function createStaffSummary(staffMember: StaffMember): StaffSummary {
  const startDate = new Date(staffMember.requiredStart);
  const endDate = new Date(staffMember.requiredFinish);
  
  return {
    id: staffMember.id,
    name: staffMember.name,
    disciplineManager: staffMember.disciplineManager,
    team: staffMember.team,
    location: staffMember.location,
    projectRoleTitle: staffMember.projectRoleTitle,
    status: staffMember.status,
    fteAve: staffMember.fteAve,
    requiredStart: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    requiredFinish: endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    duration: calculateDuration(startDate, endDate)
  };
}

/**
 * Creates summaries for all staff members
 */
export function createStaffSummaries(staffData: StaffData): StaffSummary[] {
  return staffData.map(staff => createStaffSummary(staff));
}

/**
 * Calculates total FTE by month across all staff members
 */
export function calculateTotalFTEByMonth(staffData: StaffData): { month: string; totalFTE: number }[] {
  const monthlyTotals = new Map<string, number>();
  
  staffData.forEach(staff => {
    if (Array.isArray(staff.monthlyFTE)) {
      staff.monthlyFTE.forEach((monthData: MonthlyFTEData) => {
        const month = monthData.month;
        const currentTotal = monthlyTotals.get(month) || 0;
        monthlyTotals.set(month, currentTotal + monthData.fte);
      });
    }
  });
  
  // Convert map to array and sort by month
  return Array.from(monthlyTotals.entries())
    .map(([month, totalFTE]) => ({ month, totalFTE }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Groups staff members by team and calculates team statistics
 */
export function groupStaffByTeam(staffData: StaffData): { team: string; count: number; averageFTE: number; members: StaffSummary[] }[] {
  const teamMap = new Map<string, StaffMember[]>();
  
  // Group staff by team
  staffData.forEach(staff => {
    if (!teamMap.has(staff.team)) {
      teamMap.set(staff.team, []);
    }
    teamMap.get(staff.team)?.push(staff);
  });
  
  // Create team summaries
  return Array.from(teamMap.entries()).map(([team, members]) => {
    const totalFTE = members.reduce((sum, staff) => sum + staff.fteAve, 0);
    const averageFTE = members.length > 0 ? totalFTE / members.length : 0;
    
    return {
      team,
      count: members.length,
      averageFTE,
      members: members.map(member => createStaffSummary(member))
    };
  });
}
