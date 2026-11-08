import React, { createContext, forwardRef, useContext } from 'react';
import { cn } from '../../utils/cn';
import styles from './Stepper.module.css';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperSize = 'sm' | 'md' | 'lg';
export type StepStatus = 'complete' | 'active' | 'upcoming' | 'error';

interface StepperContextValue {
  activeStep: number;
  orientation: StepperOrientation;
  size: StepperSize;
  onStepClick?: (index: number) => void;
}

const StepperContext = createContext<StepperContextValue>({
  activeStep: 0,
  orientation: 'horizontal',
  size: 'md',
});

interface StepItemContextValue {
  index: number;
  status: StepStatus;
}

const StepItemContext = createContext<StepItemContextValue>({
  index: 0,
  status: 'upcoming',
});

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  onStepClick?: (index: number) => void;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep = 0,
      orientation = 'horizontal',
      size = 'md',
      onStepClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const childArray = React.Children.toArray(children);

    return (
      <StepperContext.Provider value={{ activeStep, orientation, size, onStepClick }}>
        <div
          ref={ref}
          role="list"
          aria-label={props['aria-label'] ?? 'Progress steps'}
          data-orientation={orientation}
          className={cn(styles.stepper, styles[orientation], styles[size], className)}
          {...props}
        >
          {childArray.map((child, idx) => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child as React.ReactElement<{ index?: number; isLast?: boolean }>, {
              index: (child.props as { index?: number }).index ?? idx,
              isLast: idx === childArray.length - 1,
            });
          })}
        </div>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = 'Stepper';

export interface StepProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  index?: number;
  status?: StepStatus;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  isLast?: boolean;
}

export const StepIndicator = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { icon?: React.ReactNode }
>(({ icon, className, children, ...props }, ref) => {
  const { index, status } = useContext(StepItemContext);

  const renderDefaultContent = () => {
    if (icon) return icon;
    if (children) return children;
    if (status === 'complete') {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      );
    }
    if (status === 'error') {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="8" y1="4.5" x2="8" y2="8.5" />
          <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
        </svg>
      );
    }
    return index + 1;
  };

  return (
    <span ref={ref} className={cn(styles.indicator, className)} {...props}>
      {renderDefaultContent()}
    </span>
  );
});
StepIndicator.displayName = 'StepIndicator';

export const StepTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h4 ref={ref} className={cn(styles.title, className)} {...props}>
      {children}
    </h4>
  )
);
StepTitle.displayName = 'StepTitle';

export const StepDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props}>
    {children}
  </p>
));
StepDescription.displayName = 'StepDescription';

export const StepSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { status } = useContext(StepItemContext);
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          styles.separator,
          status === 'complete' && styles.separatorComplete,
          className
        )}
        {...props}
      />
    );
  }
);
StepSeparator.displayName = 'StepSeparator';

export const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    {
      index = 0,
      status: statusProp,
      title,
      description,
      icon,
      isLast = false,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { activeStep, onStepClick } = useContext(StepperContext);
    const derivedStatus: StepStatus =
      statusProp ??
      (index < activeStep ? 'complete' : index === activeStep ? 'active' : 'upcoming');

    const isClickable = Boolean(onStepClick || onClick);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onStepClick?.(index);
      onClick?.(e);
    };

    return (
      <StepItemContext.Provider value={{ index, status: derivedStatus }}>
        <div
          ref={ref}
          role="listitem"
          aria-current={derivedStatus === 'active' ? 'step' : undefined}
          data-status={derivedStatus}
          tabIndex={isClickable ? 0 : undefined}
          onClick={isClickable ? handleClick : undefined}
          onKeyDown={
            isClickable
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onStepClick?.(index);
                  }
                }
              : undefined
          }
          className={cn(
            styles.step,
            styles[derivedStatus],
            isClickable && styles.stepClickable,
            className
          )}
          {...props}
        >
          {children ?? (
            <>
              <StepIndicator icon={icon} />
              {(title || description) && (
                <div className={styles.textGroup}>
                  {title && <StepTitle>{title}</StepTitle>}
                  {description && <StepDescription>{description}</StepDescription>}
                </div>
              )}
              {!isLast && <StepSeparator />}
            </>
          )}
        </div>
      </StepItemContext.Provider>
    );
  }
);
Step.displayName = 'Step';
