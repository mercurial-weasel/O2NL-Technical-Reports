import React from 'react';
import { Card } from '../../../common/Card';
import { Chevron } from '../../Common/Chevron';
import { ExpenditureIndicators } from '../../../../api/cost/pab/types';

interface ExpenditureIndicatorsCardProps {
  data: ExpenditureIndicators;
}

export function ExpenditureIndicatorsCard({ data }: ExpenditureIndicatorsCardProps) {
  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching other cards style */}
      <div className="w-full bg-purple-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        EXPENDITURE INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-1">
          {data.indicators.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <Chevron
                indicator={item.indicator}
                backgroundColor="bg-purple-900"
                textColor={item.textColor}
                width={100}
                height={20}
                className="transform hover:scale-105 transition-transform duration-200"
              />
              <div className="text-xs text-text-secondary mt-1 text-center px-2">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}