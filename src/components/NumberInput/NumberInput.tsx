import React, { createContext, forwardRef, useContext, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './NumberInput.module.css';

export type NumberInputSize = 'sm' | 'md' | 'lg';
export type NumberInputVariant = 'outline' | 'filled';

interface NumberInputContextValue {
  value: number | undefined;
  displayValue: string;
  min?: number;
  max?: number;
  step: number;
  precision?: number;
  disabled: boolean;
  readOnly: boolean;
  isInvalid: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  canIncrement: boolean;
  canDecrement: boolean;
  increment: () => void;
  decrement: () => void;
  setInputString: (raw: string) => void;
  commitValue: (num: number | undefined) => void;
  setIsFocused: (focused: boolean) => void;
}

const NumberInputContext = createContext<NumberInputContextValue | null>(null);

function useNumberInputContext() {
  const ctx = useContext(NumberInputContext);
  if (!ctx) {
    throw new Error('NumberInput subcomponents must be used within <NumberInput>');
  }
  return ctx;
}

export interface NumberInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: NumberInputSize;
  variant?: NumberInputVariant;
  isInvalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  allowMouseWheel?: boolean;
  name?: string;
  placeholder?: string;
  onChange?: (valueAsNumber: number, valueAsString: string) => void;
}

function roundToPrecision(val: number, precision?: number, step?: number): number {
  if (precision !== undefined) {
    return Number(val.toFixed(precision));
  }
  if (step !== undefined) {
    const stepStr = String(step);
    const decimals = stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
    return Number(val.toFixed(decimals));
  }
  return val;
}

function formatNumber(val: number | undefined, precision?: number): string {
  if (val === undefined || Number.isNaN(val)) return '';
  return precision !== undefined ? val.toFixed(precision) : String(val);
}

export const NumberInputField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, onFocus, onBlur, onKeyDown, onChange, ...props }, ref) => {
  const ctx = useNumberInputContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ctx.disabled && !ctx.readOnly) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        ctx.increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        ctx.decrement();
      } else if (e.key === 'Home' && ctx.min !== undefined) {
        e.preventDefault();
        ctx.commitValue(ctx.min);
      } else if (e.key === 'End' && ctx.max !== undefined) {
        e.preventDefault();
        ctx.commitValue(ctx.max);
      }
    }
    onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
      ctx.setInputString(raw);
      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed)) {
        ctx.commitValue(parsed);
      }
    }
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    ctx.setIsFocused(false);
    if (ctx.displayValue === '' || ctx.displayValue === '-') {
      ctx.setInputString(formatNumber(ctx.value, ctx.precision));
    } else {
      const parsed = parseFloat(ctx.displayValue);
      if (!Number.isNaN(parsed)) {
        ctx.commitValue(parsed);
      }
    }
    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    ctx.setIsFocused(true);
    onFocus?.(e);
  };

  return (
    <input
      ref={ref}
      id={ctx.id}
      name={ctx.name}
      type="text"
      inputMode="decimal"
      role="spinbutton"
      aria-valuemin={ctx.min}
      aria-valuemax={ctx.max}
      aria-valuenow={ctx.value}
      aria-invalid={ctx.isInvalid || undefined}
      aria-label={ctx.ariaLabel}
      aria-describedby={ctx.ariaDescribedBy}
      disabled={ctx.disabled}
      readOnly={ctx.readOnly}
      placeholder={ctx.placeholder}
      value={ctx.displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(styles.input, className)}
      {...props}
    />
  );
});
NumberInputField.displayName = 'NumberInputField';

export const NumberIncrementStepper = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const ctx = useNumberInputContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ctx.increment();
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={-1}
      aria-label="Increment value"
      disabled={ctx.disabled || ctx.readOnly || !ctx.canIncrement}
      onClick={handleClick}
      className={cn(styles.stepperButton, className)}
      {...props}
    >
      {children ?? (
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="2 8 6 4 10 8" />
        </svg>
      )}
    </button>
  );
});
NumberIncrementStepper.displayName = 'NumberIncrementStepper';

export const NumberDecrementStepper = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const ctx = useNumberInputContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ctx.decrement();
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={-1}
      aria-label="Decrement value"
      disabled={ctx.disabled || ctx.readOnly || !ctx.canDecrement}
      onClick={handleClick}
      className={cn(styles.stepperButton, className)}
      {...props}
    >
      {children ?? (
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="2 4 6 8 10 4" />
        </svg>
      )}
    </button>
  );
});
NumberDecrementStepper.displayName = 'NumberDecrementStepper';

export const NumberInputStepper = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(styles.stepperGroup, className)} {...props}>
      {children ?? (
        <>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </>
      )}
    </div>
  );
});
NumberInputStepper.displayName = 'NumberInputStepper';

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      min,
      max,
      step = 1,
      precision,
      size = 'md',
      variant = 'outline',
      isInvalid = false,
      disabled = false,
      readOnly = false,
      id,
      name,
      placeholder,
      onChange,
      className,
      children,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<number | undefined>(defaultValue);
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const [inputString, setInputString] = useState<string>(() =>
      formatNumber(currentValue, precision)
    );
    const [isFocused, setIsFocused] = useState(false);

    const clamp = (val: number): number => {
      let next = val;
      if (min !== undefined && next < min) next = min;
      if (max !== undefined && next > max) next = max;
      return roundToPrecision(next, precision, step);
    };

    const commitValue = (rawNum: number | undefined) => {
      if (rawNum === undefined || Number.isNaN(rawNum)) return;
      const clamped = clamp(rawNum);
      const formatted = formatNumber(clamped, precision);
      if (!isControlled) {
        setUncontrolledValue(clamped);
      }
      setInputString(formatted);
      onChange?.(clamped, formatted);
    };

    const increment = () => {
      const base = currentValue ?? (min !== undefined ? min : 0);
      commitValue(base + step);
    };

    const decrement = () => {
      const base = currentValue ?? (min !== undefined ? min : 0);
      commitValue(base - step);
    };

    const canIncrement = max === undefined || currentValue === undefined || currentValue < max;
    const canDecrement = min === undefined || currentValue === undefined || currentValue > min;

    const displayValue = isControlled && !isFocused
      ? formatNumber(controlledValue, precision)
      : inputString;

    const contextValue: NumberInputContextValue = {
      value: currentValue,
      displayValue,
      min,
      max,
      step,
      precision,
      disabled,
      readOnly,
      isInvalid,
      id,
      name,
      placeholder,
      ariaLabel,
      ariaDescribedBy,
      canIncrement,
      canDecrement,
      increment,
      decrement,
      setInputString,
      commitValue,
      setIsFocused,
    };

    return (
      <NumberInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            styles.wrapper,
            styles[size],
            styles[variant],
            isFocused && styles.focused,
            isInvalid && styles.invalid,
            disabled && styles.disabled,
            className
          )}
          data-disabled={disabled ? '' : undefined}
          data-invalid={isInvalid ? '' : undefined}
          {...props}
        >
          {children ?? (
            <>
              <NumberInputField />
              <NumberInputStepper />
            </>
          )}
        </div>
      </NumberInputContext.Provider>
    );
  }
);
NumberInput.displayName = 'NumberInput';
