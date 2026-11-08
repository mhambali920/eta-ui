import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './EmptyState.module.css';

export type EmptyStateSize = 'sm' | 'md' | 'lg';
export type EmptyStateVariant = 'default' | 'bordered' | 'surface';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  size?: EmptyStateSize;
  variant?: EmptyStateVariant;
  icon?: React.ReactNode;
  hideIcon?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyStateIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} aria-hidden="true" className={cn(styles.iconWrapper, className)} {...props}>
      {children ?? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      )}
    </div>
  )
);
EmptyStateIcon.displayName = 'EmptyStateIcon';

export const EmptyStateTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn(styles.title, className)} {...props}>
    {children}
  </h3>
));
EmptyStateTitle.displayName = 'EmptyStateTitle';

export const EmptyStateDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props}>
    {children}
  </p>
));
EmptyStateDescription.displayName = 'EmptyStateDescription';

export const EmptyStateActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.actions, className)} {...props}>
      {children}
    </div>
  )
);
EmptyStateActions.displayName = 'EmptyStateActions';

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      size = 'md',
      variant = 'bordered',
      icon,
      hideIcon = false,
      title,
      description,
      action,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasShorthand = Boolean(title || description || action || icon);

    return (
      <div
        ref={ref}
        className={cn(styles.emptyState, styles[size], styles[variant], className)}
        {...props}
      >
        {hasShorthand ? (
          <>
            {!hideIcon && <EmptyStateIcon>{icon}</EmptyStateIcon>}
            {title && <EmptyStateTitle>{title}</EmptyStateTitle>}
            {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
            {action && <EmptyStateActions>{action}</EmptyStateActions>}
            {children}
          </>
        ) : (
          children
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
