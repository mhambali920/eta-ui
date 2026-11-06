import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './index';

describe('Switch', () => {
  it('renders correctly with label and description', () => {
    render(
      <Switch
        label="Airplane Mode"
        description="Disconnect all wireless connections"
      />
    );
    expect(screen.getByRole('switch', { name: /airplane mode/i })).toBeInTheDocument();
    expect(screen.getByText('Disconnect all wireless connections')).toBeInTheDocument();
  });

  it('handles state changes on click', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Dark Mode" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch');

    expect(toggle).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles disabled state properly', () => {
    render(<Switch label="Bluetooth" disabled />);
    const toggle = screen.getByRole('switch');

    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute('data-disabled');
  });

  it('applies invalid state with aria-invalid', () => {
    render(<Switch isInvalid label="Mandatory Opt-in" />);
    const toggle = screen.getByRole('switch');

    expect(toggle).toHaveAttribute('aria-invalid', 'true');
    expect(toggle.className).toContain('invalid');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Switch size="sm" label="Small" />);
    let toggle = screen.getByRole('switch');
    expect(toggle.className).toContain('sm');

    rerender(<Switch size="lg" label="Large" />);
    toggle = screen.getByRole('switch');
    expect(toggle.className).toContain('lg');
  });
});
