import { O2NL_Staff } from './types';

// Generate mock staff FTE data
export const mockStaffFTEData: O2NL_Staff[] = (() => {
  const organizations = ['TT', 'Beca', 'Downer', 'McConnell Dowell'];
  const disciplines = ['Design', 'Engineering', 'Construction', 'Digital', 'Legacy Outcomes'];
  const nopTypes = ['CNOP', 'DNOP', 'CNOP/DNOP'];
  const locations = ['Auckland', 'Wellington', 'Christchurch'];
  const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
  const statuses = ['Active', 'Pending', 'Completed'];
  
  const generateMonthlyFTE = (startDate: Date, endDate: Date): { [key: string]: number } => {
    const monthlyFTE: { [key: string]: number } = {};
    const start = new Date(startDate);
    start.setDate(1); // First day of month
    const end = new Date(endDate);
    end.setDate(1); // First day of month
    
    // Create entries for each month in range
    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      monthlyFTE[key] = 0.8 + Math.random() * 0.4; // Random FTE between 0.8 and 1.2
      current.setMonth(current.getMonth() + 1);
    }
    
    return monthlyFTE;
  };
  
  return Array.from({ length: 50 }, (_, i) => {
    const startDate = new Date(2024, 8); // September 2024
    const endDate = new Date(2026, 8); // September 2026
    
    return {
      id: `staff-${i + 1}`,
      disciplineManager: `Manager ${i + 1}`,
      team: disciplines[Math.floor(Math.random() * disciplines.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      nopType: nopTypes[Math.floor(Math.random() * nopTypes.length)],
      org: organizations[Math.floor(Math.random() * organizations.length)],
      projectRoleTitle: `Role ${i + 1}`,
      jobCode: `JC${1000 + i}`,
      phase: phases[Math.floor(Math.random() * phases.length)],
      name: `Staff Member ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdatedConf: new Date().toISOString(),
      resourceOptions: 'Standard',
      taitokoLevinSiteBased: Math.random() > 0.5 ? 'Yes' : 'No',
      pricingPGProfDirectWorks: Math.random() > 0.5 ? 'Direct' : 'Prof',
      fteAve: 0.8 + Math.random() * 0.4, // Random FTE between 0.8 and 1.2
      requiredStart: startDate,
      requiredFinish: endDate,
      monthlyFTE: generateMonthlyFTE(startDate, endDate),
      createdAt: new Date(2023, 11, 1),
      updatedAt: new Date()
    };
  });
})();
