import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from './Select';

describe('Select component', () => {
  it('renders select trigger and opens options on click', async () => {
    const user = userEvent.setup();

    render(
      <Select defaultValue="apple">
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
  });

  it('renders different sizes and variants', () => {
    const { rerender } = render(
      <Select>
        <SelectTrigger size="sm" variant="filled" data-testid="trigger">
          <SelectValue placeholder="Test" />
        </SelectTrigger>
      </Select>
    );

    let trigger = screen.getByTestId('trigger');
    expect(trigger.className).toContain('size-sm');
    expect(trigger.className).toContain('variant-filled');

    rerender(
      <Select>
        <SelectTrigger size="lg" variant="outline" data-testid="trigger">
          <SelectValue placeholder="Test" />
        </SelectTrigger>
      </Select>
    );

    trigger = screen.getByTestId('trigger');
    expect(trigger.className).toContain('size-lg');
    expect(trigger.className).toContain('variant-outline');
  });

  it('handles invalid state with aria-invalid', () => {
    render(
      <Select>
        <SelectTrigger isInvalid data-testid="trigger">
          <SelectValue placeholder="Invalid Select" />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger.className).toContain('isInvalid');
  });
});
