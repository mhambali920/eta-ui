import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Alert.module.css';

export type AlertStatus = 'info' | 'success' | 'warning' | 'error' | 'danger';
export type AlertVariant = 'soft' | 'outline' | 'solid';
export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  status?: AlertStatus;
  variant?: AlertVariant;
  size?: AlertSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode | boolean;
  action?: React.ReactNode;
  onClose?: () => void;
  isClosable?: boolean;
  closeLabel?: string;
  children?: React.ReactNode;
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export interface AlertIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: AlertStatus;
  children?: React.ReactNode;
}

export interface AlertCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const getStatusIcon = (status: AlertStatus) => {
  switch (status) {
    case 'success':
      return <SuccessIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'error':
    case 'danger':
      return <ErrorIcon />;
    case 'info':
    default:
      return <InfoIcon />;
  }
};

export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h5 ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </h5>
    );
  }
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </div>
    );
  }
);
AlertDescription.displayName = 'AlertDescription';

export const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(
  ({ status = 'info', className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(styles.icon, className)} aria-hidden="true" {...props}>
        {children || getStatusIcon(status)}
      </span>
    );
  }
);
AlertIcon.displayName = 'AlertIcon';

export const AlertCloseButton = forwardRef<HTMLButtonElement, AlertCloseButtonProps>(
  ({ className, label = 'Close alert', onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(styles.closeButton, className)}
        onClick={onClick}
        {...props}
      >
        <CloseIcon />
      </button>
    );
  }
);
AlertCloseButton.displayName = 'AlertCloseButton';

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      status = 'info',
      variant = 'soft',
      size = 'md',
      title,
      description,
      icon = true,
      action,
      onClose,
      isClosable,
      closeLabel = 'Close alert',
      className,
      children,
      role,
      ...props
    },
    ref
  ) => {
    // Map danger to error internally for css class
    const normalizedStatus = status === 'danger' ? 'error' : status;
    const computedRole = role || (normalizedStatus === 'error' || normalizedStatus === 'warning' ? 'alert' : 'status');

    const showCloseButton = isClosable || Boolean(onClose);

    return (
      <div
        ref={ref}
        role={computedRole}
        aria-live="polite"
        className={cn(
          styles.alert,
          styles[`size-${size}`],
          styles[`variant-${variant}`],
          styles[`status-${normalizedStatus}`],
          className
        )}
        {...props}
      >
        {icon !== false && (
          <AlertIcon status={normalizedStatus}>
            {typeof icon !== 'boolean' ? icon : undefined}
          </AlertIcon>
        )}

        <div className={styles.content}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {children}
        </div>

        {action && <div className={styles.action}>{action}</div>}

        {showCloseButton && (
          <AlertCloseButton label={closeLabel} onClick={onClose} />
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export const Callout = Alert;
export type CalloutProps = AlertProps;
