import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup, Radio } from './index';

describe('RadioGroup & Radio', () => {
  it('renders radio options with labels and handles selection', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="email" onValueChange={onValueChange}>
        <Radio value="email" label="Email Notification" />
        <Radio value="sms" label="SMS Notification" />
      </RadioGroup>
    );

    const emailRadio = screen.getByRole('radio', { name: /email notification/i });
    const smsRadio = screen.getByRole('radio', { name: /sms notification/i });

    expect(emailRadio).toBeChecked();
    expect(smsRadio).not.toBeChecked();

    fireEvent.click(smsRadio);
    expect(onValueChange).toHaveBeenCalledWith('sms');
  });

  it('handles disabled radio item', () => {
    render(
      <RadioGroup>
        <Radio value="plan-a" label="Plan A" />
        <Radio value="plan-b" label="Plan B (Sold Out)" disabled />
      </RadioGroup>
    );

    const disabledRadio = screen.getByRole('radio', { name: /plan b/i });
    expect(disabledRadio).toBeDisabled();
    expect(disabledRadio).toHaveAttribute('data-disabled');
  });

  it('renders invalid state with aria-invalid', () => {
    render(
      <RadioGroup>
        <Radio value="terms" isInvalid label="Accept terms" />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-invalid', 'true');
    expect(radio.className).toContain('invalid');
  });

  it('supports horizontal orientation', () => {
    const { container } = render(
      <RadioGroup orientation="horizontal">
        <Radio value="1" label="One" />
        <Radio value="2" label="Two" />
      </RadioGroup>
    );

    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
  });
});
