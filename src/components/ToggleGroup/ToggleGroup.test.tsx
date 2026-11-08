import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle, ToggleGroup, ToggleGroupItem } from './index';

describe('Toggle & ToggleGroup', () => {
  it('toggles single Toggle button aria-pressed state', () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    const btn = screen.getByRole('button', { name: 'Bold' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('supports single-selection ToggleGroup with radio semantics', () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" defaultValue="day" onValueChange={onValueChange}>
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    );

    const dayBtn = screen.getByRole('radio', { name: 'Day' });
    const weekBtn = screen.getByRole('radio', { name: 'Week' });

    expect(dayBtn).toHaveAttribute('aria-checked', 'true');
    expect(weekBtn).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(weekBtn);
    expect(weekBtn).toHaveAttribute('aria-checked', 'true');
    expect(dayBtn).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).toHaveBeenCalledWith('week');
  });

  it('supports multiple-selection ToggleGroup and keyboard arrow navigation', () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" defaultValue={['bold']} onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    );

    const boldBtn = screen.getByRole('button', { name: 'Bold' });
    const italicBtn = screen.getByRole('button', { name: 'Italic' });

    boldBtn.focus();
    fireEvent.keyDown(boldBtn, { key: 'ArrowRight' });
    expect(italicBtn).toHaveFocus();

    fireEvent.click(italicBtn);
    expect(onValueChange).toHaveBeenCalledWith(['bold', 'italic']);
  });
});
