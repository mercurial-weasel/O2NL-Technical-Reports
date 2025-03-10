import { ConsentMonth } from './types';

export const mockConsentData: Record<string, ConsentMonth> = {
  "2025-01": {
    monthYear: "2025-01",
    assessments: [
      {
        id: "2025-01-1",
        designChange: "Kuku Stream – providing culvert options for 'no access' option",
        proposedConsentPathway: "s127 application",
        currentRiskLevel: "Green",
        comments: "Good progress with no partners to date on support. For discussion with councils in mid-February",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2025-01-2",
        designChange: "Changes to fish passage requirements – project-wide",
        proposedConsentPathway: "s127 application",
        currentRiskLevel: "Green",
        comments: "Good progress with iwi partners to obtain support.For discussion with councils in mid-February.",
        timestamp: new Date().toISOString(),
        riskChange: "Up"
      },
      {
        id: "2025-01-3",
        designChange: "Marakau Heights – removal of certain bridge",
        proposedConsentPathway: "Outline plan",
        currentRiskLevel: "Amber",
        comments: "Initial council feedback is that an outline plan approach may be acceptable. Further work to confirm effects acceptable and agree this approach – remains high risk for now.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2025-01-4",
        designChange: "Shared User Path (staged approach) – Outline Plan to show Stage 1 only (limited areas of SUP) – project-wide",
        proposedConsentPathway: "Outline plan",
        currentRiskLevel: "Green",
        comments: "Councils generally support with providing staged outline plans for SUP. SUP changes will therefore not delay construction start.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2025-01-5",
        designChange: "Shared User Path – condition change to allow for completion of SUP >12 months from road opening – project-wide ",
        proposedConsentPathway: "Alteration to designation",
        currentRiskLevel: "Red",
        comments: "More work required to understand council position. Early indications are that they will not support this condition change.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2025-01-6",
        designChange: "Southern Interchange (Taylor's Road) – designation wording",
        proposedConsentPathway: "Alteration to designation",
        currentRiskLevel: "Amber",
        comments: "Not yet discussed in detail with KMA however Auckland Council anticipates wider KCDC/RTA/Fletcher agreement. Council has no delegated authority to agree/disagree with agreement for interchange design.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2025-01-7",
        designChange: "Project-wide – change conditions to allow for use of polymer (PMB) rather than epoxy binder (EPA7) in mainline surfacing",
        proposedConsentPathway: "Alteration to designation",
        currentRiskLevel: "Red",
        comments: "Outline plan will assume consented surfacing to minimise risk to programme. No current opportunities in NZ to test performance equivalency of PMB. Work currently underway to understand tolling implications for low noise road surfacing requirements.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      }
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      totalAssessments: 10,
      riskLevelSummary: {
        green: 4,
        yellow: 2,
        amber: 2,
        red: 2
      }
    }
  }, 
  "2024-12": {
    monthYear: "2024-12",
    assessments: [
      {
        id: "2024-12-1",
        designChange: "Kuku Stream – providing culvert options for 'no access' option",
        proposedConsentPathway: "s127 application",
        currentRiskLevel: "Green",
        comments: "Previous comment??",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2024-12-2",
        designChange: "Changes to fish passage requirements – project-wide",
        proposedConsentPathway: "s127 application",
        currentRiskLevel: "Amnber",
        comments: "Previous comments??.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2024-12-3",
        designChange: "Marakau Heights – removal of certain bridge",
        proposedConsentPathway: "Outline plan",
        currentRiskLevel: "Amber",
        comments: "Initial council feedback is that an outline plan approach may be acceptable. Further work to confirm effects acceptable and agree this approach – remains high risk for now.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2024-12-4",
        designChange: "Shared User Path (staged approach) – Outline Plan to show Stage 1 only (limited areas of SUP) – project-wide",
        proposedConsentPathway: "Outline plan",
        currentRiskLevel: "Green",
        comments: "Councils generally support with providing staged outline plans for SUP. SUP changes will therefore not delay construction start.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2024-12-5",
        designChange: "Shared User Path – condition change to allow for completion of SUP >12 months from road opening – project-wide ",
        proposedConsentPathway: "Alteration to designation",
        currentRiskLevel: "Red",
        comments: "More work required to understand council position. Early indications are that they will not support this condition change.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2024-12-6",
        designChange: "Southern Interchange (Taylor's Road) – designation wording",
        proposedConsentPathway: "Alteration to designation",
        currentRiskLevel: "Amber",
        comments: "Not yet discussed in detail with KMA however Auckland Council anticipates wider KCDC/RTA/Fletcher agreement. Council has no delegated authority to agree/disagree with agreement for interchange design.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      },
      {
        id: "2024-12-7",
        designChange: "Project-wide – change conditions to allow for use of polymer (PMB) rather than epoxy binder (EPA7) in mainline surfacing",
        proposedConsentPathway: "Alteration to designation",
        currentRiskLevel: "Red",
        comments: "Outline plan will assume consented surfacing to minimise risk to programme. No current opportunities in NZ to test performance equivalency of PMB. Work currently underway to understand tolling implications for low noise road surfacing requirements.",
        timestamp: new Date().toISOString(),
        riskChange: "Unknown"
      }
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      totalAssessments: 10,
      riskLevelSummary: {
        green: 3,
        yellow: 2,
        amber: 3,
        red: 2
      }
    }
  }  
};