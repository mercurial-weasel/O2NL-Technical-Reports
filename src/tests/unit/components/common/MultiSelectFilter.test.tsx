import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelectFilter } from '../../../../components/common/Filters/MultiSelectFilter';

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
    expect(screen.getByTestId('multiselect-trigger')).toBeInTheDocument();
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
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    expect(screen.getByTestId('multiselect-dropdown')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
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
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
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

  it('applies correct styles to selected options', () => {
    render(
      <MultiSelectFilter 
        {...defaultProps} 
        selectedValues={new Set(['option1'])}
      />
    );
    
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    const selectedOption = screen.getByTestId('multiselect-option-option1');
    expect(selectedOption).toHaveClass('text-text-primary');
  });
});