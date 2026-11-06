import React, { forwardRef, useId } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, 'size'> {
  size?: CheckboxSize;
  isInvalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      size = 'md',
      isInvalid = false,
      label,
      description,
      id,
      className,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;

    const checkboxElement = (
      <RadixCheckbox.Root
        ref={ref}
        id={checkboxId}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={descriptionId}
        className={cn(
          styles.root,
          styles[size],
          isInvalid && styles.invalid,
          className
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className={styles.indicator}>
          {props.checked === 'indeterminate' ? (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : (
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    );

    if (!label && !description) {
      return checkboxElement;
    }

    return (
      <label
        htmlFor={checkboxId}
        className={cn(styles.container, containerClassName)}
        data-disabled={disabled ? '' : undefined}
      >
        {checkboxElement}
        <div className={styles.labelContent}>
          {label && <span className={styles.label}>{label}</span>}
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
