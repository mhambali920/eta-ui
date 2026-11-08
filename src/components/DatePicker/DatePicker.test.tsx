import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar, DatePicker, DateRangePicker } from './index';

describe('DatePicker & Calendar', () => {
  it('renders Calendar month header, navigates months, and selects a date', () => {
    const onChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2026, 4, 1)} // May 2026
        onChange={onChange}
      />
    );

    expect(screen.getByText('May 2026')).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: 'Next month' });
    fireEvent.click(nextBtn);
    expect(screen.getByText('June 2026')).toBeInTheDocument();

    const targetDate = new Date(2026, 5, 15);
    const dayBtn = screen.getByRole('gridcell', { name: targetDate.toDateString() });
    fireEvent.click(dayBtn);

    expect(onChange).toHaveBeenCalledWith(targetDate);
  });

  it('opens DatePicker popover, selects a date, and clears selection', () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue={new Date(2026, 10, 8)}
        onChange={onChange}
        aria-label="Event date"
      />
    );

    const trigger = screen.getByRole('button', { name: 'Event date' });
    expect(trigger).toHaveTextContent('Nov 8, 2026');

    const clearBtn = screen.getByRole('button', { name: 'Clear date' });
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('formats date using dateFormat presets and custom formatDate function', () => {
    const { rerender } = render(
      <DatePicker
        value={new Date(2026, 10, 8)}
        dateFormat="yyyy-mm-dd"
        aria-label="Formatted date"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Formatted date' });
    expect(trigger).toHaveTextContent('2026-11-08');

    rerender(
      <DatePicker
        value={new Date(2026, 10, 8)}
        dateFormat="dd/mm/yyyy"
        aria-label="Formatted date"
      />
    );
    expect(trigger).toHaveTextContent('08/11/2026');
  });

  it('disables dates outside minDate and maxDate constraints', () => {
    render(
      <Calendar
        defaultMonth={new Date(2026, 4, 10)}
        minDate={new Date(2026, 4, 5)}
        maxDate={new Date(2026, 4, 20)}
      />
    );

    const disabledEarly = screen.getByRole('gridcell', {
      name: new Date(2026, 4, 2).toDateString(),
    });
    const enabledMid = screen.getByRole('gridcell', {
      name: new Date(2026, 4, 12).toDateString(),
    });

    expect(disabledEarly).toBeDisabled();
    expect(enabledMid).not.toBeDisabled();
  });

  it('supports DateRangePicker range selection', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={{ from: new Date(2026, 4, 10) }}
        onChange={onChange}
        aria-label="Trip dates"
      />
    );

    const trigger = screen.getByRole('button', { name: 'Trip dates' });
    fireEvent.click(trigger);

    const endDay = screen.getByRole('gridcell', {
      name: new Date(2026, 4, 15).toDateString(),
    });
    fireEvent.click(endDay);

    expect(onChange).toHaveBeenCalledWith({
      from: new Date(2026, 4, 10),
      to: new Date(2026, 4, 15),
    });
  });
});
