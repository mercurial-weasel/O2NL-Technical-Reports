import { AMTBudgetItem, AMTBudgetData } from './types';

export interface BudgetMetric {
  title: string;
  value: number;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
}

export function calculateBudgetMetrics(data: AMTBudgetData[string]): BudgetMetric[] {
  return [
    {
      title: 'Total Budget',
      value: data.summary.TOTAL_ALL.TOTAL2,
      change: 0,
      status: 'neutral'
    },
    {
      title: 'Total Labour',
      value: data.summary.TOTAL_LABOUR.TOTAL2,
      change: data.summary.TOTAL_LABOUR.TOTAL_DIFF,
      status: data.summary.TOTAL_LABOUR.TOTAL_DIFF < 0 ? 'negative' : 'positive'
    },
    {
      title: 'Total Expenses',
      value: data.summary.TOTAL_EXPENSES.TOTAL2,
      change: data.summary.TOTAL_EXPENSES.TOTAL_DIFF,
      status: data.summary.TOTAL_EXPENSES.TOTAL_DIFF < 0 ? 'negative' : 'positive'
    }
  ];
}

export function getAvailableMonths(data: AMTBudgetData): string[] {
  return Object.keys(data).sort((a, b) => b.localeCompare(a)); // Sort in descending order
}

export function getMonthlyData(data: AMTBudgetData, month: string) {
  return data[month];
}