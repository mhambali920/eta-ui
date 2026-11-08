import React, { createContext, forwardRef, useContext, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './ToggleGroup.module.css';

export type ToggleVariant = 'soft' | 'outline' | 'segmented';
export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleOrientation = 'horizontal' | 'vertical';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      variant = 'soft',
      size = 'md',
      disabled = false,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledPressed !== undefined;
    const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
    const isPressed = isControlled ? controlledPressed : uncontrolledPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isPressed;
      if (!isControlled) {
        setUncontrolledPressed(next);
      }
      onPressedChange?.(next);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          styles.toggle,
          styles[variant],
          styles[size],
          isPressed && styles.pressed,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Toggle.displayName = 'Toggle';

interface ToggleGroupContextValue {
  type: 'single' | 'multiple';
  values: string[];
  variant: ToggleVariant;
  size: ToggleSize;
  disabled: boolean;
  toggleValue: (val: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) {
    throw new Error('ToggleGroupItem must be used within <ToggleGroup>');
  }
  return ctx;
}

export interface ToggleGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  orientation?: ToggleOrientation;
  disabled?: boolean;
}

export interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, disabled: itemDisabled, onClick, className, children, ...props }, ref) => {
    const ctx = useToggleGroupContext();
    const isSelected = ctx.values.includes(value);
    const isDisabled = ctx.disabled || Boolean(itemDisabled);

    return (
      <button
        ref={ref}
        type="button"
        role={ctx.type === 'single' ? 'radio' : undefined}
        aria-checked={ctx.type === 'single' ? isSelected : undefined}
        aria-pressed={ctx.type === 'multiple' ? isSelected : undefined}
        data-state={isSelected ? 'on' : 'off'}
        disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) return;
          ctx.toggleValue(value);
          onClick?.(e);
        }}
        className={cn(
          styles.toggle,
          styles[ctx.variant],
          styles[ctx.size],
          isSelected && styles.pressed,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = 'ToggleGroupItem';

function normalizeToArray(val: string | string[] | undefined): string[] {
  if (val === undefined) return [];
  return Array.isArray(val) ? val : val ? [val] : [];
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type = 'single',
      value: controlledValue,
      defaultValue,
      onValueChange,
      variant = 'segmented',
      size = 'md',
      orientation = 'horizontal',
      disabled = false,
      onKeyDown,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(() =>
      normalizeToArray(defaultValue)
    );
    const values = isControlled ? normalizeToArray(controlledValue) : uncontrolledValues;
    const groupRef = useRef<HTMLDivElement>(null);

    const toggleValue = (val: string) => {
      if (type === 'single') {
        const next = values.includes(val) ? [] : [val];
        if (!isControlled) setUncontrolledValues(next);
        onValueChange?.(next[0] ?? '');
      } else {
        const exists = values.includes(val);
        const next = exists ? values.filter((v) => v !== val) : [...values, val];
        if (!isControlled) setUncontrolledValues(next);
        onValueChange?.(next);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = groupRef.current;
      if (container) {
        const buttons = Array.from(
          container.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        );
        const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (currentIndex !== -1 && buttons.length > 0) {
          const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];
          const prevKeys = orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];
          if (nextKeys.includes(e.key)) {
            e.preventDefault();
            buttons[(currentIndex + 1) % buttons.length]?.focus();
          } else if (prevKeys.includes(e.key)) {
            e.preventDefault();
            buttons[(currentIndex - 1 + buttons.length) % buttons.length]?.focus();
          }
        }
      }
      onKeyDown?.(e);
    };

    const contextValue: ToggleGroupContextValue = {
      type,
      values,
      variant,
      size,
      disabled,
      toggleValue,
    };

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            (groupRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role={type === 'single' ? 'radiogroup' : 'group'}
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          className={cn(
            styles.group,
            styles[orientation],
            variant === 'segmented' && styles.groupSegmented,
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = 'ToggleGroup';

export const SegmentedControl = ToggleGroup;
export const SegmentedControlItem = ToggleGroupItem;
