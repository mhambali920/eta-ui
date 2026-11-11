import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './Rating.module.css';

export type RatingSize = 'sm' | 'md' | 'lg';
export type RatingColor = 'warning' | 'primary' | 'danger';

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  max?: number;
  precision?: 1 | 0.5;
  size?: RatingSize;
  color?: RatingColor;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  name?: string;
}

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={styles.starSvg}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      max = 5,
      precision = 1,
      size = 'md',
      color = 'warning',
      readOnly = false,
      disabled = false,
      onChange,
      className,
      name,
      'aria-label': ariaLabel = 'Rating',
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number>(defaultValue);
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const generatedId = useId();

    const activeValue = isControlled ? controlledValue : internalValue;
    const displayValue = hoverValue !== null ? hoverValue : activeValue;

    const handleValueChange = (newValue: number) => {
      if (readOnly || disabled) return;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return;

      const step = precision;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = Math.min(max, activeValue + step);
        handleValueChange(next);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = Math.max(0, activeValue - step);
        handleValueChange(next);
      } else if (event.key === 'Home') {
        event.preventDefault();
        handleValueChange(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        handleValueChange(max);
      }
    };

    return (
      <div
        ref={ref}
        role="slider"
        aria-label={ariaLabel}
        aria-valuenow={activeValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-readonly={readOnly}
        aria-disabled={disabled}
        tabIndex={disabled || readOnly ? -1 : 0}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => !readOnly && !disabled && setHoverValue(null)}
        className={cn(
          styles.root,
          styles[`size-${size}`],
          styles[`color-${color}`],
          readOnly && styles.readOnly,
          disabled && styles.disabled,
          className
        )}
        {...props}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={activeValue}
            id={generatedId}
            disabled={disabled}
          />
        )}
        {Array.from({ length: max }).map((_, index) => {
          const starIndex = index + 1;
          const fillDifference = displayValue - index;
          const fillPercentage =
            fillDifference >= 1 ? 100 : fillDifference > 0 ? fillDifference * 100 : 0;

          return (
            <div
              key={index}
              className={styles.starWrapper}
              data-testid={`star-item-${index + 1}`}
              onMouseMove={(e) => {
                if (readOnly || disabled) return;
                if (precision === 0.5) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                  setHoverValue(isLeftHalf ? starIndex - 0.5 : starIndex);
                } else {
                  setHoverValue(starIndex);
                }
              }}
              onClick={(e) => {
                if (readOnly || disabled) return;
                if (precision === 0.5) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                  handleValueChange(isLeftHalf ? starIndex - 0.5 : starIndex);
                } else {
                  handleValueChange(starIndex);
                }
              }}
            >
              <div className={styles.emptyStar}>
                <StarIcon filled={false} />
              </div>
              <div
                className={styles.filledStar}
                style={{ width: `${Math.max(0, Math.min(100, fillPercentage))}%` }}
              >
                <StarIcon filled={true} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
