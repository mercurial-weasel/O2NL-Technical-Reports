import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from '../../../../components/common/Section';

describe('Section', () => {
  it('renders children correctly', () => {
    render(
      <Section>
        <div data-testid="section-content">Test Content</div>
      </Section>
    );
    
    expect(screen.getByTestId('section-content')).toBeInTheDocument();
    expect(screen.getByTestId('section-content')).toHaveTextContent('Test Content');
  });

  it('applies custom className', () => {
    render(
      <Section className="custom-class">
        <div>Content</div>
      </Section>
    );
    
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('custom-class');
  });

  it('maintains proper nesting structure', () => {
    render(
      <Section>
        <div>Parent Content</div>
        <Section>Nested Content</Section>
      </Section>
    );
    
    const sections = screen.getAllByTestId('section');
    expect(sections).toHaveLength(2);
    expect(sections[0]).toContainElement(sections[1]);
  });

  it('handles empty content', () => {
    render(<Section />);
    const section = screen.getByTestId('section');
    expect(section).toBeInTheDocument();
  });

  it('wraps content in Container component', () => {
    render(
      <Section>
        <div>Content</div>
      </Section>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
  });

  it('provides proper ARIA attributes', () => {
    render(<Section />);
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-label', 'Content Section');
  });

  it('preserves event handlers on children', () => {
    const handleClick = vi.fn();
    render(
      <Section>
        <button onClick={handleClick}>Click Me</button>
      </Section>
    );
    
    screen.getByText('Click Me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});