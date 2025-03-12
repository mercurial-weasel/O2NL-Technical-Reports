import React, { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import styled from 'styled-components';

interface DepthRangeSliderProps {
  minDepth: number;
  maxDepth: number;
  defaultValue: [number, number];
  onChange: (value: [number, number]) => void;
}

// Styled components for the slider
const SliderRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 20px;
`;

const SliderTrack = styled(Slider.Track)`
  background-color: #e2e8f0;
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 4px;
`;

const SliderRange = styled(Slider.Range)`
  position: absolute;
  background-color: #3b82f6;
  border-radius: 9999px;
  height: 100%;
`;

const SliderThumb = styled(Slider.Thumb)`
  display: block;
  width: 16px;
  height: 16px;
  background-color: #1e40af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  
  &:hover {
    background-color: #1d4ed8;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const SliderContainer = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 10px 16px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  h3 {
    font-weight: 500;
    font-size: 0.875rem;
    color: #6B7280; /* Muted grey color */
    margin: 0;
  }
`;

const SliderValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.875rem;
  font-weight: 400;
  color: #6B7280; /* Muted grey color */
`;

export const DepthRangeSlider: React.FC<DepthRangeSliderProps> = ({
  minDepth,
  maxDepth,
  defaultValue,
  onChange,
}) => {
  const [value, setValue] = useState<[number, number]>(defaultValue);

  // Update the internal value when default value changes from parent
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Handle slider value change
  const handleValueChange = (newValue: number[]) => {
    const typedValue: [number, number] = [newValue[0], newValue[1]];
    setValue(typedValue);
    onChange(typedValue);
  };

  return (
    <SliderContainer>
      <SliderLabel>
        <h3>Depth Range Filter</h3>
      </SliderLabel>
      
      <SliderRoot
        min={minDepth}
        max={maxDepth}
        step={0.5}
        value={value}
        onValueChange={handleValueChange}
      >
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Min depth" />
        <SliderThumb aria-label="Max depth" />
      </SliderRoot>
      
      <SliderValues>
        <span>{value[0].toFixed(1)}m</span>
        <span>{value[1].toFixed(1)}m</span>
      </SliderValues>
    </SliderContainer>
  );
};
