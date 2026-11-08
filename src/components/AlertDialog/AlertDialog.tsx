import React, { createContext, forwardRef, useContext } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';
import styles from './AlertDialog.module.css';

export type AlertDialogIntent = 'danger' | 'warning' | 'info' | 'primary';
export type AlertDialogSize = 'sm' | 'md' | 'lg';

const AlertDialogIntentContext = createContext<AlertDialogIntent>('danger');

export interface AlertDialogProps extends DialogPrimitive.DialogProps {}

export const AlertDialog: React.FC<AlertDialogProps> = DialogPrimitive.Root;
AlertDialog.displayName = 'AlertDialog';

export const AlertDialogTrigger = DialogPrimitive.Trigger;
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export const AlertDialogPortal = DialogPrimitive.Portal;
AlertDialogPortal.displayName = 'AlertDialogPortal';

export const AlertDialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn(styles.overlay, className)} {...props} />
));
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  intent?: AlertDialogIntent;
  size?: AlertDialogSize;
  closeOnOverlayClick?: boolean;
}

export const AlertDialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AlertDialogContentProps
>(
  (
    {
      intent = 'danger',
      size = 'md',
      closeOnOverlayClick = false,
      onPointerDownOutside,
      onInteractOutside,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <AlertDialogIntentContext.Provider value={intent}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) e.preventDefault();
            onPointerDownOutside?.(e);
          }}
          onInteractOutside={(e) => {
            if (!closeOnOverlayClick) e.preventDefault();
            onInteractOutside?.(e);
          }}
          className={cn(styles.content, styles[size], className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </AlertDialogPortal>
    </AlertDialogIntentContext.Provider>
  )
);
AlertDialogContent.displayName = 'AlertDialogContent';

export interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  hideIcon?: boolean;
  icon?: React.ReactNode;
}

export const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ hideIcon = false, icon, className, children, ...props }, ref) => {
    const intent = useContext(AlertDialogIntentContext);

    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        {!hideIcon && (
          <span className={cn(styles.iconBadge, styles[intent])} aria-hidden="true">
            {icon ?? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
          </span>
        )}
        <div className={styles.headerText}>{children}</div>
      </div>
    );
  }
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn(styles.description, className)} {...props} />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.body, className)} {...props} />
  )
);
AlertDialogBody.displayName = 'AlertDialogBody';

export const AlertDialogFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...props} />
  )
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  intent?: AlertDialogIntent;
}

const INTENT_BUTTON_CLASS: Record<AlertDialogIntent, string> = {
  danger: styles.actionDanger,
  warning: styles.actionWarning,
  info: styles.actionInfo,
  primary: styles.actionPrimary,
};

export const AlertDialogAction = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  AlertDialogActionProps
>(({ intent: intentProp, className, ...props }, ref) => {
  const ctxIntent = useContext(AlertDialogIntentContext);
  const resolvedIntent = intentProp ?? ctxIntent;
  return (
    <DialogPrimitive.Close
      ref={ref}
      className={cn(styles.button, INTENT_BUTTON_CLASS[resolvedIntent], className)}
      {...props}
    />
  );
});
AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(styles.button, styles.cancelButton, className)}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';
