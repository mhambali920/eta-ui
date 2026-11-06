import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './index';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>New Feature</Badge>);
    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });

  it('supports variants, colors, and sizes', () => {
    const { container, rerender } = render(
      <Badge variant="solid" color="success" size="sm">
        Active
      </Badge>
    );
    let badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('solid');
    expect(badge.className).toContain('success');
    expect(badge.className).toContain('sm');

    rerender(
      <Badge variant="outline" color="danger" size="lg" shape="rounded">
        Error
      </Badge>
    );
    badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('outline');
    expect(badge.className).toContain('danger');
    expect(badge.className).toContain('lg');
    expect(badge.className).toContain('rounded');
  });

  it('renders dot indicator when hasDot is true', () => {
    const { container } = render(<Badge hasDot>Live</Badge>);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });
});
