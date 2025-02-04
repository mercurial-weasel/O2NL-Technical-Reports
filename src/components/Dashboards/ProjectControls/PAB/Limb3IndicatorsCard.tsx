import React from 'react';
import { Card } from '../../../common/Card';
import { Chevron } from '../../Common/Chevron';

interface Limb3 {
  text: string;
  indicator: string;
  backgroundColor?: string;
  textColor?: string;
}

export function Limb3IndicatorsCard() {
  const indicators: Limb3[] = [
    {
      text: "Dec 2024 Ops",
      indicator: "96.5%",
      backgroundColor: "bg-orange-900"
    },
    {
      text: "Jan 2025 Ops",
      indicator: "96%",
      backgroundColor: "bg-orange-900"
    },
    {
      text: "Final Rolling Averange Ops",
      indicator: "0.71%",
      backgroundColor: "bg-orange-900"
    }
  ];

  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching other cards style */}
      <div className="w-full bg-orange-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        LIMB3 INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-1">
          {indicators.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <Chevron
                indicator={item.indicator}
                backgroundColor={item.backgroundColor}
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