import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelectFilter } from '../../../../../components/common/Filters/MultiSelectFilter';

describe('MultiSelectFilter', () => {
  const defaultProps = {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ],
    selectedValues: new Set(['all']),
    onChange: vi.fn(),
    placeholder: 'Select options'
  };

  it('renders correctly with default props', () => {
    render(<MultiSelectFilter {...defaultProps} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('displays placeholder when no options are selected', () => {
    render(
      <MultiSelectFilter 
        {...defaultProps} 
        selectedValues={new Set()} 
        placeholder="Custom placeholder"
      />
    );
    expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
  });

  it('shows selected count when some options are selected', () => {
    render(
      <MultiSelectFilter 
        {...defaultProps} 
        selectedValues={new Set(['option1', 'option2'])}
      />
    );
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('toggles dropdown on click', () => {
    render(<MultiSelectFilter {...defaultProps} />);
    
    const trigger = screen.getByTestId('multiselect-trigger');
    fireEvent.click(trigger);
    
    expect(screen.getByTestId('multiselect-dropdown')).toBeInTheDocument();
    
    fireEvent.click(trigger);
    expect(screen.queryByTestId('multiselect-dropdown')).not.toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    render(<MultiSelectFilter {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    fireEvent.click(screen.getByTestId('multiselect-option-option1'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('option1');
  });

  it('shows selection indicator for selected options', () => {
    render(
      <MultiSelectFilter 
        {...defaultProps} 
        selectedValues={new Set(['option1'])}
      />
    );
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    expect(screen.getAllByTestId('check-icon')).toHaveLength(1);
  });

  it('closes dropdown when clicking outside', () => {
    render(<MultiSelectFilter {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    expect(screen.getByTestId('multiselect-dropdown')).toBeInTheDocument();
    
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('multiselect-dropdown')).not.toBeInTheDocument();
  });

  it('handles "all" option correctly', () => {
    render(<MultiSelectFilter {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    fireEvent.click(screen.getByTestId('multiselect-all-option'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('all');
  });

  it('applies correct styles to dropdown', () => {
    render(<MultiSelectFilter {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    
    const dropdown = screen.getByTestId('multiselect-dropdown');
    expect(dropdown).toHaveClass(
      'absolute',
      'z-50',
      'w-full',
      'mt-2',
      'bg-gray-800/95',
      'border',
      'border-gray-700',
      'rounded-lg',
      'shadow-xl',
      'backdrop-blur-sm'
    );
  });

  it('handles empty options array', () => {
    render(
      <MultiSelectFilter
        {...defaultProps}
        options={[]}
      />
    );
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    expect(screen.getByTestId('multiselect-all-option')).toBeInTheDocument();
  });
});