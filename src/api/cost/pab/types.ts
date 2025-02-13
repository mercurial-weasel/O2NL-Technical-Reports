// src/api/cost/pab/types.ts
export interface ExpenditureData {
  months: string[];
  planned: {
    monthly: number[];
    cumulative: number[];
  };
  actual: {
    monthly: (number | null)[];
    cumulative: (number | null)[];
  };
  forecast: {
    monthly: (number | null)[];
    cumulative: (number | null)[];
  };
}

export interface FundingSplitData {
  currentMonth: {
    name: string;
    value: number;
  }[];
  projectSplit: {
    name: string;
    value: number;
  }[];
}

export interface PABResponse {
  expenditure: ExpenditureData;
  fundingSplit: FundingSplitData;
  lastUpdated: string;
}
