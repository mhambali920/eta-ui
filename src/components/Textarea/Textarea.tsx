import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaVariant = 'outline' | 'filled' | 'unstyled';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize;
  variant?: TextareaVariant;
  resize?: TextareaResize;
  isInvalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      variant = 'outline',
      resize = 'vertical',
      isInvalid = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={isInvalid}
        className={cn(
          styles.textarea,
          styles[size],
          styles[variant],
          styles[`resize-${resize}`],
          isInvalid && styles.invalid,
          disabled && styles.disabled,
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
