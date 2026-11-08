import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './DatePicker.module.css';

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerVariant = 'outline' | 'filled';
export type DatePickerFormat =
  | 'medium'
  | 'short'
  | 'long'
  | 'full'
  | 'yyyy-mm-dd'
  | 'dd/mm/yyyy'
  | 'mm/dd/yyyy';

export interface DateRange {
  from?: Date;
  to?: Date;
}

function formatWithPreset(date: Date, dateFormat: DatePickerFormat, locale: string): string {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  switch (dateFormat) {
    case 'yyyy-mm-dd':
      return `${yyyy}-${mm}-${dd}`;
    case 'dd/mm/yyyy':
      return `${dd}/${mm}/${yyyy}`;
    case 'mm/dd/yyyy':
      return `${mm}/${dd}/${yyyy}`;
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      }).format(date);
    case 'long':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    case 'full':
      return new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    case 'medium':
    default:
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
  }
}

function isSameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function isBetween(day: Date, from?: Date, to?: Date): boolean {
  if (!from || !to) return false;
  const t = startOfDay(day);
  const start = Math.min(startOfDay(from), startOfDay(to));
  const end = Math.max(startOfDay(from), startOfDay(to));
  return t > start && t < end;
}

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  mode?: 'single' | 'range';
  value?: Date | DateRange;
  defaultValue?: Date | DateRange;
  onChange?: (value: Date | DateRange | undefined) => void;
  defaultMonth?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  locale?: string;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = 'single',
      value: controlledValue,
      defaultValue,
      onChange,
      defaultMonth,
      minDate,
      maxDate,
      disabledDates,
      locale = 'en-US',
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<Date | DateRange | undefined>(
      defaultValue
    );
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const initialViewDate = (() => {
      if (defaultMonth) return defaultMonth;
      if (currentValue instanceof Date) return currentValue;
      if (currentValue && 'from' in currentValue && currentValue.from) return currentValue.from;
      return new Date();
    })();

    const [viewYear, setViewYear] = useState(initialViewDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialViewDate.getMonth());

    const today = new Date();

    const monthFormatter = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    });

    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // Jan 7, 2024 is a Sunday
    const weekdays = Array.from({ length: 7 }, (_, i) =>
      weekdayFormatter.format(new Date(2024, 0, 7 + i)).slice(0, 2)
    );

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = firstDayOfMonth.getDay();
    const gridStartDate = new Date(viewYear, viewMonth, 1 - startOffset);

    const days = Array.from({ length: 42 }, (_, idx) => {
      const date = new Date(
        gridStartDate.getFullYear(),
        gridStartDate.getMonth(),
        gridStartDate.getDate() + idx
      );
      return {
        date,
        isOutside: date.getMonth() !== viewMonth,
      };
    });

    const isDateDisabled = (date: Date): boolean => {
      const time = startOfDay(date);
      if (minDate && time < startOfDay(minDate)) return true;
      if (maxDate && time > startOfDay(maxDate)) return true;
      if (disabledDates?.(date)) return true;
      return false;
    };

    const goToPrevMonth = () => {
      const prev = new Date(viewYear, viewMonth - 1, 1);
      setViewYear(prev.getFullYear());
      setViewMonth(prev.getMonth());
    };

    const goToNextMonth = () => {
      const next = new Date(viewYear, viewMonth + 1, 1);
      setViewYear(next.getFullYear());
      setViewMonth(next.getMonth());
    };

    const handleDayClick = (date: Date) => {
      if (isDateDisabled(date)) return;
      if (mode === 'single') {
        if (!isControlled) setUncontrolledValue(date);
        onChange?.(date);
      } else {
        const currentRange: DateRange =
          currentValue && !(currentValue instanceof Date) ? currentValue : {};
        let nextRange: DateRange;
        if (!currentRange.from || (currentRange.from && currentRange.to)) {
          nextRange = { from: date, to: undefined };
        } else if (startOfDay(date) < startOfDay(currentRange.from)) {
          nextRange = { from: date, to: currentRange.from };
        } else {
          nextRange = { from: currentRange.from, to: date };
        }
        if (!isControlled) setUncontrolledValue(nextRange);
        onChange?.(nextRange);
      }
    };

    const singleSelected = currentValue instanceof Date ? currentValue : undefined;
    const rangeSelected =
      currentValue && !(currentValue instanceof Date) ? currentValue : undefined;

    return (
      <div
        ref={ref}
        role="application"
        aria-label="Calendar"
        className={cn(styles.calendar, className)}
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.monthLabel}>
            {monthFormatter.format(new Date(viewYear, viewMonth, 1))}
          </span>
          <div className={styles.navGroup}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={goToPrevMonth}
              className={styles.navButton}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={goToNextMonth}
              className={styles.navButton}
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.weekdays} role="row">
          {weekdays.map((wd, idx) => (
            <span key={idx} className={styles.weekday} role="columnheader">
              {wd}
            </span>
          ))}
        </div>

        <div className={styles.grid} role="grid">
          {days.map(({ date, isOutside }, idx) => {
            const disabled = isDateDisabled(date);
            const isSelected =
              mode === 'single'
                ? isSameDay(date, singleSelected)
                : isSameDay(date, rangeSelected?.from) || isSameDay(date, rangeSelected?.to);
            const inRange =
              mode === 'range' && isBetween(date, rangeSelected?.from, rangeSelected?.to);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={idx}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-label={date.toDateString()}
                disabled={disabled}
                onClick={() => handleDayClick(date)}
                className={cn(
                  styles.dayButton,
                  isOutside && styles.dayOutside,
                  isToday && !isSelected && styles.dayToday,
                  inRange && styles.dayInRange,
                  isSelected && styles.daySelected
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Calendar.displayName = 'Calendar';

export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  isInvalid?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  locale?: string;
  dateFormat?: DatePickerFormat;
  formatDate?: (date: Date) => string;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Select date...',
      size = 'md',
      variant = 'outline',
      isInvalid = false,
      disabled = false,
      isClearable = true,
      minDate,
      maxDate,
      disabledDates,
      locale = 'en-US',
      dateFormat = 'medium',
      formatDate,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledDate, setUncontrolledDate] = useState<Date | undefined>(defaultValue);
    const selectedDate = isControlled ? controlledValue : uncontrolledDate;

    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const displayString = selectedDate
      ? formatDate
        ? formatDate(selectedDate)
        : formatWithPreset(selectedDate, dateFormat, locale)
      : '';

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(styles.root, className)}
        {...props}
      >
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={isInvalid || undefined}
          aria-label={props['aria-label'] ?? 'Choose date'}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={cn(
            styles.trigger,
            styles[size],
            styles[variant],
            open && styles.triggerOpen,
            isInvalid && styles.invalid
          )}
        >
          <span className={cn(styles.triggerText, !displayString && styles.placeholder)}>
            {displayString || placeholder}
          </span>
          <span className={styles.triggerActions}>
            {isClearable && selectedDate && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                className={styles.clearButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isControlled) setUncontrolledDate(undefined);
                  onChange?.(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isControlled) setUncontrolledDate(undefined);
                    onChange?.(undefined);
                  }
                }}
              >
                ×
              </span>
            )}
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="3" width="12" height="11" rx="2" />
              <line x1="5" y1="1.5" x2="5" y2="4" />
              <line x1="11" y1="1.5" x2="11" y2="4" />
              <line x1="2" y1="6.5" x2="14" y2="6.5" />
            </svg>
          </span>
        </button>

        {open && (
          <div className={styles.popover} role="dialog" aria-label="Date picker popover">
            <Calendar
              mode="single"
              value={selectedDate}
              defaultMonth={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              locale={locale}
              onChange={(val) => {
                const next = val instanceof Date ? val : undefined;
                if (!isControlled) setUncontrolledDate(next);
                onChange?.(next);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  isInvalid?: boolean;
  disabled?: boolean;
  locale?: string;
  dateFormat?: DatePickerFormat;
}

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Select date range...',
      size = 'md',
      variant = 'outline',
      isInvalid = false,
      disabled = false,
      locale = 'en-US',
      dateFormat = 'medium',
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledRange, setUncontrolledRange] = useState<DateRange | undefined>(defaultValue);
    const range = isControlled ? controlledValue : uncontrolledRange;

    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const displayText =
      range?.from && range?.to
        ? `${formatWithPreset(range.from, dateFormat, locale)} – ${formatWithPreset(range.to, dateFormat, locale)}`
        : range?.from
          ? `${formatWithPreset(range.from, dateFormat, locale)} – ...`
          : '';

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(styles.root, className)}
        {...props}
      >
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={isInvalid || undefined}
          aria-label={props['aria-label'] ?? 'Choose date range'}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={cn(
            styles.trigger,
            styles[size],
            styles[variant],
            open && styles.triggerOpen,
            isInvalid && styles.invalid
          )}
        >
          <span className={cn(styles.triggerText, !displayText && styles.placeholder)}>
            {displayText || placeholder}
          </span>
        </button>

        {open && (
          <div className={styles.popover} role="dialog" aria-label="Date range picker popover">
            <Calendar
              mode="range"
              value={range}
              defaultMonth={range?.from}
              locale={locale}
              onChange={(val) => {
                const next = val && !(val instanceof Date) ? val : undefined;
                if (!isControlled) setUncontrolledRange(next);
                onChange?.(next);
                if (next?.from && next?.to) {
                  setOpen(false);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }
);
DateRangePicker.displayName = 'DateRangePicker';
