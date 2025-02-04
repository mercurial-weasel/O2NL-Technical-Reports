import React from 'react';
import { Card } from '../../../common/Card';
import { Chevron } from '../../Common/Chevron';

interface CostIndicator {
  text: string;
  indicator: string;
  backgroundColor?: string;
  textColor?: string;
}

export function CostIndicatorsCard() {
  const indicators: CostIndicator[] = [
    {
      text: "Planned Complete",
      indicator: "100%",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Actual Complete",
      indicator: "0.5m",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Schedule Variance (EV-PV)",
      indicator: "0%",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Schedule Variance (EV-PV)",
      indicator: "0%",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Actual Cost Limb 1",
      indicator: "2.5m",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Re-Based Earned Value Limb 1",
      indicator: "1.5m",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Limb 1 Cost Variable (EV-AC)",
      indicator: "1.1",
      backgroundColor: "bg-blue-900"
    },
    {
      text: "Cost Performance Index (EV/AC)",
      indicator: "1.01",
      backgroundColor: "bg-blue-900"
    }
  ];

  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching Cost card style */}
      <div className="w-full bg-blue-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        COST INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-1">
          {indicators.map((item, index) => (
            <div key={index} className={`flex flex-col items-center ${index >= 2 ? 'mt-1' : ''}`}>
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