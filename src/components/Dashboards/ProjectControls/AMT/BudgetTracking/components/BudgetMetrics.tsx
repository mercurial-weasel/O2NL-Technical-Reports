import React from 'react';
import { Card } from '../../../../../common/Card/Card';
import { TrendingUp } from 'lucide-react';
import { BudgetMetric } from '../../../../../../api/cost/amt-budgets/transformations';

interface BudgetMetricsProps {
  metrics: BudgetMetric[];
  formatCurrency: (value: number) => string;
}

export function BudgetMetrics({ metrics, formatCurrency }: BudgetMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">{metric.title}</h3>
              <div className="text-2xl font-bold text-text-primary">{formatCurrency(metric.value)}</div>
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metric.status === 'positive' ? 'text-green-400' :
              metric.status === 'negative' ? 'text-red-400' :
              'text-text-secondary'
            }`}>
              {metric.change !== 0 && (
                <>
                  <TrendingUp className={`w-4 h-4 ${metric.change < 0 ? 'transform rotate-180' : ''}`} />
                  <span>{formatCurrency(Math.abs(metric.change))}</span>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}