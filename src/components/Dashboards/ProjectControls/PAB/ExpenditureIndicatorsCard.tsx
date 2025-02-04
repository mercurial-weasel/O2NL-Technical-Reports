import React from 'react';
import { Card } from '../../../common/Card';
import { Chevron } from '../../Common/Chevron';

interface Expenditure {
  text: string;
  indicator: string;
  backgroundColor?: string;
  textColor?: string;
}

export function ExpenditureIndicatorsCard() {
  const indicators: Expenditure[] = [
    {
      text: "Monthly Cashflow Variance",
      indicator: "44.3",
      backgroundColor: "bg-purple-900"
    },
    {
      text: "Expenditure to data variance",
      indicator: "-6.40 %",
      backgroundColor: "bg-purple-900"
    }
  ];

  return (
    <Card className="p-0 overflow-hidden" hover glow>
      {/* Header matching other cards style */}
      <div className="w-full bg-purple-900 text-text-primary text-center py-1 px-3 border-b border-gray-700 font-semibold text-base">
        EXPENDITURE INDICATORS
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-1">
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