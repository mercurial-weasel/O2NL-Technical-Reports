// Define types for budget tracking components

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgeted: number;
  actual: number;
  variance: number;
  startDate: string;
  endDate: string;
  status: 'on-track' | 'over-budget' | 'under-budget';
}

export interface BudgetSummaryData {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  lastUpdated: string;
}

export interface MonthData {
  month: string;
  planned: number;
  actual: number;
  variance: number;
}

export interface CategoryData {
  name: string;
  planned: number;
  actual: number;
  variance: number;
  percentage: number;
}

export interface BudgetTrackingProps {
  projectId: string;
  dateRange?: [Date | null, Date | null];
  filterCategories?: string[];
}
