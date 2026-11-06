import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled' | 'unstyled';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  isInvalid?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'outline',
      isInvalid = false,
      leftAdornment,
      rightAdornment,
      className,
      wrapperClassName,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleWrapperClick = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div
        onClick={handleWrapperClick}
        className={cn(
          styles.wrapper,
          styles[size],
          styles[variant],
          isFocused && styles.focused,
          isInvalid && styles.invalid,
          disabled && styles.disabled,
          wrapperClassName
        )}
        data-disabled={disabled ? '' : undefined}
        data-invalid={isInvalid ? '' : undefined}
      >
        {leftAdornment && (
          <span className={styles.adornment} data-testid="input-left-adornment">
            {leftAdornment}
          </span>
        )}
        <input
          ref={inputRef}
          disabled={disabled}
          aria-invalid={isInvalid}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(styles.input, className)}
          {...props}
        />
        {rightAdornment && (
          <span className={styles.adornment} data-testid="input-right-adornment">
            {rightAdornment}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
