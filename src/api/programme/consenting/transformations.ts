import { ConsentMonth, ConsentAssessment, RiskLevel } from './types';

export interface RiskSummary {
  total: number;
  byLevel: {
    green: number;
    amber: number;
    red: number;
  };
  changes: {
    improved: number;
    worsened: number;
    unchanged: number;
    unknown: number;
  };
}

export function calculateRiskSummary(data: ConsentMonth): RiskSummary {
  const summary: RiskSummary = {
    total: data.assessments.length,
    byLevel: {
      green: 0,
      amber: 0,
      red: 0
    },
    changes: {
      improved: 0,
      worsened: 0,
      unchanged: 0,
      unknown: 0
    }
  };

  data.assessments.forEach(assessment => {
    // Count by risk level
    summary.byLevel[assessment.currentRiskLevel.toLowerCase() as keyof typeof summary.byLevel]++;

    // Count by change
    switch (assessment.riskChange) {
      case 'Up':
        summary.changes.improved++;
        break;
      case 'Down':
        summary.changes.worsened++;
        break;
      case 'Unchanged':
        summary.changes.unchanged++;
        break;
      case 'Unknown':
        summary.changes.unknown++;
        break;
    }
  });

  return summary;
}

export function compareRiskLevels(current: RiskLevel, previous: RiskLevel): 'Up' | 'Down' | 'Unchanged' {
  const riskOrder: RiskLevel[] = ['Green', 'Amber', 'Red'];
  const currentIndex = riskOrder.indexOf(current);
  const previousIndex = riskOrder.indexOf(previous);

  if (currentIndex === previousIndex) return 'Unchanged';
  return currentIndex < previousIndex ? 'Up' : 'Down';
}

export function sortAssessmentsByRisk(assessments: ConsentAssessment[]): ConsentAssessment[] {
  const riskOrder: Record<RiskLevel, number> = {
    'Red': 2,
    'Amber': 1,
    'Green': 0
  };

  return [...assessments].sort((a, b) => {
    // First sort by risk level
    const riskDiff = riskOrder[b.currentRiskLevel] - riskOrder[a.currentRiskLevel];
    if (riskDiff !== 0) return riskDiff;

    // Then sort by timestamp (most recent first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export function getRiskTrend(months: ConsentMonth[]): {
  trend: 'improving' | 'worsening' | 'stable';
  percentage: number;
} {
  if (months.length < 2) return { trend: 'stable', percentage: 0 };

  const sortedMonths = [...months].sort((a, b) => 
    a.monthYear.localeCompare(b.monthYear)
  );

  const firstMonth = calculateRiskSummary(sortedMonths[0]);
  const lastMonth = calculateRiskSummary(sortedMonths[sortedMonths.length - 1]);

  // Calculate weighted risk scores
  const calculateScore = (summary: RiskSummary) => {
    return (
      summary.byLevel.red * 2 +
      summary.byLevel.amber * 1
    ) / summary.total;
  };

  const firstScore = calculateScore(firstMonth);
  const lastScore = calculateScore(lastMonth);
  const percentageChange = ((firstScore - lastScore) / firstScore) * 100;

  if (Math.abs(percentageChange) < 5) {
    return { trend: 'stable', percentage: Math.abs(percentageChange) };
  }

  return {
    trend: percentageChange > 0 ? 'improving' : 'worsening',
    percentage: Math.abs(percentageChange)
  };
}