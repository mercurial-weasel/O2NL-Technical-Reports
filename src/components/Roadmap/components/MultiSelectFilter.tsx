import React from 'react';
import { Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  options: Option[];
  selectedValues: Set<string>;
  onChange: (value: string) => void;
  placeholder: string;
}

export function MultiSelectFilter({ options, selectedValues, onChange, placeholder }: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary hover:bg-gray-700/50 transition-colors min-w-[200px]"
      >
        <span className="truncate">
          {selectedValues.size === 0 ? placeholder :
           selectedValues.has('all') ? 'All' :
           `${selectedValues.size} selected`}
        </span>
        <div className="flex items-center gap-2">
          {selectedValues.size > 0 && selectedValues.size < options.length && (
            <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800/95 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm">
          <div className="py-2 max-h-60 overflow-y-auto">
            {/* "All" option */}
            <button
              onClick={() => onChange('all')}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-700/50"
            >
              <span>All</span>
              {selectedValues.has('all') && (
                <Check className="w-4 h-4 text-brand-primary" />
              )}
            </button>

            <div className="border-t border-gray-700 my-1"></div>

            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-700/50"
              >
                <span>{option.label}</span>
                {selectedValues.has(option.value) && (
                  <Check className="w-4 h-4 text-brand-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}