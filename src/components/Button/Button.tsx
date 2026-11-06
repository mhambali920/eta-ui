import React, { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      color = 'primary',
      isLoading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    return (
      <Component
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          styles[color],
          isLoading && styles.loading,
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true" role="status" />
        )}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <Slottable>{children}</Slottable>
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = 'Button';
