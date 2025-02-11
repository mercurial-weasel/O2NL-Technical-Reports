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