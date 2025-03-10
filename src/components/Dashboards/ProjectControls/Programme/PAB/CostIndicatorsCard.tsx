import React from 'react';
import { Card, Chevron } from '@common';
import { CostIndicators } from '@api/projectcontrols/programme';

interface CostIndicatorsCardProps {
  data: CostIndicators;
}

export function CostIndicatorsCard({ data }: CostIndicatorsCardProps) {
  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching Cost card style */}
      <div className="w-full bg-blue-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        COST INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-1">
          {data.indicators.map((item, index) => (
            <div key={index} className={`flex flex-col items-center ${index >= 2 ? 'mt-1' : ''}`}>
              <Chevron
                indicator={item.indicator}
                backgroundColor="bg-blue-900"
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