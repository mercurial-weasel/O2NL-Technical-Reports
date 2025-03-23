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
    new Date(record.requiredStart),
    new Date(record.requiredFinish)
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
    const startDate = new Date(staff.requiredStart);
    const endDate = new Date(staff.requiredFinish);

    // Skip if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return;
    }

    const startMonth = `${startDate.toLocaleString('default', { month: 'long' })}_${startDate.getFullYear().toString().slice(-2)}`;
    const endMonth = `${endDate.toLocaleString('default', { month: 'long' })}_${endDate.getFullYear().toString().slice(-2)}`;

    // Initialize maps if needed
    if (!orgMap.has(staff.org)) {
      orgMap.set(staff.org, {});
      months.forEach(month => {
        orgMap.get(staff.org)![month] = { 
          onboarding: 0, 
          offboarding: 0,
          onboardingStaff: [],
          offboardingStaff: []
        };
      });
    }

    if (!disciplineMap.has(staff.team)) {
      disciplineMap.set(staff.team, {});
      months.forEach(month => {
        disciplineMap.get(staff.team)![month] = { 
          onboarding: 0, 
          offboarding: 0,
          onboardingStaff: [],
          offboardingStaff: []
        };
      });
    }

    if (!nopTypeMap.has(staff.nopType)) {
      nopTypeMap.set(staff.nopType, {});
      months.forEach(month => {
        nopTypeMap.get(staff.nopType)![month] = { 
          onboarding: 0, 
          offboarding: 0,
          onboardingStaff: [],
          offboardingStaff: []
        };
      });
    }

    // Record onboarding
    if (months.includes(startMonth)) {
      orgMap.get(staff.org)![startMonth].onboarding++;
      orgMap.get(staff.org)![startMonth].onboardingStaff.push(staff.name);
      
      disciplineMap.get(staff.team)![startMonth].onboarding++;
      disciplineMap.get(staff.team)![startMonth].onboardingStaff.push(staff.name);
      
      nopTypeMap.get(staff.nopType)![startMonth].onboarding++;
      nopTypeMap.get(staff.nopType)![startMonth].onboardingStaff.push(staff.name);
      
      totalMovement[startMonth].onboarding++;
      totalMovement[startMonth].onboardingStaff.push(staff.name);
    }

    // Record offboarding
    if (months.includes(endMonth)) {
      orgMap.get(staff.org)![endMonth].offboarding++;
      orgMap.get(staff.org)![endMonth].offboardingStaff.push(staff.name);
      
      disciplineMap.get(staff.team)![endMonth].offboarding++;
      disciplineMap.get(staff.team)![endMonth].offboardingStaff.push(staff.name);
      
      nopTypeMap.get(staff.nopType)![endMonth].offboarding++;
      nopTypeMap.get(staff.nopType)![endMonth].offboardingStaff.push(staff.name);
      
      totalMovement[endMonth].offboarding++;
      totalMovement[endMonth].offboardingStaff.push(staff.name);
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