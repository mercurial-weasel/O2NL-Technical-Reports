export interface AMTBudgetItem {
  ID: number;
  WORKSTREAM: string;
  HOURS1: number;
  TOTAL1: number;
  HOURS2: number;
  TOTAL2: number;
  HOURS_DIFF: number;
  TOTAL_DIFF: number;
}

export interface BudgetSummary {
  TOTAL_LABOUR: {
    HOURS1: number;
    TOTAL1: number;
    HOURS2: number;
    TOTAL2: number;
    HOURS_DIFF: number;
    TOTAL_DIFF: number;
  };
  TOTAL_EXPENSES: {
    TOTAL1: number;
    TOTAL2: number;
    TOTAL_DIFF: number;
  };
  TOTAL_ALL: {
    HOURS1: number;
    TOTAL1: number;
    HOURS2: number;
    TOTAL2: number;
    HOURS_DIFF: number;
    TOTAL_DIFF: number;
  };
}

export interface AMTBudgetData {
  AMTBudgetTrackingData: AMTBudgetItem[];
  summary: BudgetSummary;
}

// Helper function to convert currency string to number
const currencyToNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[$,]/g, ''));
};

export const budgetData: AMTBudgetData = {
  AMTBudgetTrackingData: [
    {
      ID: 1,
      WORKSTREAM: "Alliance Management",
      HOURS1: 9216,
      TOTAL1: 2672752,
      HOURS2: 8932,
      TOTAL2: 2523498,
      HOURS_DIFF: -284,
      TOTAL_DIFF: 149254
    },
    {
      ID: 2,
      WORKSTREAM: "Commercial",
      HOURS1: 13024,
      TOTAL1: 2179550,
      HOURS2: 11791,
      TOTAL2: 1918474,
      HOURS_DIFF: -1234,
      TOTAL_DIFF: -261076
    },
    {
      ID: 3,
      WORKSTREAM: "Construction",
      HOURS1: 18428,
      TOTAL1: 2572994,
      HOURS2: 17750,
      TOTAL2: 2373151,
      HOURS_DIFF: -678,
      TOTAL_DIFF: -199843
    },
    {
      ID: 4,
      WORKSTREAM: "Legacy Outcomes",
      HOURS1: 2408,
      TOTAL1: 325802,
      HOURS2: 937,
      TOTAL2: 163486,
      HOURS_DIFF: -1471,
      TOTAL_DIFF: -162316
    },
    {
      ID: 5,
      WORKSTREAM: "People & Culture",
      HOURS1: 3668,
      TOTAL1: 506574,
      HOURS2: 3477,
      TOTAL2: 568777,
      HOURS_DIFF: -192,
      TOTAL_DIFF: 62203
    },
    {
      ID: 6,
      WORKSTREAM: "Engineering Management",
      HOURS1: 11476,
      TOTAL1: 2244293,
      HOURS2: 10470,
      TOTAL2: 1863571,
      HOURS_DIFF: -1006,
      TOTAL_DIFF: -380722
    },
    {
      ID: 7,
      WORKSTREAM: "Environmental & Planning",
      HOURS1: 13322,
      TOTAL1: 2945889,
      HOURS2: 13661,
      TOTAL2: 2913852,
      HOURS_DIFF: 339,
      TOTAL_DIFF: -32037
    },
    {
      ID: 8,
      WORKSTREAM: "Design - Management & Support",
      HOURS1: 2176,
      TOTAL1: 592888,
      HOURS2: 2421,
      TOTAL2: 669657,
      HOURS_DIFF: 245,
      TOTAL_DIFF: 76769
    },
    {
      ID: 9,
      WORKSTREAM: "Design - Transport & Traffic",
      HOURS1: 1608,
      TOTAL1: 502702,
      HOURS2: 4826,
      TOTAL2: 1235720,
      HOURS_DIFF: 3218,
      TOTAL_DIFF: 733018
    },
    {
      ID: 10,
      WORKSTREAM: "Design - Roading",
      HOURS1: 3660,
      TOTAL1: 915767,
      HOURS2: 7984,
      TOTAL2: 2096079,
      HOURS_DIFF: 4324,
      TOTAL_DIFF: 1180312
    },
    {
      ID: 11,
      WORKSTREAM: "Design - Stormwater",
      HOURS1: 4946,
      TOTAL1: 1132649,
      HOURS2: 8982,
      TOTAL2: 1903758,
      HOURS_DIFF: 4036,
      TOTAL_DIFF: 771109
    },
    {
      ID: 12,
      WORKSTREAM: "Design - Pavements",
      HOURS1: 264,
      TOTAL1: 98438,
      HOURS2: 0,
      TOTAL2: 0,
      HOURS_DIFF: -264,
      TOTAL_DIFF: -98438
    },
    {
      ID: 13,
      WORKSTREAM: "Design - Utilities",
      HOURS1: 148,
      TOTAL1: 38469,
      HOURS2: 0,
      TOTAL2: 0,
      HOURS_DIFF: -148,
      TOTAL_DIFF: -38469
    },
    {
      ID: 14,
      WORKSTREAM: "Design - Geotechnical",
      HOURS1: 10540,
      TOTAL1: 2135730,
      HOURS2: 16527,
      TOTAL2: 3412615,
      HOURS_DIFF: 5987,
      TOTAL_DIFF: 1276885
    },
    {
      ID: 15,
      WORKSTREAM: "Design - Structures",
      HOURS1: 4420,
      TOTAL1: 1282739,
      HOURS2: 5224,
      TOTAL2: 1394188,
      HOURS_DIFF: 804,
      TOTAL_DIFF: 111449
    },
    {
      ID: 16,
      WORKSTREAM: "Design - Urban & Landscape",
      HOURS1: 2860,
      TOTAL1: 805107,
      HOURS2: 3481,
      TOTAL2: 896727,
      HOURS_DIFF: 621,
      TOTAL_DIFF: 91620
    },
    {
      ID: 17,
      WORKSTREAM: "Sustainability",
      HOURS1: 1920,
      TOTAL1: 516286,
      HOURS2: 1181,
      TOTAL2: 301008,
      HOURS_DIFF: -739,
      TOTAL_DIFF: -215278
    },
    {
      ID: 18,
      WORKSTREAM: "Design - Digital",
      HOURS1: 1904,
      TOTAL1: 386964,
      HOURS2: 2372,
      TOTAL2: 587748,
      HOURS_DIFF: 468,
      TOTAL_DIFF: 200784
    },
    {
      ID: 19,
      WORKSTREAM: "Design - Survey",
      HOURS1: 2768,
      TOTAL1: 456830,
      HOURS2: 2186,
      TOTAL2: 414660,
      HOURS_DIFF: -583,
      TOTAL_DIFF: -42170
    },
    {
      ID: 20,
      WORKSTREAM: "Design - Site Compound",
      HOURS1: 0,
      TOTAL1: 0,
      HOURS2: 876,
      TOTAL2: 169224,
      HOURS_DIFF: 876,
      TOTAL_DIFF: 169224
    },
    {
      ID: 21,
      WORKSTREAM: "Additional Delivery Roles",
      HOURS1: 3520,
      TOTAL1: 559841,
      HOURS2: 3391,
      TOTAL2: 509891,
      HOURS_DIFF: -130,
      TOTAL_DIFF: -49950
    }
  ],
  summary: {
    TOTAL_LABOUR: {
      HOURS1: 112276,
      TOTAL1: 22872266,
      HOURS2: 126466,
      TOTAL2: 25916083,
      HOURS_DIFF: 14190,
      TOTAL_DIFF: 3043817
    },
    TOTAL_EXPENSES: {
      TOTAL1: 3520474,
      TOTAL2: 3996827,
      TOTAL_DIFF: 476353
    },
    TOTAL_ALL: {
      HOURS1: 112276,
      TOTAL1: 26392740,
      HOURS2: 126466,
      TOTAL2: 29912910,
      HOURS_DIFF: 14190,
      TOTAL_DIFF: 3520170
    }
  }
};