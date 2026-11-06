import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './index';

describe('Input Component', () => {
  it('renders input with default properties', () => {
    render(<Input placeholder="Enter username" />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  it('handles size and variant props correctly', () => {
    const { container, rerender } = render(<Input size="sm" variant="filled" />);
    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('sm');
    expect(wrapper.className).toContain('filled');

    rerender(<Input size="lg" variant="outline" />);
    wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('lg');
    expect(wrapper.className).toContain('outline');
  });

  it('renders left and right adornments', () => {
    render(
      <Input
        leftAdornment={<span data-testid="prefix-icon">📧</span>}
        rightAdornment={<span data-testid="suffix-icon">✓</span>}
      />
    );
    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
  });

  it('applies invalid state and sets aria-invalid', () => {
    const { container } = render(<Input isInvalid placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    const wrapper = container.firstChild as HTMLElement;

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(wrapper.className).toContain('invalid');
  });

  it('handles disabled state properly', () => {
    const { container } = render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');
    const wrapper = container.firstChild as HTMLElement;

    expect(input).toBeDisabled();
    expect(wrapper.className).toContain('disabled');
  });

  it('toggles focus state and calls onFocus / onBlur callbacks', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { container } = render(
      <Input placeholder="Type here" onFocus={onFocus} onBlur={onBlur} />
    );
    const input = screen.getByPlaceholderText('Type here');
    const wrapper = container.firstChild as HTMLElement;

    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(wrapper.className).toContain('focused');

    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(wrapper.className).not.toContain('focused');
  });

  it('forwards ref to the underlying HTMLInputElement', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="With ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.placeholder).toBe('With ref');
  });
});
