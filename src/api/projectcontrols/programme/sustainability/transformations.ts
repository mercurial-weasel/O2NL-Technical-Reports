import { SustainabilityMonthlyRecord, SustainabilityRecords, Risk, Status } from './types';

// Calculate risk scores and sort risks
export function calculateRiskScores(risks: Risk[]) {
  return risks.map(risk => ({
    ...risk,
    score: risk.likelihood * risk.consequence
  })).sort((a, b) => b.score - a.score);
}

// Get overall status based on various factors
export function calculateOverallStatus(record: SustainabilityMonthlyRecord): Status {
  // Calculate risk score
  const riskScore = record.keyRisks.reduce((acc, risk) => 
    acc + (risk.likelihood * risk.consequence), 0) / record.keyRisks.length;

  // Calculate task completion
  const taskCompletion = record.tasksToComplete.reduce((acc, task) => 
    acc + task.completion, 0) / record.tasksToComplete.length;

  // Calculate KPI performance
  const kpiPerformance = record.kpis.reduce((acc, kpi) => 
    acc + (kpi.actual / kpi.target), 0) / record.kpis.length;

  // Determine status based on combined factors
  if (riskScore > 15 || taskCompletion < 50 || kpiPerformance < 0.7) {
    return 'red';
  } else if (riskScore > 10 || taskCompletion < 75 || kpiPerformance < 0.9) {
    return 'orange';
  }
  return 'green';
}

// Get month-over-month changes
export function calculateMonthlyChanges(currentMonth: SustainabilityMonthlyRecord, previousMonth: SustainabilityMonthlyRecord) {
  return {
    metrics: Object.keys(currentMonth.metrics).reduce((acc, key) => {
      acc[key] = {
        value: currentMonth.metrics[key],
        change: currentMonth.metrics[key] - (previousMonth.metrics[key] || 0),
        percentChange: ((currentMonth.metrics[key] - (previousMonth.metrics[key] || 0)) / 
          (previousMonth.metrics[key] || 1)) * 100
      };
      return acc;
    }, {} as Record<string, { value: number; change: number; percentChange: number }>),
    
    riskScore: {
      current: calculateRiskScores(currentMonth.keyRisks),
      previous: calculateRiskScores(previousMonth.keyRisks)
    },
    
    taskProgress: {
      completion: {
        current: currentMonth.tasksToComplete.reduce((acc, task) => acc + task.completion, 0) / 
          currentMonth.tasksToComplete.length,
        previous: previousMonth.tasksToComplete.reduce((acc, task) => acc + task.completion, 0) / 
          previousMonth.tasksToComplete.length
      },
      criticalPath: currentMonth.tasksToComplete.filter(task => task.critical_path)
    }
  };
}

// Get historical trends
export function calculateHistoricalTrends(records: SustainabilityRecords) {
  const sortedRecords = [...records].sort((a, b) => a.month.localeCompare(b.month));
  
  return {
    status: sortedRecords.map(record => ({
      month: record.month,
      status: record.status
    })),
    
    metrics: Object.keys(sortedRecords[0].metrics).reduce((acc, metric) => {
      acc[metric] = sortedRecords.map(record => ({
        month: record.month,
        value: record.metrics[metric]
      }));
      return acc;
    }, {} as Record<string, { month: string; value: number }[]>),
    
    kpis: sortedRecords[0].kpis.reduce((acc, kpi) => {
      acc[kpi.name] = sortedRecords.map(record => {
        const matchingKpi = record.kpis.find(k => k.name === kpi.name);
        return {
          month: record.month,
          actual: matchingKpi?.actual || 0,
          target: matchingKpi?.target || 0
        };
      });
      return acc;
    }, {} as Record<string, { month: string; actual: number; target: number }[]>)
  };
}

// Filter and aggregate data
export function filterAndAggregate(records: SustainabilityRecords, filters: {
  startDate?: string;
  endDate?: string;
  status?: Status[];
  metrics?: string[];
}) {
  let filtered = [...records];

  // Apply date range filter
  if (filters.startDate) {
    filtered = filtered.filter(record => record.month >= filters.startDate!);
  }
  if (filters.endDate) {
    filtered = filtered.filter(record => record.month <= filters.endDate!);
  }

  // Apply status filter
  if (filters.status?.length) {
    filtered = filtered.filter(record => filters.status!.includes(record.status));
  }

  // Aggregate metrics
  const aggregatedMetrics = filtered.reduce((acc, record) => {
    Object.entries(record.metrics).forEach(([key, value]) => {
      if (!filters.metrics || filters.metrics.includes(key)) {
        if (!acc[key]) acc[key] = { total: 0, average: 0, min: value, max: value };
        acc[key].total += value;
        acc[key].min = Math.min(acc[key].min, value);
        acc[key].max = Math.max(acc[key].max, value);
      }
    });
    return acc;
  }, {} as Record<string, { total: number; average: number; min: number; max: number }>);

  // Calculate averages
  Object.values(aggregatedMetrics).forEach(metric => {
    metric.average = metric.total / filtered.length;
  });

  return {
    records: filtered,
    metrics: aggregatedMetrics
  };
}