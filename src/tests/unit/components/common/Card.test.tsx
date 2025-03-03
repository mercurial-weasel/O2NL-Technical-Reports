import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../../../../components/common/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Card>Content</Card>);
    const cardContent = screen.getByTestId('card-content');
    expect(cardContent).toHaveClass(
      'relative',
      'bg-gradient-to-br',
      'from-background-card-from',
      'to-background-card-to',
      'border',
      'border-border-primary',
      'rounded-lg'
    );
  });

  it('applies hover effect when hover prop is true', () => {
    render(<Card hover>Content</Card>);
    const cardWrapper = screen.getByTestId('card-wrapper');
    expect(cardWrapper).toHaveClass('group');
    expect(screen.getByTestId('card-content')).toHaveClass('group-hover:border-brand-primary/50');
  });

  it('applies glow effect when glow and hover props are true', () => {
    render(<Card hover glow>Content</Card>);
    const glowEffect = screen.getByTestId('glow-effect');
    expect(glowEffect).toHaveClass(
      'absolute',
      '-inset-0.5',
      'bg-gradient-to-r',
      'from-brand-primary/0',
      'via-brand-primary/20',
      'to-brand-primary/0',
      'rounded-lg',
      'blur',
      'opacity-0',
      'group-hover:opacity-100'
    );
  });

  it('combines custom className with default classes', () => {
    render(<Card className="custom-class">Content</Card>);
    const cardContent = screen.getByTestId('card-content');
    expect(cardContent).toHaveClass('custom-class');
    expect(cardContent).toHaveClass('relative', 'bg-gradient-to-br');
  });

  it('maintains proper nesting structure with hover effects', () => {
    render(
      <Card hover>
        <div>Parent Card</div>
        <Card hover>Nested Card</Card>
      </Card>
    );
    
    const wrappers = screen.getAllByTestId('card-wrapper');
    expect(wrappers).toHaveLength(2);
    expect(wrappers[0]).toHaveClass('group');
    expect(wrappers[1]).toHaveClass('group');
  });
});