import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'pill' | 'rounded';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  hasDot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'soft',
      color = 'primary',
      size = 'md',
      shape = 'pill',
      hasDot = false,
      leftIcon,
      rightIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          styles.badge,
          styles[variant],
          styles[color],
          styles[size],
          styles[shape],
          className
        )}
        {...props}
      >
        {hasDot && <span className={styles.dot} aria-hidden="true" />}
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
