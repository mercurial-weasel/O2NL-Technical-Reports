import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';

interface DepthRangeSliderProps {
  minDepth: number;
  maxDepth: number;
  defaultValue?: [number, number];
  onChange: (value: [number, number]) => void;
}

export const DepthRangeSlider: React.FC<DepthRangeSliderPsrops> = ({
  minDepth,
  maxDepth,
  defaultValue = [0, 40],
  onChange
}) => {
  const [value, setValue] = useState<[number, number]>(defaultValue);

  // Update internal value when defaultValue changes
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Custom handler to ensure we call onChange with correct value type
  const handleChange = (newValue: number | readonly number[] | undefined) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const typedValue: [number, number] = [newValue[0], newValue[1]];
      setValue(typedValue);
      onChange(typedValue);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-text-primary">Depth Range (m)</label>
        <span className="text-sm text-text-muted">
          {value[0].toFixed(1)}m - {value[1].toFixed(1)}m
        </span>
      </div>
      
      <ReactSlider
        className="h-6 flex items-center"
        thumbClassName="h-5 w-5 rounded-full bg-primary cursor-grab focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2 hover:bg-primary-dark"
        trackClassName="h-2 bg-background-muted rounded-full"
        min={minDepth}
        max={maxDepth}
        value={value}
        onChange={handleChange}
        ariaLabel={['Lower depth value', 'Upper depth value']}
        ariaValuetext={state => `Depth range ${state.valueNow}`}
        pearling
        minDistance={1}
      />
      
      <div className="flex justify-between mt-1 text-xs text-text-muted">
        <span>{minDepth}m</span>
        <span>{maxDepth}m</span>
      </div>
    </div>
  );
};
