import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chevron } from '../../../../components/Dashboards/Common/Chevron/Chevron';

describe('Chevron', () => {
  const defaultProps = {
    indicator: '85%',
    backgroundColor: 'bg-blue-900',
    textColor: 'text-white',
    width: 100,
    height: 20,
    arrowWidth: 20
  };

  it('renders correctly with default props', () => {
    render(<Chevron {...defaultProps} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('applies correct dimensions', () => {
    render(<Chevron {...defaultProps} />);
    const container = screen.getByText('85%').closest('div');
    expect(container).toHaveStyle({
      width: '120px', // width + arrowWidth
      height: '20px'
    });
  });

  it('applies custom background color', () => {
    render(<Chevron {...defaultProps} backgroundColor="bg-red-900" />);
    const baseRect = screen.getByText('85%').parentElement;
    expect(baseRect).toHaveClass('bg-red-900');
  });

  it('applies custom text color', () => {
    render(<Chevron {...defaultProps} textColor="text-red-400" />);
    const textElement = screen.getByText('85%');
    expect(textElement).toHaveClass('text-red-400', 'font-bold');
  });

  it('handles custom width and height', () => {
    render(
      <Chevron
        {...defaultProps}
        width={150}
        height={30}
        arrowWidth={30}
      />
    );
    const container = screen.getByText('85%').closest('div');
    expect(container).toHaveStyle({
      width: '180px', // width + arrowWidth
      height: '30px'
    });
  });

  it('applies custom className', () => {
    render(<Chevron {...defaultProps} className="custom-class" />);
    const container = screen.getByText('85%').closest('.inline-block');
    expect(container).toHaveClass('custom-class');
  });

  it('maintains chevron shape with triangle element', () => {
    render(<Chevron {...defaultProps} />);
    const triangle = screen.getByText('85%')
      .parentElement
      ?.nextElementSibling;
    
    expect(triangle).toHaveStyle({
      clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
    });
  });

  it('centers text content', () => {
    render(<Chevron {...defaultProps} />);
    const textContainer = screen.getByText('85%').parentElement;
    expect(textContainer).toHaveClass(
      'flex',
      'items-center',
      'justify-center'
    );
  });

  it('handles long text content', () => {
    render(
      <Chevron
        {...defaultProps}
        indicator="Very Long Text Content"
      />
    );
    expect(screen.getByText('Very Long Text Content')).toBeInTheDocument();
  });

  it('maintains consistent structure with different content lengths', () => {
    const { rerender } = render(<Chevron {...defaultProps} indicator="Short" />);
    let container = screen.getByText('Short').closest('div');
    expect(container).toHaveStyle({
      width: '120px', // width + arrowWidth
      height: '20px'
    });

    rerender(<Chevron {...defaultProps} indicator="Much Longer Content Here" />);
    container = screen.getByText('Much Longer Content Here').closest('div');
    expect(container).toHaveStyle({
      width: '120px', // width + arrowWidth
      height: '20px'
    });
  });
});