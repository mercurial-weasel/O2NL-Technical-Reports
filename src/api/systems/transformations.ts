import { SystemInfo } from './types';

export interface PivotItem {
  name: string;
  values: number[];
  isSubcategory?: boolean;
  subcategoryItems?: PivotItem[];
}

export interface PivotCategory {
  category: string;
  values: number[];
  items: PivotItem[];
}

export interface FilterCriteria {
  businessAreas: Set<string>;
  licenseTypes: Set<string>;
  smeResponsibles: Set<string>;
  adoptionLevels: Set<string>;
}

export const adoptionLevels = [
  '1 - poor',
  '2 - average', 
  '3 - good',
  '4 - very good',
  '5 - comprehensive',
  '7 - Unknown',
  '8 - Not commenced',
  '9 - N/A'
] as const;

function filterSystems(systems: SystemInfo[], filters: FilterCriteria): SystemInfo[] {
  return systems.filter(system => {
    const matchesBusinessArea = filters.businessAreas.has('all') || filters.businessAreas.has(system.businessArea);
    const matchesLicense = filters.licenseTypes.has('all') || filters.licenseTypes.has(system.licenseType);
    const matchesSME = filters.smeResponsibles.has('all') || filters.smeResponsibles.has(system.smeResponsible);
    const matchesAdoption = filters.adoptionLevels.has('all') || filters.adoptionLevels.has(system.adoption);

    return matchesBusinessArea && matchesLicense && matchesSME && matchesAdoption;
  });
}

export function transformToPivotData(systems: SystemInfo[], filters: FilterCriteria): PivotCategory[] {
  // Apply filters first
  const filteredSystems = filterSystems(systems, filters);

  // Group systems by business area
  const groupedSystems = filteredSystems.reduce((acc, system) => {
    const category = system.businessArea;
    if (!acc[category]) {
      acc[category] = new Map<string, SystemInfo[]>();
    }
    
    // Group by subcategory within business area
    const subcategory = system.category;
    if (!acc[category].has(subcategory)) {
      acc[category].set(subcategory, []);
    }
    acc[category].get(subcategory)!.push(system);
    
    return acc;
  }, {} as Record<string, Map<string, SystemInfo[]>>);

  // Transform into pivot structure
  return Object.entries(groupedSystems)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, subcategories]) => {
      const categoryValues = new Array(adoptionLevels.length).fill(0);
      const items: PivotItem[] = [];

      // Process each subcategory
      subcategories.forEach((systems, subcategory) => {
        const subcategoryValues = new Array(adoptionLevels.length).fill(0);
        const subcategoryItems: PivotItem[] = [];

        // Process systems within subcategory
        systems.forEach(system => {
          const adoptionIndex = adoptionLevels.findIndex(level => level === system.adoption);
          if (adoptionIndex !== -1) {
            subcategoryValues[adoptionIndex]++;
            categoryValues[adoptionIndex]++;

            // Add system item
            subcategoryItems.push({
              name: system.name,
              values: new Array(adoptionLevels.length).fill(0).map((_, i) => 
                i === adoptionIndex ? 1 : 0
              )
            });
          }
        });

        // Add subcategory with its systems
        if (subcategoryItems.length > 0) {
          items.push({
            name: subcategory,
            values: subcategoryValues,
            isSubcategory: true,
            subcategoryItems
          });
        }
      });

      return {
        category,
        values: categoryValues,
        items
      };
    });
}

// Calculate column totals
export function calculateColumnTotals(data: PivotCategory[]): number[] {
  const totals = new Array(adoptionLevels.length).fill(0);
  
  data.forEach(category => {
    category.values.forEach((value, index) => {
      totals[index] += value;
    });
  });
  
  return totals;
}

// Helper to get the pivot data
export function getPivotData(systems: SystemInfo[], filters: FilterCriteria) {
  const pivotData = transformToPivotData(systems, filters);
  const columnTotals = calculateColumnTotals(pivotData);
  
  return {
    data: pivotData,
    columnTotals,
    adoptionLevels
  };
}