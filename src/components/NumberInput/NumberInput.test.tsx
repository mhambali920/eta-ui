import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from './index';

describe('NumberInput', () => {
  it('renders spinbutton with initial value and increments/decrements via stepper buttons', () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={5} min={0} max={10} onChange={onChange} aria-label="Quantity" />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue('5');
    expect(input).toHaveAttribute('aria-valuenow', '5');

    const incBtn = screen.getByRole('button', { name: 'Increment value' });
    const decBtn = screen.getByRole('button', { name: 'Decrement value' });

    fireEvent.click(incBtn);
    expect(input).toHaveValue('6');
    expect(onChange).toHaveBeenCalledWith(6, '6');

    fireEvent.click(decBtn);
    expect(input).toHaveValue('5');
    expect(onChange).toHaveBeenCalledWith(5, '5');
  });

  it('clamps value to min and max and disables stepper buttons at boundaries', () => {
    render(<NumberInput defaultValue={9} min={0} max={10} step={2} aria-label="Bounded" />);

    const input = screen.getByRole('spinbutton', { name: 'Bounded' });
    const incBtn = screen.getByRole('button', { name: 'Increment value' });

    fireEvent.click(incBtn);
    expect(input).toHaveValue('10');
    expect(incBtn).toBeDisabled();
  });

  it('supports keyboard ArrowUp, ArrowDown, Home, and End navigation', () => {
    render(<NumberInput defaultValue={5} min={1} max={20} step={3} aria-label="Keyboard input" />);

    const input = screen.getByRole('spinbutton', { name: 'Keyboard input' });

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveValue('8');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveValue('5');

    fireEvent.keyDown(input, { key: 'Home' });
    expect(input).toHaveValue('1');

    fireEvent.keyDown(input, { key: 'End' });
    expect(input).toHaveValue('20');
  });

  it('formats decimal precision and respects disabled/isInvalid states', () => {
    render(
      <NumberInput
        defaultValue={12.5}
        step={0.25}
        precision={2}
        isInvalid
        disabled
        aria-label="Price"
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Price' });
    expect(input).toHaveValue('12.50');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
