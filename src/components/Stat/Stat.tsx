import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Stat.module.css';

export type StatVariant = 'surface' | 'outline' | 'subtle' | 'ghost';
export type StatTrendDirection = 'up' | 'down' | 'neutral';

export interface StatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: StatVariant;
  label?: React.ReactNode;
  value?: React.ReactNode;
  helpText?: React.ReactNode;
  trend?: StatTrendDirection;
  trendValue?: React.ReactNode;
  icon?: React.ReactNode;
}

export const StatGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(styles.group, className)} {...props}>
      {children}
    </div>
  )
);
StatGroup.displayName = 'StatGroup';

export const StatLabel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.label, className)} {...props}>
      {children}
    </div>
  )
);
StatLabel.displayName = 'StatLabel';

export const StatValue = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.value, className)} {...props}>
      {children}
    </div>
  )
);
StatValue.displayName = 'StatValue';

export const StatHelpText = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.helpText, className)} {...props}>
      {children}
    </div>
  )
);
StatHelpText.displayName = 'StatHelpText';

export const StatIcon = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn(styles.icon, className)} {...props}>
      {children}
    </span>
  )
);
StatIcon.displayName = 'StatIcon';

export interface StatTrendProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction?: StatTrendDirection;
}

export const StatTrend = forwardRef<HTMLSpanElement, StatTrendProps>(
  ({ direction = 'up', className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-direction={direction}
      className={cn(styles.trend, styles[direction], className)}
      {...props}
    >
      {direction === 'up' && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="2.5 7.5 6 4 9.5 7.5" />
        </svg>
      )}
      {direction === 'down' && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="2.5 4.5 6 8 9.5 4.5" />
        </svg>
      )}
      <span>{children}</span>
    </span>
  )
);
StatTrend.displayName = 'StatTrend';

export const Stat = forwardRef<HTMLDivElement, StatProps>(
  (
    {
      variant = 'surface',
      label,
      value,
      helpText,
      trend,
      trendValue,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasShorthand = Boolean(label !== undefined || value !== undefined || helpText !== undefined);

    return (
      <div ref={ref} className={cn(styles.stat, styles[variant], className)} {...props}>
        {hasShorthand ? (
          <>
            {(label || icon) && (
              <div className={styles.topRow}>
                {label && <StatLabel>{label}</StatLabel>}
                {icon && <StatIcon>{icon}</StatIcon>}
              </div>
            )}
            {value !== undefined && <StatValue>{value}</StatValue>}
            {(trendValue || helpText) && (
              <div className={styles.footerRow}>
                {trendValue && <StatTrend direction={trend}>{trendValue}</StatTrend>}
                {helpText && <StatHelpText>{helpText}</StatHelpText>}
              </div>
            )}
            {children}
          </>
        ) : (
          children
        )}
      </div>
    );
  }
);
Stat.displayName = 'Stat';
