import { O2NL_Staff } from './types';
import { MonthColumn } from '../../components/Dashboards/ProjectControls/StaffFTE/types';
import { logger } from '@lib/logger';

// Staff member interface to track individual contributors
export interface StaffMember {
  name: string;
  projectRoleTitle: string;
  fte: number;
}

// FTE Summary Types
export interface OrgSummary {
  org: string;
  totals: { [key: string]: number };
  staffMembers: { [key: string]: StaffMember[] }; // Track staff by month
}

export interface DisciplineSummary {
  discipline: string;
  totals: { [key: string]: number };
  staffMembers: { [key: string]: StaffMember[] }; // Track staff by month
}

export interface NOPTypeSummary {
  nopType: string;
  totals: { [key: string]: number };
  staffMembers: { [key: string]: StaffMember[] }; // Track staff by month
}

export interface FTESummary {
  orgSummaries: OrgSummary[];
  disciplineSummaries: DisciplineSummary[];
  nopTypeSummaries: NOPTypeSummary[];
  grandTotal: { [key: string]: number };
  allStaffMembers: { [key: string]: StaffMember[] }; // Track all staff by month
}

export function calculateFTESummaries(data: O2NL_Staff[], monthColumns: MonthColumn[]): FTESummary {
  // Initialize maps for each type of summary
  const orgMap = new Map<string, { 
    totals: { [key: string]: number }, 
    staffMembers: { [key: string]: StaffMember[] } 
  }>();
  
  const disciplineMap = new Map<string, { 
    totals: { [key: string]: number }, 
    staffMembers: { [key: string]: StaffMember[] } 
  }>();
  
  const nopTypeMap = new Map<string, { 
    totals: { [key: string]: number }, 
    staffMembers: { [key: string]: StaffMember[] } 
  }>();
  
  const grandTotal: { [key: string]: number } = {};
  const allStaffMembers: { [key: string]: StaffMember[] } = {};

  // Initialize grand total and staff collection for each month
  monthColumns.forEach(month => {
    grandTotal[month.key] = 0;
    allStaffMembers[month.key] = [];
  });

  // Process each staff member
  data.forEach(staff => {
    // Get or create organization data structure
    if (!orgMap.has(staff.Org)) {
      orgMap.set(staff.Org, { 
        totals: {}, 
        staffMembers: {} 
      });
      monthColumns.forEach(month => {
        orgMap.get(staff.Org)!.totals[month.key] = 0;
        orgMap.get(staff.Org)!.staffMembers[month.key] = [];
      });
    }

    // Get or create discipline data structure
    if (!disciplineMap.has(staff.Team)) {
      disciplineMap.set(staff.Team, { 
        totals: {}, 
        staffMembers: {} 
      });
      monthColumns.forEach(month => {
        disciplineMap.get(staff.Team)!.totals[month.key] = 0;
        disciplineMap.get(staff.Team)!.staffMembers[month.key] = [];
      });
    }

    // Get or create NOP type data structure
    if (!nopTypeMap.has(staff.NOP_Type)) {
      nopTypeMap.set(staff.NOP_Type, { 
        totals: {}, 
        staffMembers: {} 
      });
      monthColumns.forEach(month => {
        nopTypeMap.get(staff.NOP_Type)!.totals[month.key] = 0;
        nopTypeMap.get(staff.NOP_Type)!.staffMembers[month.key] = [];
      });
    }

    // Calculate totals for each month
    monthColumns.forEach(month => {
      const monthKey = month.key as keyof O2NL_Staff;
      const fte = staff[monthKey] as number || 0;
      
      // Only track staff members with non-zero FTE
      if (fte > 0) {
        const staffMember: StaffMember = {
          name: staff.Name,
          projectRoleTitle: staff.Project_Role_Title,
          fte: fte
        };
        
        // Add to organization staffMembers and totals
        orgMap.get(staff.Org)!.totals[month.key] += fte;
        orgMap.get(staff.Org)!.staffMembers[month.key].push(staffMember);
        
        // Add to discipline staffMembers and totals
        disciplineMap.get(staff.Team)!.totals[month.key] += fte;
        disciplineMap.get(staff.Team)!.staffMembers[month.key].push(staffMember);
        
        // Add to NOP type staffMembers and totals
        nopTypeMap.get(staff.NOP_Type)!.totals[month.key] += fte;
        nopTypeMap.get(staff.NOP_Type)!.staffMembers[month.key].push(staffMember);
        
        // Add to grand total and all staff members
        grandTotal[month.key] += fte;
        allStaffMembers[month.key].push(staffMember);
      }
    });
  });

  // Convert maps to sorted arrays
  const orgSummaries = Array.from(orgMap.entries())
    .map(([org, data]) => ({ 
      org, 
      totals: data.totals, 
      staffMembers: data.staffMembers 
    }))
    .sort((a, b) => a.org.localeCompare(b.org));

  const disciplineSummaries = Array.from(disciplineMap.entries())
    .map(([discipline, data]) => ({ 
      discipline, 
      totals: data.totals, 
      staffMembers: data.staffMembers 
    }))
    .sort((a, b) => a.discipline.localeCompare(b.discipline));

  const nopTypeSummaries = Array.from(nopTypeMap.entries())
    .map(([nopType, data]) => ({ 
      nopType, 
      totals: data.totals, 
      staffMembers: data.staffMembers 
    }))
    .sort((a, b) => a.nopType.localeCompare(b.nopType));

  logger.info("FTE Summaries calculated with staff tracking");

  return {
    orgSummaries,
    disciplineSummaries,
    nopTypeSummaries,
    grandTotal,
    allStaffMembers
  };
}