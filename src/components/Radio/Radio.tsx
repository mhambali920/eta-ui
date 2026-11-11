import React, { createContext, forwardRef, useContext, useId } from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn';
import styles from './Radio.module.css';

export type RadioSize = 'sm' | 'md' | 'lg';

const RadioGroupContext = createContext<{ size?: RadioSize }>({});

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root> {
  orientation?: 'vertical' | 'horizontal';
  size?: RadioSize;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ orientation = 'vertical', size, className, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ size }}>
        <RadixRadioGroup.Root
          ref={ref}
          orientation={orientation}
          className={cn(styles.group, className)}
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>, 'size'> {
  size?: RadioSize;
  isInvalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  (
    {
      size: sizeProp,
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
    const groupContext = useContext(RadioGroupContext);
    const size = sizeProp ?? groupContext.size ?? 'md';
    const generatedId = useId();
    const radioId = id || generatedId;
    const descriptionId = description ? `${radioId}-description` : undefined;

    const radioElement = (
      <RadixRadioGroup.Item
        ref={ref}
        id={radioId}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={descriptionId}
        className={cn(
          styles.item,
          styles[size],
          isInvalid && styles.invalid,
          className
        )}
        {...props}
      >
        <RadixRadioGroup.Indicator className={styles.indicator} />
      </RadixRadioGroup.Item>
    );

    if (!label && !description) {
      return radioElement;
    }

    return (
      <label
        htmlFor={radioId}
        className={cn(styles.container, containerClassName)}
        data-disabled={disabled ? '' : undefined}
      >
        {radioElement}
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

Radio.displayName = 'Radio';
