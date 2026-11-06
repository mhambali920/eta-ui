import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, IconButton } from './index';

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders different variants and sizes', () => {
    const { rerender } = render(<Button variant="soft" size="lg">Soft Large</Button>);
    let button = screen.getByRole('button', { name: /soft large/i });
    expect(button.className).toContain('soft');
    expect(button.className).toContain('lg');

    rerender(<Button variant="outline" size="sm">Outline Small</Button>);
    button = screen.getByRole('button', { name: /outline small/i });
    expect(button.className).toContain('outline');
    expect(button.className).toContain('sm');
  });

  it('supports semantic colors (success, warning, danger, info, secondary)', () => {
    const { rerender } = render(<Button color="danger">Delete Item</Button>);
    let button = screen.getByRole('button', { name: /delete item/i });
    expect(button.className).toContain('danger');

    rerender(<Button color="success" variant="soft">Confirm</Button>);
    button = screen.getByRole('button', { name: /confirm/i });
    expect(button.className).toContain('success');
    expect(button.className).toContain('soft');

    rerender(<Button color="warning">Warning</Button>);
    button = screen.getByRole('button', { name: /warning/i });
    expect(button.className).toContain('warning');

    rerender(<Button color="info">Information</Button>);
    button = screen.getByRole('button', { name: /information/i });
    expect(button.className).toContain('info');
  });

  it('handles disabled state properly', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles isLoading state properly', () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('[role="status"]')).toBeInTheDocument();
  });

  it('renders asChild using Slot', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link as Button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /link as button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});

describe('IconButton', () => {
  it('renders an accessible icon button with aria-label', () => {
    render(
      <IconButton
        aria-label="Search items"
        icon={<span data-testid="search-icon">🔍</span>}
      />
    );
    const button = screen.getByRole('button', { name: /search items/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
});
