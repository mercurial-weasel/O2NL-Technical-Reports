import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@common/Card';
import { StatusIndicator } from './StatusIndicator';
import { TrendIndicator } from './TrendIndicator';
import { AMTItem } from '@data/amtData';

interface AMTCardProps {
  item: AMTItem;
}

export function AMTCard({ item }: AMTCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project-controls/amt/${item.id}`);
  };

  return (
    <Card 
      className="p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]" 
      hover 
      glow
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
        <div className="flex items-center gap-3">
          <StatusIndicator status={item.status} />
          <TrendIndicator trend={item.trend} />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-brand-secondary">Key Issues:</h4>
        <ul className="list-disc list-inside space-y-1">
          {item.keyIssues.map((issue, index) => (
            <li key={index} className="text-sm text-text-secondary">
              {issue}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}