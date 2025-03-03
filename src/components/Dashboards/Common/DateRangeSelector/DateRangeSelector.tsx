import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeSelectorProps {
  dateRange: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
}

export function DateRangeSelector({ dateRange, onChange }: DateRangeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Date Range
      </label>
      <div className="flex items-center gap-4">
        <DatePicker
          selected={dateRange[0]}
          onChange={(date) => onChange([date, dateRange[1]])}
          selectsStart
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          placeholderText="Start Date"
          className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          wrapperClassName="flex-1"
        />
        <DatePicker
          selected={dateRange[1]}
          onChange={(date) => onChange([dateRange[0], date])}
          selectsEnd
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          minDate={dateRange[0]}
          placeholderText="End Date"
          className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          wrapperClassName="flex-1"
        />
      </div>
    </div>
  );
}