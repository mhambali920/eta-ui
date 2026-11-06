import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'error'
  | 'info'
  | 'neutral';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  thickness?: string | number;
  speed?: string;
  emptyColor?: string;
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'current',
      thickness,
      speed,
      emptyColor,
      label = 'Loading...',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle: React.CSSProperties = {
      ...style,
      ...(thickness ? { borderWidth: typeof thickness === 'number' ? `${thickness}px` : thickness } : {}),
      ...(speed ? { animationDuration: speed } : {}),
      ...(emptyColor ? { borderRightColor: emptyColor, borderBottomColor: emptyColor } : {}),
    };

    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          styles.spinner,
          styles[`size-${size}`],
          styles[`color-${color}`],
          className
        )}
        style={customStyle}
        {...props}
      >
        <span className={styles.srOnly}>{label}</span>
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
