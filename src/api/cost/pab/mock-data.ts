// src/api/cost/pab/mock-data.ts
import { MonthlyPABRecord } from './types';

// Helper function to add random variation (±10%)
const addRandomVariation = (value: number | null | string): number | null | string => {
  if (value === null || value === "") return value;
  if (typeof value === "string") {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    value = numValue;
  }
  const variation = 0.1; // 10%
  const randomFactor = 1 + (Math.random() * variation * 2 - variation);
  return Number((value * randomFactor).toFixed(2));
};

// Helper function to generate last 13 months
const generateMonths = () => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 13; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.unshift(`${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear().toString().slice(-2)}`);
  }
  
  return months;
};

const createMonthlyRecord = (monthYear: string): MonthlyPABRecord => {
  // Generate base values
  const baseRecord = {
    id: `pab-${monthYear}`,
    monthYear,
    budget: {
      items: [
        { id: `budget-1-${monthYear}`, budgetItem: "Initial Target Cost L1 (M)", shared: addRandomVariation(6), nonShared: addRandomVariation(2), total: addRandomVariation(5), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `budget-2-${monthYear}`, budgetItem: "Variations", shared: "", nonShared: "", total: "", ref: "Appx 3", comments: "Variations pending approval", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `budget-3-${monthYear}`, budgetItem: "Approved", shared: addRandomVariation(-0.17), nonShared: addRandomVariation(2), total: addRandomVariation(4), ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: false },
        { id: `budget-4-${monthYear}`, budgetItem: "Unapproved", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `budget-5-${monthYear}`, budgetItem: "Totals", shared: addRandomVariation(-0.17), nonShared: addRandomVariation(2), total: addRandomVariation(4), ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true },
        { id: `budget-6-${monthYear}`, budgetItem: "", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `budget-7-${monthYear}`, budgetItem: "Total Limb 1", shared: addRandomVariation(5.83), nonShared: addRandomVariation(4), total: addRandomVariation(9), ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true },
        { id: `budget-8-${monthYear}`, budgetItem: "Limb 2", shared: addRandomVariation(1), nonShared: addRandomVariation(1.2), total: addRandomVariation(1.6), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `budget-9-${monthYear}`, budgetItem: "Limb 3", shared: addRandomVariation(3.5), nonShared: addRandomVariation(1.4), total: addRandomVariation(1.8), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `budget-10-${monthYear}`, budgetItem: "Final Target Cost (FTC)", shared: addRandomVariation(10.33), nonShared: addRandomVariation(6.6), total: addRandomVariation(12.4), ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true }
      ]
    },
    cost: {
      items: [
        { id: `cost-1-${monthYear}`, budget: "L1 to Date (M)", shared: addRandomVariation(5.6), nonShared: addRandomVariation(5.3), total: addRandomVariation(12.1), ref: "Appendix 1", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: true },
        { id: `cost-2-${monthYear}`, budget: "L1 to complete", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-3-${monthYear}`, budget: "Directs", shared: addRandomVariation(0.2), nonShared: addRandomVariation(0.4), total: addRandomVariation(0.5), ref: "Appendix 1", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: false },
        { id: `cost-4-${monthYear}`, budget: "Risk & Opp", shared: addRandomVariation(0.07), nonShared: addRandomVariation(0.02), total: addRandomVariation(0.1), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-5-${monthYear}`, budget: "Escalation", shared: addRandomVariation(0.2), nonShared: addRandomVariation(0.4), total: addRandomVariation(0.5), ref: "Appendix 1", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-6-${monthYear}`, budget: "Contingency", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-7-${monthYear}`, budget: "Sub Total", shared: addRandomVariation(0.07), nonShared: addRandomVariation(1.22), total: addRandomVariation(0.5), ref: "Appendix 2", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: true },
        { id: `cost-8-${monthYear}`, budget: "Total Limb 1", shared: addRandomVariation(6.27), nonShared: addRandomVariation(6.52), total: addRandomVariation(13.8), ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: false },
        { id: `cost-9-${monthYear}`, budget: "Limb 2", shared: addRandomVariation(1.2), nonShared: addRandomVariation(1.3), total: addRandomVariation(1.05), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-10-${monthYear}`, budget: "Subtotal", shared: addRandomVariation(7.47), nonShared: addRandomVariation(7.82), total: addRandomVariation(14.85), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: true },
        { id: `cost-11-${monthYear}`, budget: "Limb 3", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-12-${monthYear}`, budget: "Cost Performance", shared: addRandomVariation(0.5), nonShared: addRandomVariation(0.4), total: addRandomVariation(0.2), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-13-${monthYear}`, budget: "Non-Cost Performance", shared: addRandomVariation(0.2), nonShared: addRandomVariation(0.24), total: addRandomVariation(0.15), ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
        { id: `cost-14-${monthYear}`, budget: "Final ACtual Cost (FAC)", shared: addRandomVariation(8.17), nonShared: addRandomVariation(8.46), total: addRandomVariation(15.2), ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true }
      ]
    },
    costIndicators: {
      indicators: [
        { id: `cost-ind-1-${monthYear}`, text: "Planned Complete", indicator: `${addRandomVariation(100)}%` },
        { id: `cost-ind-2-${monthYear}`, text: "Actual Complete", indicator: `${addRandomVariation(0.5)}m` },
        { id: `cost-ind-3-${monthYear}`, text: "Schedule Variance (EV-PV)", indicator: `${addRandomVariation(0)}%` },
        { id: `cost-ind-4-${monthYear}`, text: "Schedule Variance (EV-PV)", indicator: `${addRandomVariation(0)}%` },
        { id: `cost-ind-5-${monthYear}`, text: "Actual Cost Limb 1", indicator: `${addRandomVariation(2.5)}m` },
        { id: `cost-ind-6-${monthYear}`, text: "Re-Based Earned Value Limb 1", indicator: `${addRandomVariation(1.5)}m` },
        { id: `cost-ind-7-${monthYear}`, text: "Limb 1 Cost Variable (EV-AC)", indicator: `${addRandomVariation(1.1)}` },
        { id: `cost-ind-8-${monthYear}`, text: "Cost Performance Index (EV/AC)", indicator: `${addRandomVariation(1.01)}` }
      ]
    },
    riskIndicators: {
      indicators: [
        { id: `risk-ind-1-${monthYear}`, text: "Original Allocation", indicator: `${addRandomVariation(3.2)}m` },
        { id: `risk-ind-2-${monthYear}`, text: "Current Exposure", indicator: `${addRandomVariation(0.1)}m` },
        { id: `risk-ind-3-${monthYear}`, text: "Retained Allocation", indicator: `${addRandomVariation(0.71)}%` },
        { id: `risk-ind-4-${monthYear}`, text: "Monthly Exposure Movement", indicator: `${addRandomVariation(-0.02)}m` },
        { id: `risk-ind-5-${monthYear}`, text: "Current Contingency", indicator: `${addRandomVariation(0.75)}m` },
        { id: `risk-ind-6-${monthYear}`, text: "Remaining Exposure and Allocation", indicator: `${addRandomVariation(0.89)}m` }
      ]
    },
    expenditure: {
      months: generateMonths(),
      planned: {
        monthly: Array(13).fill(0).map((_, i) => addRandomVariation(2.5 + (i * 0.3)) as number),
        cumulative: Array(13).fill(0).map((_, i) => {
          const base = Array(i + 1).fill(0)
            .map((_, j) => 2.5 + (j * 0.3))
            .reduce((sum, val) => sum + val, 0);
          return addRandomVariation(base) as number;
        })
      },
      actual: {
        monthly: Array(13).fill(0).map((_, i) => i < 9 ? addRandomVariation(2.3 + (i * 0.25)) : null),
        cumulative: Array(13).fill(0).map((_, i) => {
          if (i >= 9) return null;
          const base = Array(i + 1).fill(0)
            .map((_, j) => 2.3 + (j * 0.25))
            .reduce((sum, val) => sum + val, 0);
          return addRandomVariation(base) as number;
        })
      },
      forecast: {
        monthly: Array(13).fill(0).map((_, i) => i >= 8 ? addRandomVariation(4.6 + ((i - 8) * 0.2)) : null),
        cumulative: Array(13).fill(0).map((_, i) => {
          if (i < 8) return null;
          const base = Array(i - 7).fill(0)
            .map((_, j) => 4.6 + (j * 0.2))
            .reduce((sum, val) => sum + val, 31.7);
          return addRandomVariation(base) as number;
        })
      }
    },
    expenditureIndicators: {
      indicators: [
        { id: `exp-ind-1-${monthYear}`, text: "Monthly Cashflow Variance", indicator: `${addRandomVariation(44.3)}` },
        { id: `exp-ind-2-${monthYear}`, text: "Expenditure to data variance", indicator: `${addRandomVariation(-6.40)}%` }
      ]
    },
    fundingSplit: {
      currentMonth: [
        { id: `fund-curr-1-${monthYear}`, name: "McConnell Dowell", value: addRandomVariation(35) as number },
        { id: `fund-curr-2-${monthYear}`, name: "Downer", value: addRandomVariation(30) as number },
        { id: `fund-curr-3-${monthYear}`, name: "Beca", value: addRandomVariation(20) as number },
        { id: `fund-curr-4-${monthYear}`, name: "T+T", value: addRandomVariation(15) as number }
      ],
      projectSplit: [
        { id: `fund-proj-1-${monthYear}`, name: "McConnell Dowell", value: addRandomVariation(40) as number },
        { id: `fund-proj-2-${monthYear}`, name: "Downer", value: addRandomVariation(35) as number },
        { id: `fund-proj-3-${monthYear}`, name: "Beca", value: addRandomVariation(15) as number },
        { id: `fund-proj-4-${monthYear}`, name: "T+T", value: addRandomVariation(10) as number }
      ]
    },
    limb1Indicators: {
      indicators: [
        { id: `limb1-ind-1-${monthYear}`, text: "Main Shared Works", indicator: `${addRandomVariation(0.2)}m` },
        { id: `limb1-ind-2-${monthYear}`, text: "Main Non-Shared Works", indicator: `${addRandomVariation(0.3)}m` },
        { id: `limb1-ind-3-${monthYear}`, text: "Initiative #1", indicator: "" },
        { id: `limb1-ind-4-${monthYear}`, text: "Initiative #2", indicator: "" }
      ]
    },
    limb3Indicators: {
      indicators: [
        { id: `limb3-ind-1-${monthYear}`, text: "Dec 2024 Ops", indicator: `${addRandomVariation(96.5)}%` },
        { id: `limb3-ind-2-${monthYear}`, text: "Jan 2025 Ops", indicator: `${addRandomVariation(96)}%` },
        { id: `limb3-ind-3-${monthYear}`, text: "Final Rolling Average Ops", indicator: `${addRandomVariation(0.71)}%` }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return baseRecord;
};

// Generate the last 3 months of data
const currentDate = new Date();
export const mockPABData: MonthlyPABRecord[] = Array.from({ length: 3 }, (_, i) => {
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
  const monthYear = date.toISOString().slice(0, 7); // YYYY-MM format
  return createMonthlyRecord(monthYear);
}).sort((a, b) => b.monthYear.localeCompare(a.monthYear));