import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from '../../../../components/common/Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="container-content">Test Content</div>
      </Container>
    );
    expect(screen.getByTestId('container-content')).toBeInTheDocument();
    expect(screen.getByTestId('container-content')).toHaveTextContent('Test Content');
  });

  it('applies default classes', () => {
    render(<Container>Content</Container>);
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
  });

  it('combines custom className with default classes', () => {
    render(<Container className="custom-class">Content</Container>);
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('custom-class', 'max-w-7xl', 'mx-auto');
  });

  it('maintains proper nesting structure', () => {
    render(
      <Container>
        <div>Parent Content</div>
        <Container>Nested Content</Container>
      </Container>
    );
    
    const containers = screen.getAllByTestId('container');
    expect(containers).toHaveLength(2);
    expect(containers[0]).toContainElement(containers[1]);
  });

  it('handles empty content', () => {
    render(<Container />);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('preserves event handlers on children', () => {
    const handleClick = vi.fn();
    render(
      <Container>
        <button onClick={handleClick}>Click Me</button>
      </Container>
    );
    
    screen.getByText('Click Me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});