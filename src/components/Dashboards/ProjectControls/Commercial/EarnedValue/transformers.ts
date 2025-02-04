import { rawData } from '../data';

export interface DisciplineSummary {
  discipline: string;
  directCosts: number;
  limb2: number;
  total: number;
  percentOfBudget: number;
  selectedMonthPlanned: number;
  selectedMonthToDate: number;
  selectedMonthWeighting: number;
  selectedMonthSlippage: number;
}

export interface TotalSummary {
  directCosts: number;
  limb2: number;
  total: number;
  selectedMonthPlanned: number;
  selectedMonthToDate: number;
  selectedMonthSlippage: number;
}

export interface LineItemData {
  discipline: string;
  element: string;
  directCosts: number;
  limb2: number;
  total: number;
  percentOfBudget: number;
  selectedMonthPlanned: number;
  selectedMonthToDate: number;
  selectedMonthWeighting: number;
  selectedMonthSlippage: number;
  isHeader?: boolean;
  isExpanded?: boolean;
}

export function calculateDisciplineSummaries(selectedMonth: string): DisciplineSummary[] {
  const disciplineMap = new Map<string, DisciplineSummary>();

  // Calculate total budget first for percentage calculations
  const totalBudget = rawData.data.reduce((sum, item) => sum + item.Total, 0);

  rawData.data.forEach(item => {
    const discipline = item.Discipline;
    const progress = item.Progress.find(p => p.Month === selectedMonth) || { Planned: 0, Earned: 0 };
    
    const current = disciplineMap.get(discipline) || {
      discipline,
      directCosts: 0,
      limb2: 0,
      total: 0,
      percentOfBudget: 0,
      selectedMonthPlanned: 0,
      selectedMonthToDate: 0,
      selectedMonthWeighting: 0,
      selectedMonthSlippage: 0
    };

    // Update basic totals
    current.directCosts += item['Direct Costs'];
    current.limb2 += item['Limb 2'];
    current.total += item.Total;
    
    // Calculate weighted values based on item's budget percentage
    const itemBudgetWeight = item.Total / totalBudget;
    current.selectedMonthPlanned += progress.Planned * itemBudgetWeight;
    current.selectedMonthToDate += progress.Earned * itemBudgetWeight;
    
    disciplineMap.set(discipline, current);
  });

  // Convert map to array and calculate final percentages and slippage
  const summaries = Array.from(disciplineMap.values());
  
  return summaries.map(summary => {
    const percentOfBudget = (summary.total / totalBudget) * 100;
    const selectedMonthWeighting = percentOfBudget * (summary.selectedMonthToDate / 100);
    const selectedMonthSlippage = summary.selectedMonthToDate - summary.selectedMonthPlanned;

    return {
      ...summary,
      percentOfBudget,
      selectedMonthWeighting,
      selectedMonthSlippage
    };
  });
}

export function calculateTotalSummary(selectedMonth: string): TotalSummary {
  const totals = rawData.data.reduce((acc, item) => {
    const progress = item.Progress.find(p => p.Month === selectedMonth) || { Planned: 0, Earned: 0 };
    const totalBudget = rawData.data.reduce((sum, i) => sum + i.Total, 0);
    const itemBudgetWeight = item.Total / totalBudget;

    return {
      directCosts: acc.directCosts + item['Direct Costs'],
      limb2: acc.limb2 + item['Limb 2'],
      total: acc.total + item.Total,
      selectedMonthPlanned: acc.selectedMonthPlanned + (progress.Planned * itemBudgetWeight),
      selectedMonthToDate: acc.selectedMonthToDate + (progress.Earned * itemBudgetWeight),
      selectedMonthSlippage: acc.selectedMonthSlippage + ((progress.Earned - progress.Planned) * itemBudgetWeight)
    };
  }, {
    directCosts: 0,
    limb2: 0,
    total: 0,
    selectedMonthPlanned: 0,
    selectedMonthToDate: 0,
    selectedMonthSlippage: 0
  });

  return totals;
}

export function calculateEarnedValueMetrics(month: string) {
  const metrics = rawData.data.map(item => {
    const progress = item.Progress.find(p => p.Month === month);
    if (!progress) return null;

    const plannedValue = (item.Total * progress.Planned) / 100;
    const earnedValue = (item.Total * progress.Earned) / 100;
    const actualCost = earnedValue; // Assuming actual cost equals earned value for this example

    return {
      discipline: item.Discipline,
      element: item.Element,
      plannedValue,
      earnedValue,
      actualCost,
      costVariance: earnedValue - actualCost,
      cpi: actualCost !== 0 ? earnedValue / actualCost : 1
    };
  }).filter(Boolean);

  // Calculate totals
  return metrics.reduce((acc, curr) => ({
    plannedValue: acc.plannedValue + curr.plannedValue,
    earnedValue: acc.earnedValue + curr.earnedValue,
    actualCost: acc.actualCost + curr.actualCost,
    costVariance: acc.costVariance + curr.costVariance,
    cpi: curr.cpi, // Use the latest CPI
  }), {
    plannedValue: 0,
    earnedValue: 0,
    actualCost: 0,
    costVariance: 0,
    cpi: 1
  });
}

export function getAvailableMonths(): string[] {
  const months = new Set<string>();
  rawData.data.forEach(item => {
    item.Progress.forEach(progress => {
      months.add(progress.Month);
    });
  });
  return Array.from(months).sort();
}

export function calculateLineItems(selectedMonth: string): LineItemData[] {
  const totalBudget = rawData.data.reduce((sum, item) => sum + item.Total, 0);
  const disciplineSummaries = calculateDisciplineSummaries(selectedMonth);
  const result: LineItemData[] = [];

  // Group data by discipline
  const disciplineGroups = new Map<string, typeof rawData.data>();
  rawData.data.forEach(item => {
    if (!disciplineGroups.has(item.Discipline)) {
      disciplineGroups.set(item.Discipline, []);
    }
    disciplineGroups.get(item.Discipline)!.push(item);
  });

  // Create pivot data with headers and details
  disciplineSummaries.forEach(summary => {
    // Add discipline header
    result.push({
      ...summary,
      element: '',
      isHeader: true,
      isExpanded: true
    });

    // Add line items for this discipline
    const items = disciplineGroups.get(summary.discipline) || [];
    items.forEach(item => {
      const progress = item.Progress.find(p => p.Month === selectedMonth) || { Planned: 0, Earned: 0 };
      const percentOfBudget = (item.Total / totalBudget) * 100;
      const selectedMonthWeighting = percentOfBudget * (progress.Earned / 100);
      
      result.push({
        discipline: summary.discipline,
        element: item.Element,
        directCosts: item['Direct Costs'],
        limb2: item['Limb 2'],
        total: item.Total,
        percentOfBudget,
        selectedMonthPlanned: progress.Planned,
        selectedMonthToDate: progress.Earned,
        selectedMonthWeighting,
        selectedMonthSlippage: progress.Earned - progress.Planned,
        isHeader: false
      });
    });
  });

  return result;
}