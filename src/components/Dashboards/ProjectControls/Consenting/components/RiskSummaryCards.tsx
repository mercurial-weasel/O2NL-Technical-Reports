import React from 'react';
import { Card } from '../../../../common/Card';
import { RiskSummary } from '../../../../../api/programme/consenting/transformations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RiskSummaryCardsProps {
  summary: RiskSummary;
}

export function RiskSummaryCards({ summary }: RiskSummaryCardsProps) {
  const cards = [
    {
      title: 'Total Assessments',
      value: summary.total,
      color: 'text-brand-primary'
    },
    {
      title: 'Green',
      value: summary.byLevel.green,
      color: 'text-green-400'
    },
    {
      title: 'Amber',
      value: summary.byLevel.amber,
      color: 'text-orange-400'
    },
    {
      title: 'Red',
      value: summary.byLevel.red,
      color: 'text-red-400'
    }
  ];

  const changes = [
    {
      title: 'Improved',
      value: summary.changes.improved,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Worsened',
      value: summary.changes.worsened,
      icon: TrendingDown,
      color: 'text-red-400'
    },
    {
      title: 'Unchanged',
      value: summary.changes.unchanged,
      icon: Minus,
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Risk Level Summary */}
      <Card className="p-6" hover>
        <h3 className="text-lg font-medium text-text-primary mb-4">Risk Level Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.title} className="text-center">
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <div className="text-sm text-text-secondary mt-1">
                {card.title}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Changes */}
      <Card className="p-6" hover>
        <h3 className="text-lg font-medium text-text-primary mb-4">Risk Changes</h3>
        <div className="grid grid-cols-3 gap-4">
          {changes.map((change) => (
            <div key={change.title} className="text-center">
              <div className={`text-2xl font-bold ${change.color} flex items-center justify-center gap-2`}>
                <change.icon className="w-5 h-5" />
                {change.value}
              </div>
              <div className="text-sm text-text-secondary mt-1">
                {change.title}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}