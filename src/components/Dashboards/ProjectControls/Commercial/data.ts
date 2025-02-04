// Define types for the data structure
export interface Progress {
  Month: string;
  Planned: number;
  Earned: number;
}

export interface ProjectElement {
  Discipline: string;
  Element: string;
  'Direct Costs': number;
  'Limb 2': number;
  Total: number;
  'No of Months': number;
  'Plan Start': string;
  'Plan Finish': string;
  'Percent Wgt of Budget': number;
  Progress: Progress[];
}

export interface ProjectData {
  data: ProjectElement[];
}

// Export the data with proper typing
export const rawData: ProjectData = {
  data: [
    {
      Discipline: "AMT",
      Element: "General",
      "Direct Costs": 2257766,
      "Limb 2": 414986,
      Total: 2672752,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 100,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ]            
    },
    {
      Discipline: "Commercial",
      Element: "Implement & Operate Finance/Claim Systems",
      "Direct Costs": 281044,
      "Limb 2": 45888,
      Total: 326933,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 15,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ]            
    },
    {
      Discipline: "Commercial",
      Element: "Market Engagement/Tender Readiness",
      "Direct Costs": 46841,
      "Limb 2": 7648,
      Total: 54489,
      "No of Months": 2,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Oct-24",
      "Percent Wgt of Budget": 3,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 100,
          Earned: 100
        },
        {
          Month: "Nov-24",
          Planned: 100,
          Earned: 100
        }
      ]            
    },
    {
      Discipline: "Commercial",
      Element: "IPAA Procurement",
      "Direct Costs": 187363,
      "Limb 2": 30592,
      Total: 217955,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 10,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ]            
    },
    {
      Discipline: "Commercial",
      Element: "ITC Estimating",
      "Direct Costs": 1124177,
      "Limb 2": 183553,
      Total: 1307730,
      "No of Months": 5,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "13-Mar-25",
      "Percent Wgt of Budget": 60,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 10,
          Earned: 10
        },
        {
          Month: "Nov-24",
          Planned: 20,
          Earned: 20
        }
      ]            
    },
    {
      Discipline: "Commercial",
      Element: "Price Reconciliation",
      "Direct Costs": 187363,
      "Limb 2": 30592,
      Total: 217955,
      "No of Months": 2,
      "Plan Start": "13-Mar-25",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 10,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 0,
          Earned: 0
        }
      ]            
    },
    {
      Discipline: "Commercial",
      Element: "PAA Development incl KRA Framework",
      "Direct Costs": 46841,
      "Limb 2": 7648,
      Total: 54489,
      "No of Months": 5,
      "Plan Start": "1-Oct-24",
      "Plan Finish": "1-Feb-25",
      "Percent Wgt of Budget": 3,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 40,
          Earned: 50
        },
        {
          Month: "Nov-24",
          Planned: 60,
          Earned: 50
        }
      ]     
    },
    {
      Discipline: "Construction",
      Element: "Construction Method Planning",
      "Direct Costs": 570748,
      "Limb 2": 72501,
      Total: 643249,
      "No of Months": 2,
      "Plan Start": "1-Oct-24",
      "Plan Finish": "30-Nov-24",
      "Percent Wgt of Budget": 25,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 50,
          Earned: 50
        },
        {
          Month: "Nov-24",
          Planned: 80,
          Earned: 80
        }
      ]
    },
    {
      Discipline: "Construction",
      Element: "Construction Pricing Packs/Input to Pricing Packs",
      "Direct Costs": 684898,
      "Limb 2": 87001,
      Total: 771898,
      "No of Months": 3,
      "Plan Start": "14-Oct-24",
      "Plan Finish": "20-Dec-24",
      "Percent Wgt of Budget": 30,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 10,
          Earned: 10
        },
        {
          Month: "Nov-24",
          Planned: 45,
          Earned: 45
        }
      ]
    },
    {
      Discipline: "Construction",
      Element: "PAA Programme Development",
      "Direct Costs": 570748,
      "Limb 2": 72501,
      Total: 643249,
      "No of Months": 6,
      "Plan Start": "1-Oct-24",
      "Plan Finish": "15-Mar-25",
      "Percent Wgt of Budget": 25,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 17,
          Earned: 17
        },
        {
          Month: "Nov-24",
          Planned: 34,
          Earned: 34
        }
      ]
    },
    {
      Discipline: "Construction",
      Element: "Earthwork Trials",
      "Direct Costs": 456598,
      "Limb 2": 58000,
      Total: 514599,
      "No of Months": 2,
      "Plan Start": "11-Nov-24",
      "Plan Finish": "11-Dec-24",
      "Percent Wgt of Budget": 20,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 50,
          Earned: 75
        }
      ]
    },        
    {
      Discipline: "Design",
      Element: "Pricing Pack Development & Delivery",
      "Direct Costs": 4041084,
      "Limb 2": 1218335,
      Total: 5259419,
      "No of Months": 7,
      "Plan Start": "1-Oct-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 63,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 35,
          Earned: 39
        },
        {
          Month: "Nov-24",
          Planned: 60,
          Earned: 65
        }
      ]     
    },
    {
      Discipline: "Design",
      Element: "Joint Philosophy Statement",
      "Direct Costs": 128288,
      "Limb 2": 38677,
      Total: 166966,
      "No of Months": 2,
      "Plan Start": "1-Nov-24",
      "Plan Finish": "31-Dec-24",
      "Percent Wgt of Budget": 2,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 50,
          Earned: 80
        }
      ]     
    },
    {
      Discipline: "Design",
      Element: "Preliminary Design Report Preparation & Reviews",
      "Direct Costs": 962163,
      "Limb 2": 290080,
      Total: 1252243,
      "No of Months": 7,
      "Plan Start": "1-Oct-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 15,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 14,
          Earned: 14
        },
        {
          Month: "Nov-24",
          Planned: 28,
          Earned: 28
        }
      ]  
    },
    {
      Discipline: "Design",
      Element: "Site Investigations, Lab Testing & QA",
      "Direct Costs": 513154,
      "Limb 2": 154709,
      Total: 667863,
      "No of Months": 7,
      "Plan Start": "1-Oct-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 8,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 20,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 30,
          Earned: 25
        }
      ]  
    },
    {
      Discipline: "Design",
      Element: "Detailed Design Progression",
      "Direct Costs": 769730,
      "Limb 2": 232064,
      Total: 1001794,
      "No of Months": 4,
      "Plan Start": "1-Jan-25",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 12,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 0,
          Earned: 0
        }
      ]  
    },
    {
      Discipline: "Engineering",
      Element: "Develop Sustainability Approach",
      "Direct Costs": 67648,
      "Limb 2": 15170,
      Total: 82817,
      "No of Months": 2,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "18-Oct-24",
      "Percent Wgt of Budget": 3,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 100,
          Earned: 100
        },
        {
          Month: "Nov-24",
          Planned: 100,
          Earned: 100
        }
      ] 
    },
    {
      Discipline: "Engineering",
      Element: "Sustainability Outcomes Framework Development & Implementation",
      "Direct Costs": 338238,
      "Limb 2": 75849,
      Total: 414087,
      "No of Months": 7,
      "Plan Start": "21-Oct-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 15,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 14,
          Earned: 14
        },
        {
          Month: "Nov-24",
          Planned: 28,
          Earned: 28
        }
      ] 
    },
    {
      Discipline: "Engineering",
      Element: "Ongoing VE identification, realisation and optimisation",
      "Direct Costs": 180394,
      "Limb 2": 40453,
      Total: 220846,
      "No of Months": 7,
      "Plan Start": "14-Oct-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 8,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 14,
          Earned: 14
        },
        {
          Month: "Nov-24",
          Planned: 28,
          Earned: 28
        }
      ] 
    },
    {
      Discipline: "Engineering",
      Element: "Preparation and Delivery of Digital Management Plans",
      "Direct Costs": 1578443,
      "Limb 2": 353962,
      Total: 1932405,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 70,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ] 
    },
    {
      Discipline: "Engineering",
      Element: "MR Preparation & Review",
      "Direct Costs": 67648,
      "Limb 2": 15170,
      Total: 82817,
      "No of Months": 2,
      "Plan Start": "14-Oct-24",
      "Plan Finish": "30-Nov-24",
      "Percent Wgt of Budget": 3,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 100,
          Earned: 100
        }
      ] 
    },
    {
      Discipline: "Engineering",
      Element: "Finalise Departures",
      "Direct Costs": 22549,
      "Limb 2": 5057,
      Total: 27606,
      "No of Months": 2,
      "Plan Start": "13-Jan-25",
      "Plan Finish": "13-Feb-25",
      "Percent Wgt of Budget": 1,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 0,
          Earned: 0
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "Additional Consents (e.g Enabling Works)",
      "Direct Costs": 674926,
      "Limb 2": 208841,
      Total: 883767,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 30,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 10,
          Earned: 10
        },
        {
          Month: "Nov-24",
          Planned: 23,
          Earned: 23
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "Surveys & Monitoring",
      "Direct Costs": 157483,
      "Limb 2": 48730,
      Total: 206212,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 7,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 5,
          Earned: 5
        },
        {
          Month: "Nov-24",
          Planned: 18,
          Earned: 20
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "General Planning",
      "Direct Costs": 494945,
      "Limb 2": 153150,
      Total: 648096,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 22,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 50
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "OPW",
      "Direct Costs": 67493,
      "Limb 2": 20884,
      Total: 88377,
      "No of Months": 6,
      "Plan Start": "1-Nov-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 3,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 17,
          Earned: 17
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "Project Management",
      "Direct Costs": 179980,
      "Limb 2": 55691,
      Total: 235671,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 8,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "Management Plans",
      "Direct Costs": 674926,
      "Limb 2": 208841,
      Total: 883767,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 30,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ] 
    },
    {
      Discipline: "Environmental & Planning",
      Element: "VE Consenting",
      "Direct Costs": 0,
      "Limb 2": 0,
      Total: 0,
      "No of Months": 4,
      "Plan Start": "1-Nov-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 0,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 0,
          Earned: 0
        },
        {
          Month: "Nov-24",
          Planned: 0,
          Earned: 0
        }
      ] 
    },
    {
      Discipline: "Legacy Outcomes",
      Element: "General",
      "Direct Costs": 288960,
      "Limb 2": 36842,
      Total: 325802,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 100,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ] 
    },
    {
      Discipline: "People & Culture",
      Element: "General",
      "Direct Costs": 449139,
      "Limb 2": 57436,
      Total: 506575,
      "No of Months": 8,
      "Plan Start": "1-Sep-24",
      "Plan Finish": "30-Apr-25",
      "Percent Wgt of Budget": 100,
      Progress: [
        {
          Month: "Oct-24",
          Planned: 25,
          Earned: 25
        },
        {
          Month: "Nov-24",
          Planned: 38,
          Earned: 38
        }
      ] 
    }
  ]
};