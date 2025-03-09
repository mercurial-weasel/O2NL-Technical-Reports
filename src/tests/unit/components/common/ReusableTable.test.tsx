import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReusableTable } from '../../../../components/Dashboards/Common/Tables/ReusableTable/ReusableTable';

describe('ReusableTable', () => {
  const defaultProps = {
    title: 'Test Table',
    sections: [
      {
        title: 'Section 1',
        columns: [
          { field: 'name', title: 'Name', align: 'left' }
        ]
      },
      {
        title: 'Section 2',
        columns: [
          { field: 'value', title: 'Value', align: 'right', formatter: (value: number) => `$${value}` },
          { field: 'status', title: 'Status', align: 'center' }
        ]
      }
    ],
    data: [
      { name: 'Item 1', value: 1000, status: 'Active', highlight: false },
      { name: 'Item 2', value: 2000, status: 'Inactive', highlight: true }
    ]
  };

  it('renders table with correct title', () => {
    render(<ReusableTable {...defaultProps} />);
    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  it('renders all section headers', () => {
    render(<ReusableTable {...defaultProps} />);
    defaultProps.sections.forEach(section => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
    });
  });

  it('renders all column headers', () => {
    render(<ReusableTable {...defaultProps} />);
    defaultProps.sections.forEach(section => {
      section.columns.forEach(column => {
        expect(screen.getByText(column.title)).toBeInTheDocument();
      });
    });
  });

  it('applies column alignment classes', () => {
    render(<ReusableTable {...defaultProps} />);
    const leftCell = screen.getByText('Item 1').closest('td');
    const rightCell = screen.getByText('$1000').closest('td');
    const centerCell = screen.getByText('Active').closest('td');

    expect(leftCell).toHaveClass('text-left');
    expect(rightCell).toHaveClass('text-right');
    expect(centerCell).toHaveClass('text-center');
  });

  it('applies formatter functions to cell values', () => {
    render(<ReusableTable {...defaultProps} />);
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('$2000')).toBeInTheDocument();
  });

  it('applies highlight styles to rows', () => {
    render(<ReusableTable {...defaultProps} />);
    const rows = screen.getAllByRole('row');
    const highlightedRow = rows.find(row => row.textContent?.includes('Item 2'));
    expect(highlightedRow).toHaveClass('bg-gray-800/30');
  });

  it('handles sorting when onSort is provided', () => {
    const onSort = vi.fn();
    render(<ReusableTable {...defaultProps} onSort={onSort} />);
    
    const nameHeader = screen.getByText('Name').closest('th');
    fireEvent.click(nameHeader!);
    
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('displays sort indicators correctly', () => {
    render(
      <ReusableTable 
        {...defaultProps} 
        sortConfig={{ field: 'name', direction: 'asc' }}
        onSort={() => {}}
      />
    );

    const sortIcon = screen.getByTestId('sort-icon-name');
    expect(sortIcon).toHaveClass('transform', 'rotate-0');
  });

  it('handles empty data array', () => {
    render(<ReusableTable {...defaultProps} data={[]} />);
    expect(screen.queryByRole('row')).not.toBeInTheDocument();
  });

  it('applies custom config styles', () => {
    const customConfig = {
      headerColor: 'bg-purple-900',
      textColor: 'text-white',
      highlightColor: 'bg-purple-800',
      highlightTextColor: 'text-white'
    };

    render(<ReusableTable {...defaultProps} config={customConfig} />);
    const header = screen.getByText('Test Table').closest('tr');
    expect(header).toHaveClass('bg-purple-900', 'text-white');
  });

  it('handles tooltips correctly', () => {
    const getTooltipContent = (row: any) => `Tooltip for ${row.name}`;
    render(<ReusableTable {...defaultProps} getTooltipContent={getTooltipContent} />);
    
    const firstRow = screen.getByText('Item 1').closest('tr');
    fireEvent.mouseEnter(firstRow!);
    
    expect(screen.getByText('Tooltip for Item 1')).toBeInTheDocument();
    
    fireEvent.mouseLeave(firstRow!);
    expect(screen.queryByText('Tooltip for Item 1')).not.toBeInTheDocument();
  });

  it('handles fixed rows correctly', () => {
    const dataWithFixed = [
      ...defaultProps.data,
      { name: 'Total', value: 3000, status: 'N/A', highlight: true }
    ];

    render(<ReusableTable {...defaultProps} data={dataWithFixed} fixedRows={1} />);
    const totalRow = screen.getByText('Total').closest('tr');
    expect(totalRow).toHaveClass('bg-gray-800/30');
  });
});