import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './index';

describe('Textarea Component', () => {
  it('renders correctly with default props', () => {
    render(<Textarea placeholder="Enter your comments..." />);
    const textarea = screen.getByPlaceholderText('Enter your comments...');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('handles size and variant props correctly', () => {
    const { rerender } = render(<Textarea placeholder="Check sizes" size="sm" variant="filled" />);
    let textarea = screen.getByPlaceholderText('Check sizes');
    expect(textarea.className).toContain('sm');
    expect(textarea.className).toContain('filled');

    rerender(<Textarea placeholder="Check sizes" size="lg" variant="outline" />);
    textarea = screen.getByPlaceholderText('Check sizes');
    expect(textarea.className).toContain('lg');
    expect(textarea.className).toContain('outline');
  });

  it('handles resize options correctly', () => {
    const { rerender } = render(<Textarea placeholder="Resize test" resize="none" />);
    let textarea = screen.getByPlaceholderText('Resize test');
    expect(textarea.className).toContain('resize-none');

    rerender(<Textarea placeholder="Resize test" resize="both" />);
    textarea = screen.getByPlaceholderText('Resize test');
    expect(textarea.className).toContain('resize-both');
  });

  it('handles invalid state with aria-invalid', () => {
    render(<Textarea placeholder="Error textarea" isInvalid />);
    const textarea = screen.getByPlaceholderText('Error textarea');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea.className).toContain('invalid');
  });

  it('handles disabled state properly', () => {
    render(<Textarea placeholder="Disabled textarea" disabled />);
    const textarea = screen.getByPlaceholderText('Disabled textarea');
    expect(textarea).toBeDisabled();
    expect(textarea.className).toContain('disabled');
  });

  it('handles onChange and forwards ref correctly', () => {
    const handleChange = vi.fn();
    const ref = createRef<HTMLTextAreaElement>();

    render(
      <Textarea
        ref={ref}
        placeholder="Type notes"
        onChange={handleChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Type notes');
    fireEvent.change(textarea, { target: { value: 'New text message' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.value).toBe('New text message');
  });
});
