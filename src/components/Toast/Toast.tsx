import React, { forwardRef, createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '../../utils/cn';
import styles from './Toast.module.css';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type ToastVariant = 'surface' | 'soft';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  status?: ToastStatus;
  variant?: ToastVariant;
  icon?: React.ReactNode | boolean;
}

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> {
  position?: ToastPosition;
}

export interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title> {}

export interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description> {}

export interface ToastActionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action> {}

export interface ToastCloseProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close> {
  label?: string;
}

export interface ToastItemOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: ToastStatus;
  variant?: ToastVariant;
  duration?: number;
  icon?: React.ReactNode | boolean;
  action?: React.ReactNode;
}

export interface ToastContextValue {
  toast: {
    (options: ToastItemOptions): string;
    info: (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) => string;
    success: (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) => string;
    warning: (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) => string;
    error: (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) => string;
  };
  dismiss: (id?: string) => void;
  toasts: ToastItemOptions[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

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

const getStatusIcon = (status: ToastStatus) => {
  switch (status) {
    case 'success':
      return <SuccessIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'info':
    default:
      return <InfoIcon />;
  }
};

export const ToastViewport = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ className, position = 'bottom-right', ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(styles.viewport, styles[`position-${position}`], className)}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

export const ToastTitle = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn(styles.description, className)} {...props} />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastAction = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action ref={ref} className={cn(styles.action, className)} {...props} />
));
ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  ToastCloseProps
>(({ className, label = 'Close notification', ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    aria-label={label}
    className={cn(styles.closeButton, className)}
    {...props}
  >
    <CloseIcon />
  </ToastPrimitive.Close>
));
ToastClose.displayName = 'ToastClose';

export const Toast = forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, status = 'neutral', variant = 'surface', icon = true, children, ...props }, ref) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        className={cn(
          styles.toast,
          styles[`status-${status}`],
          styles[`variant-${variant}`],
          className
        )}
        {...props}
      >
        {icon !== false && (
          <span className={styles.icon} aria-hidden="true">
            {typeof icon !== 'boolean' ? icon : getStatusIcon(status)}
          </span>
        )}
        <div className={styles.content}>{children}</div>
        <ToastClose />
      </ToastPrimitive.Root>
    );
  }
);
Toast.displayName = 'Toast';

export interface ToastProviderProps extends ToastPrimitive.ToastProviderProps {
  position?: ToastPosition;
  children: React.ReactNode;
}

let toastCount = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  duration = 5000,
  swipeDirection = 'right',
  ...props
}) => {
  const [toasts, setToasts] = useState<ToastItemOptions[]>([]);

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((t) => t.id !== id) : []));
  }, []);

  const addToast = useCallback((options: ToastItemOptions): string => {
    const id = options.id || `eta-toast-${++toastCount}`;
    const newToast: ToastItemOptions = { ...options, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const toastHandler = useMemo(() => {
    const fn = (options: ToastItemOptions) => addToast(options);
    fn.info = (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) =>
      addToast({ ...options, title, status: 'info' });
    fn.success = (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) =>
      addToast({ ...options, title, status: 'success' });
    fn.warning = (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) =>
      addToast({ ...options, title, status: 'warning' });
    fn.error = (title: React.ReactNode, options?: Omit<ToastItemOptions, 'title' | 'status'>) =>
      addToast({ ...options, title, status: 'error' });
    return fn;
  }, [addToast]);

  return (
    <ToastPrimitive.Provider
      duration={duration}
      swipeDirection={swipeDirection}
      {...props}
    >
      <ToastContext.Provider value={{ toast: toastHandler, dismiss, toasts }}>
        {children}
        {toasts.map(({ id, title, description, status, variant, duration: toastDur, icon, action }) => (
          <Toast
            key={id}
            status={status}
            variant={variant}
            duration={toastDur}
            icon={icon}
            onOpenChange={(open) => {
              if (!open) dismiss(id);
            }}
          >
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {action}
          </Toast>
        ))}
        <ToastViewport position={position} />
      </ToastContext.Provider>
    </ToastPrimitive.Provider>
  );
};
ToastProvider.displayName = 'ToastProvider';

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
