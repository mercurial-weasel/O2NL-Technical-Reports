/**
 * Staff FTE Types
 */

// Define the primary Staff FTE interface
export interface O2NL_Staff {
  id?: string;
  disciplineManager: string;
  team: string;
  location: string;
  nopType: string;
  org: string;
  projectRoleTitle: string;
  jobCode: string;
  phase: string;
  name: string;
  status: string;
  lastUpdatedConf: string;
  resourceOptions: string;
  taitokoLevinSiteBased: string;
  pricingPGProfDirectWorks: string;
  fteAve: number;
  requiredStart: Date;
  requiredFinish: Date;
  monthlyFTE: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper utility to help convert month formats
export const monthFormatter = {
  // Convert from "MonthName_YY" to "YYYY-MM" format (for JSON keys)
  toISOFormat: (monthKey: string): string => {
    const [month, yearStr] = monthKey.split('_');
    const year = parseInt(yearStr) + 2000; // Convert "24" to 2024
    const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
    return `${year}-${monthNum.toString().padStart(2, '0')}`;
  },
  
  // Convert from "YYYY-MM" to "MonthName_YY" format
  toLegacyFormat: (isoMonth: string): string => {
    const [year, month] = isoMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName}_${year.slice(-2)}`;
  }
};