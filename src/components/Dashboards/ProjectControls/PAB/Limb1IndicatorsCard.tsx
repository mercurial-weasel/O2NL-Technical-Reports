import React from 'react';
import { Card } from '../../../common/Card';
import { Chevron } from '../../Common/Chevron';

interface Limb1_Costs_to_Completion {
  text: string;
  indicator: string;
  backgroundColor?: string;
  textColor?: string;
}

export function Limb1IndicatorsCard() {
  const indicators: Limb1_Costs_to_Completion[] = [
    {
      text: "Main Shared Works",
      indicator: "0.2m",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Main Non-Shared Workss",
      indicator: "0.3m",
      backgroundColor: "bg-blue-900"
    },	
    {
      text: "Initiative #1",
      indicator: "",
      backgroundColor: "bg-blue-900"
    },		
    {
      text: "Initiative #1",
      indicator: "",
      backgroundColor: "bg-blue-900"
    }			
  ];

  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching other cards style */}
      <div className="w-full bg-blue-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        LIMB1 COSTS TO COMPLETION
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-1">
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