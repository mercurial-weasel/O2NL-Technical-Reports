import React from 'react';
import { Card } from '../../../common/Card';
import { Chevron } from '../../Common/Chevron';

interface RiskIndicator {
  text: string;
  indicator: string;
  backgroundColor?: string;
  textColor?: string;
}

export function RiskIndicatorsCard() {
  const indicators: RiskIndicator[] = [
    {
      text: "Original Allocation",
      indicator: "3.2m",
      backgroundColor: "bg-red-900"
    },
    {
      text: "Current Exposure",
      indicator: "0.1m",
      backgroundColor: "bg-red-900"
    },	
    {
      text: "Retained Allocation",
      indicator: "0.71%",
      backgroundColor: "bg-red-900"
    },		
    {
      text: "Monthly Exposure Movement",
      indicator: "-0.02m",
      backgroundColor: "bg-red-900"
    },			
    {
      text: "Current Contingency",
      indicator: "0.75m",
      backgroundColor: "bg-red-900"
    },				
    {
      text: "Remaining Exposure and Allocation",
      indicator: "0.89m",
      backgroundColor: "bg-red-900"
    }
  ];

  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching other cards style */}
      <div className="w-full bg-red-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        RISK INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-1">
          {indicators.map((item, index) => (
            <div key={index} className={`flex flex-col items-center ${index >= 3 ? 'mt-1' : ''}`}>
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