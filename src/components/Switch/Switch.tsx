import React, { forwardRef, useId } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, 'size'> {
  size?: SwitchSize;
  isInvalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
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
    const switchId = id || generatedId;
    const descriptionId = description ? `${switchId}-description` : undefined;

    const switchElement = (
      <RadixSwitch.Root
        ref={ref}
        id={switchId}
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
        <RadixSwitch.Thumb className={styles.thumb} />
      </RadixSwitch.Root>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <label
        htmlFor={switchId}
        className={cn(styles.container, containerClassName)}
        data-disabled={disabled ? '' : undefined}
      >
        {switchElement}
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

Switch.displayName = 'Switch';
