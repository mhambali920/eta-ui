import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from './index';

describe('Card', () => {
  it('renders all card subcomponents correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Soft Design System</CardTitle>
          <CardDescription>Calming aesthetics for modern web applications.</CardDescription>
        </CardHeader>
        <CardBody>
          <p>Main content area inside CardBody.</p>
        </CardBody>
        <CardFooter>
          <button>Confirm</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Soft Design System')).toBeInTheDocument();
    expect(screen.getByText('Calming aesthetics for modern web applications.')).toBeInTheDocument();
    expect(screen.getByText('Main content area inside CardBody.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('renders different variants and elevations', () => {
    const { container, rerender } = render(
      <Card variant="elevated" elevation="lg">
        Elevated
      </Card>
    );
    let card = container.firstChild as HTMLElement;
    expect(card.className).toContain('elevated');
    expect(card.className).toContain('elevation-lg');

    rerender(
      <Card variant="outline" padding="sm">
        Outlined
      </Card>
    );
    card = container.firstChild as HTMLElement;
    expect(card.className).toContain('outline');
    expect(card.className).toContain('padding-sm');
  });

  it('supports custom heading tags in CardTitle', () => {
    render(<CardTitle as="h2">Custom Heading H2</CardTitle>);
    const heading = screen.getByRole('heading', { level: 2, name: /custom heading h2/i });
    expect(heading).toBeInTheDocument();
  });

  it('handles interactive click state properly', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Card isInteractive onClick={handleClick}>
        Interactive Card
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('interactive');

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
