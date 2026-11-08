import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Progress.module.css';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  size?: ProgressSize;
  color?: ProgressColor;
  isIndeterminate?: boolean;
  hasStripe?: boolean;
  isAnimated?: boolean;
  label?: React.ReactNode;
  showValueLabel?: boolean;
  formatValueLabel?: (value: number, percentage: number) => React.ReactNode;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      min = 0,
      max = 100,
      size = 'md',
      color = 'primary',
      isIndeterminate = false,
      hasStripe = false,
      isAnimated = false,
      label,
      showValueLabel = false,
      formatValueLabel,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, min), max);
    const range = Math.max(max - min, 1);
    const percentage = Math.round(((clampedValue - min) / range) * 100);

    const renderedValueLabel = formatValueLabel
      ? formatValueLabel(clampedValue, percentage)
      : `${percentage}%`;

    return (
      <div className={cn(styles.wrapper, className)}>
        {(label || (showValueLabel && !isIndeterminate)) && (
          <div className={styles.header}>
            {label && <span className={styles.label}>{label}</span>}
            {showValueLabel && !isIndeterminate && (
              <span className={styles.valueText}>{renderedValueLabel}</span>
            )}
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Progress')}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={isIndeterminate ? undefined : clampedValue}
          data-indeterminate={isIndeterminate ? '' : undefined}
          className={cn(styles.track, styles[size])}
          {...props}
        >
          <div
            className={cn(
              styles.indicator,
              styles[color],
              hasStripe && styles.striped,
              hasStripe && isAnimated && styles.animated,
              isIndeterminate && styles.indeterminate
            )}
            style={isIndeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  size?: ProgressSize | number;
  thickness?: number;
  color?: ProgressColor;
  isIndeterminate?: boolean;
  showValueLabel?: boolean;
  label?: React.ReactNode;
}

const CIRCULAR_SIZE_MAP: Record<ProgressSize, number> = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
};

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      min = 0,
      max = 100,
      size = 'md',
      thickness = 4,
      color = 'primary',
      isIndeterminate = false,
      showValueLabel = false,
      label,
      className,
      'aria-label': ariaLabel = 'Circular progress',
      ...props
    },
    ref
  ) => {
    const dimension = typeof size === 'number' ? size : CIRCULAR_SIZE_MAP[size];
    const clampedValue = Math.min(Math.max(value, min), max);
    const range = Math.max(max - min, 1);
    const percentage = Math.round(((clampedValue - min) / range) * 100);

    const viewBoxSize = 44;
    const radius = (viewBoxSize - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        data-indeterminate={isIndeterminate ? '' : undefined}
        className={cn(styles.circularWrapper, styles[color], className)}
        style={{ width: dimension, height: dimension, backgroundColor: 'transparent' }}
        {...props}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={cn(styles.circularSvg, isIndeterminate && styles.circularIndeterminate)}
        >
          <circle
            className={styles.circularTrack}
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
          />
          <circle
            className={cn(
              styles.circularIndicator,
              isIndeterminate && styles.circularIndicatorIndeterminate
            )}
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={isIndeterminate ? undefined : circumference}
            strokeDashoffset={isIndeterminate ? undefined : strokeDashoffset}
          />
        </svg>
        {(showValueLabel || label) && !isIndeterminate && (
          <span className={styles.circularLabel}>{label ?? `${percentage}%`}</span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = 'CircularProgress';
