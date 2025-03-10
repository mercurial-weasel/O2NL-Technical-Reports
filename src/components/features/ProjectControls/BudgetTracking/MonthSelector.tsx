import React from 'react';

interface MonthSelectorProps {
  selectedPeriod: string;
  availableMonths: string[];
  onPeriodChange: (period: string) => void;
}

export function MonthSelector({ selectedPeriod, availableMonths, onPeriodChange }: MonthSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value)}
        className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
      >
        {availableMonths.map(month => (
          <option key={month} value={month}>
            {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}