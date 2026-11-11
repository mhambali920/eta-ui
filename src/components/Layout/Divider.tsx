import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Layout.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerLabelPosition = 'left' | 'center' | 'right';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  spacing?: DividerSpacing;
  size?: 'sm' | 'md' | 'lg';
  label?: React.ReactNode;
  labelPosition?: DividerLabelPosition;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      spacing,
      size,
      label,
      labelPosition = 'center',
      className,
      ...props
    },
    ref
  ) => {
    const hasLabel = Boolean(label) && orientation === 'horizontal';
    const resolvedSpacing: DividerSpacing = spacing ?? size ?? 'md';

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          styles.divider,
          styles[orientation],
          styles[`spacing-${resolvedSpacing}`],
          styles[variant],
          hasLabel ? styles.hasLabel : styles.hasNoLabel,
          hasLabel && styles[`label-${labelPosition}`],
          className
        )}
        {...props}
      >
        {hasLabel && <span className={styles.labelContent}>{label}</span>}
      </div>
    );
  }
);

Divider.displayName = 'Divider';
