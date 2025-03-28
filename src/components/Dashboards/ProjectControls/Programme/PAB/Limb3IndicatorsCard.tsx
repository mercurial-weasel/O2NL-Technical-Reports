import React from 'react';
import { Card, Chevron } from '@common';
import { Limb3Indicators } from '@api/projectcontrols/programme';

interface Limb3IndicatorsCardProps {
  data: Limb3Indicators;
}

export function Limb3IndicatorsCard({ data }: Limb3IndicatorsCardProps) {
  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching other cards style */}
      <div className="w-full bg-orange-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        LIMB3 INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-1">
          {data.indicators.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <Chevron
                indicator={item.indicator}
                backgroundColor="bg-orange-900"
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