import { O2NL_Staff } from './types';

// Staff Movement Types
export interface MovementCounts {
  onboarding: number;
  offboarding: number;
  onboardingStaff: string[];
  offboardingStaff: string[];
}

export interface CategoryMovement {
  name: string;
  movements: { [month: string]: MovementCounts };
}

export interface StaffMovement {
  organizations: CategoryMovement[];
  disciplines: CategoryMovement[];
  nopTypes: CategoryMovement[];
  total: { [month: string]: MovementCounts };
  months: string[];
}

export function calculateStaffMovement(data: O2NL_Staff[]): StaffMovement {
  // Initialize data structures
  const orgMap = new Map<string, { [month: string]: MovementCounts }>();
  const disciplineMap = new Map<string, { [month: string]: MovementCounts }>();
  const nopTypeMap = new Map<string, { [month: string]: MovementCounts }>();
  const totalMovement: { [month: string]: MovementCounts } = {};

  // Find date range
  const dates = data.flatMap(record => [
    new Date(record.Required_Start),
    new Date(record.Required_Finish)
  ]).filter(date => !isNaN(date.getTime()));

  //const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const startDate = new Date(2024, 0, 1); // January 1, 2024
 
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Generate array of months
  const months: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const monthKey = currentDate.toLocaleString('default', { month: 'long' }) + '_' + 
                    currentDate.getFullYear().toString().slice(-2);
    months.push(monthKey);
    
    // Initialize total movement for this month
    totalMovement[monthKey] = { 
      onboarding: 0, 
      offboarding: 0,
      onboardingStaff: [],
      offboardingStaff: []
    };
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Process each staff member
  data.forEach(staff => {
    const startDate = new Date(staff.Required_Start);
    const endDate = new Date(staff.Required_Finish);

    // Skip if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }

    const startMonth = `${startDate.toLocaleString('default', { month: 'long' })}_${startDate.getFullYear().toString().slice(-2)}`;
    const endMonth = `${endDate.toLocaleString('default', { month: 'long' })}_${endDate.getFullYear().toString().slice(-2)}`;

    // Initialize maps if needed
    if (!orgMap.has(staff.Org)) {
      orgMap.set(staff.Org, {});
      months.forEach(month => {
        orgMap.get(staff.Org)![month] = { 
          onboarding: 0, 
          offboarding: 0,
          onboardingStaff: [],
          offboardingStaff: []
        };
      });
    }

    if (!disciplineMap.has(staff.Team)) {
      disciplineMap.set(staff.Team, {});
      months.forEach(month => {
        disciplineMap.get(staff.Team)![month] = { 
          onboarding: 0, 
          offboarding: 0,
          onboardingStaff: [],
          offboardingStaff: []
        };
      });
    }

    if (!nopTypeMap.has(staff.NOP_Type)) {
      nopTypeMap.set(staff.NOP_Type, {});
      months.forEach(month => {
        nopTypeMap.get(staff.NOP_Type)![month] = { 
          onboarding: 0, 
          offboarding: 0,
          onboardingStaff: [],
          offboardingStaff: []
        };
      });
    }

    // Record onboarding
    if (months.includes(startMonth)) {
      orgMap.get(staff.Org)![startMonth].onboarding++;
      orgMap.get(staff.Org)![startMonth].onboardingStaff.push(staff.Name);
      
      disciplineMap.get(staff.Team)![startMonth].onboarding++;
      disciplineMap.get(staff.Team)![startMonth].onboardingStaff.push(staff.Name);
      
      nopTypeMap.get(staff.NOP_Type)![startMonth].onboarding++;
      nopTypeMap.get(staff.NOP_Type)![startMonth].onboardingStaff.push(staff.Name);
      
      totalMovement[startMonth].onboarding++;
      totalMovement[startMonth].onboardingStaff.push(staff.Name);
    }

    // Record offboarding
    if (months.includes(endMonth)) {
      orgMap.get(staff.Org)![endMonth].offboarding++;
      orgMap.get(staff.Org)![endMonth].offboardingStaff.push(staff.Name);
      
      disciplineMap.get(staff.Team)![endMonth].offboarding++;
      disciplineMap.get(staff.Team)![endMonth].offboardingStaff.push(staff.Name);
      
      nopTypeMap.get(staff.NOP_Type)![endMonth].offboarding++;
      nopTypeMap.get(staff.NOP_Type)![endMonth].offboardingStaff.push(staff.Name);
      
      totalMovement[endMonth].offboarding++;
      totalMovement[endMonth].offboardingStaff.push(staff.Name);
    }
  });

  // Convert maps to sorted arrays
  const organizations = Array.from(orgMap.entries())
    .map(([name, movements]) => ({ name, movements }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const disciplines = Array.from(disciplineMap.entries())
    .map(([name, movements]) => ({ name, movements }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const nopTypes = Array.from(nopTypeMap.entries())
    .map(([name, movements]) => ({ name, movements }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    organizations,
    disciplines,
    nopTypes,
    total: totalMovement,
    months
  };
}