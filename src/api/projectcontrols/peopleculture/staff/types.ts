import { O2NL_Staff as PrismaO2NL_Staff } from '../../../types/prismaTypes';

// Monthly FTE data structure (example)
export interface MonthlyFTEData {
  month: string;  // YYYY-MM format
  fte: number;
}

// Re-export the Prisma type with potentially added functionality
export interface StaffMember extends Omit<PrismaO2NL_Staff, 'monthlyFTE' | 'createdAt' | 'updatedAt'> {
  monthlyFTE: { [key: string]: number }; // Changed to object format with YYYY-MM keys
}

export type StaffData = StaffMember[];

// Interface for staff summary/filtered view
export interface StaffSummary {
  id: string;
  name: string;
  disciplineManager: string;
  team: string;
  location: string;
  projectRoleTitle: string;
  status: string;
  fteAve: number;
  requiredStart: string;
  requiredFinish: string;
  duration: number; // in days or months
}

// Month formatter utility
export const monthFormatter = {
  // Convert from YYYY-MM to Month_YY format
  toDisplayFormat: (isoMonth: string): string => {
    if (!isoMonth || !isoMonth.includes('-')) return '';
    
    const [year, month] = isoMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    
    return date.toLocaleString('default', { month: 'long' }) + '_' + 
           year.slice(-2);
  },
  
  // Convert from Month_YY to YYYY-MM format
  toISOFormat: (displayMonth: string): string => {
    if (!displayMonth || !displayMonth.includes('_')) return '';
    
    const [monthName, yearShort] = displayMonth.split('_');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthNum = months.findIndex(m => m === monthName) + 1;
    const year = '20' + yearShort; // Assuming years are in the 2000s
    
    return `${year}-${monthNum.toString().padStart(2, '0')}`;
  },
  
  // Direct access to the key format stored in the database
  directFormat: (monthKey: string): string => {
    // This function doesn't transform the key, but returns it as-is
    // since the data is already stored in this format in the database
    return monthKey;
  }
};

// Interface to support Month columns in component rendering
export interface MonthColumn {
  key: string;
  title: string;
  dataIndex: string;
}
