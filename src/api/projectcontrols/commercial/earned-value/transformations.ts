import { EarnedValueData, EarnedValueMetrics, LineItemData, ProjectElement } from './types';

export function calculateEarnedValueMetrics(data: EarnedValueData, month: string): EarnedValueMetrics {
  const metrics = data.data.map(item => {
    const progress = item.Progress.find(p => p.Month === month);
    if (!progress) return null;

    const plannedValue = (item.Total * progress.Planned) / 100;
    const earnedValue = (item.Total * progress.Earned) / 100;
    const actualCost = earnedValue; // Assuming actual cost equals earned value for this example

    return {
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

export function getAvailableMonths(data: EarnedValueData): string[] {
  const months = new Set<string>();
  data.data.forEach(item => {
    item.Progress.forEach(progress => {
      months.add(progress.Month);
    });
  });
  return Array.from(months).sort();
}

export function calculateLineItems(data: EarnedValueData, selectedMonth: string): LineItemData[] {
  const totalBudget = data.data.reduce((sum, item) => sum + item.Total, 0);
  const result: LineItemData[] = [];

  // Group by discipline
  const disciplineGroups = new Map<string, ProjectElement[]>();
  data.data.forEach(item => {
    if (!disciplineGroups.has(item.Discipline)) {
      disciplineGroups.set(item.Discipline, []);
    }
    disciplineGroups.get(item.Discipline)!.push(item);
  });

  // Calculate discipline summaries and line items
  disciplineGroups.forEach((items, discipline) => {
    const disciplineTotals = {
      directCosts: items.reduce((sum, item) => sum + item['Direct Costs'], 0),
      limb2: items.reduce((sum, item) => sum + item['Limb 2'], 0),
      total: items.reduce((sum, item) => sum + item.Total, 0),
      percentOfBudget: 0,
      selectedMonthPlanned: 0,
      selectedMonthToDate: 0,
      selectedMonthWeighting: 0,
      selectedMonthSlippage: 0
    };

    disciplineTotals.percentOfBudget = (disciplineTotals.total / totalBudget) * 100;

    // Add discipline header
    result.push({
      discipline,
      element: '',
      ...disciplineTotals,
      isHeader: true
    });

    // Add line items
    items.forEach(item => {
      const progress = item.Progress.find(p => p.Month === selectedMonth) || { Planned: 0, Earned: 0 };
      const percentOfBudget = (item.Total / totalBudget) * 100;
      const selectedMonthWeighting = percentOfBudget * (progress.Earned / 100);
      
      result.push({
        discipline,
        element: item.Element,
        directCosts: item['Direct Costs'],
        limb2: item['Limb 2'],
        total: item.Total,
        percentOfBudget,
        selectedMonthPlanned: progress.Planned,
        selectedMonthToDate: progress.Earned,
        selectedMonthWeighting,
        selectedMonthSlippage: progress.Earned - progress.Planned
      });
    });
  });

  return result;
}