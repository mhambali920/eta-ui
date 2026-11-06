import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './index';

describe('Checkbox', () => {
  it('renders correctly with label and description', () => {
    render(
      <Checkbox
        label="Accept Terms"
        description="Please read our terms before proceeding."
      />
    );
    expect(screen.getByRole('checkbox', { name: /accept terms/i })).toBeInTheDocument();
    expect(screen.getByText('Please read our terms before proceeding.')).toBeInTheDocument();
  });

  it('handles state changes on click', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles disabled state properly', () => {
    render(<Checkbox label="Disabled option" disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('data-disabled');
  });

  it('applies invalid state with aria-invalid', () => {
    render(<Checkbox isInvalid label="Agree to policy" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox.className).toContain('invalid');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Checkbox size="sm" label="Small" />);
    let checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('sm');

    rerender(<Checkbox size="lg" label="Large" />);
    checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('lg');
  });

  it('renders indeterminate state', () => {
    render(<Checkbox checked="indeterminate" label="Indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });
});
