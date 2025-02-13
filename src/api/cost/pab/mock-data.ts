// src/api/cost/pab/mock-data.ts
import { PABResponse } from './types';

// Generate sample data for 13 months from Jan 2024 to Jan 2025
const months = [
  'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 
  'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25'
];

// Sample planned monthly expenditure (millions)
const plannedMonthly = [
  2.5, 3.0, 3.2, 3.5, 3.8, 4.0,
  4.2, 4.5, 4.8, 5.0, 5.2, 5.5, 5.8
];

// Sample actual monthly expenditure (millions)
const actualMonthly = [
  2.3, 2.8, 3.0, 3.3, 3.6, 3.8,
  4.0, 4.3, 4.6, null, null, null, null // null for future months
];

// Sample forecast monthly expenditure (millions)
const forecastMonthly = [
  null, null, null, null, null, null,
  null, null, 4.6, 4.8, 5.0, 5.3, 5.6 // null for past months
];

// Calculate cumulative values
const plannedCumulative = plannedMonthly.reduce((acc, val, i) => {
  acc.push((acc[i - 1] || 0) + val);
  return acc;
}, [] as number[]);

const actualCumulative = actualMonthly.reduce((acc, val, i) => {
  if (val === null) {
    acc.push(null);
  } else {
    acc.push((acc[i - 1] || 0) + val);
  }
  return acc;
}, [] as (number | null)[]);

const forecastCumulative = forecastMonthly.reduce((acc, val, i) => {
  if (val === null) {
    acc.push(null);
  } else {
    // Start forecast from last actual value
    const lastActual = actualCumulative.find((v, idx) => v !== null && idx < i);
    acc.push((acc[i - 1] || lastActual || 0) + val);
  }
  return acc;
}, [] as (number | null)[]);

export const mockPABData: PABResponse = {
  expenditure: {
    months,
    planned: {
      monthly: plannedMonthly,
      cumulative: plannedCumulative
    },
    actual: {
      monthly: actualMonthly,
      cumulative: actualCumulative
    },
    forecast: {
      monthly: forecastMonthly,
      cumulative: forecastCumulative
    }
  },
  fundingSplit: {
    currentMonth: [
      { name: 'McConnell Dowell', value: 35 },
      { name: 'Downer', value: 30 },
      { name: 'Beca', value: 20 },
      { name: 'T+T', value: 15 }
    ],
    projectSplit: [
      { name: 'McConnell Dowell', value: 40 },
      { name: 'Downer', value: 35 },
      { name: 'Beca', value: 15 },
      { name: 'T+T', value: 10 }
    ]
  },
  lastUpdated: new Date().toISOString()
};
