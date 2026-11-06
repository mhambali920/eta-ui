import React, { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';
import styles from './Dialog.module.css';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogProps extends DialogPrimitive.DialogProps {}

export interface DialogTriggerProps extends DialogPrimitive.DialogTriggerProps {}

export interface DialogPortalProps extends DialogPrimitive.DialogPortalProps {}

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize;
  showCloseButton?: boolean;
  closeLabel?: string;
  overlayProps?: DialogOverlayProps;
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Dialog: React.FC<DialogProps> = DialogPrimitive.Root;
Dialog.displayName = 'Dialog';

export const DialogTrigger = DialogPrimitive.Trigger;
DialogTrigger.displayName = 'DialogTrigger';

export const DialogPortal = DialogPrimitive.Portal;
DialogPortal.displayName = 'DialogPortal';

export const DialogClose = DialogPrimitive.Close;
DialogClose.displayName = 'DialogClose';

export const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(styles.overlay, className)}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      showCloseButton = true,
      closeLabel = 'Close dialog',
      overlayProps,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay {...overlayProps} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(styles.content, styles[`size-${size}`], className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className={styles.closeButton}
          >
            <CloseIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = 'DialogContent';

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  )
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(styles.title, className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(styles.description, className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  )
);
DialogBody.displayName = 'DialogBody';

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  )
);
DialogFooter.displayName = 'DialogFooter';

// Semantic Aliases for Modal
export const Modal = Dialog;
export type ModalProps = DialogProps;

export const ModalTrigger = DialogTrigger;
export type ModalTriggerProps = DialogTriggerProps;

export const ModalContent = DialogContent;
export type ModalContentProps = DialogContentProps;

export const ModalHeader = DialogHeader;
export type ModalHeaderProps = DialogHeaderProps;

export const ModalTitle = DialogTitle;
export type ModalTitleProps = DialogTitleProps;

export const ModalDescription = DialogDescription;
export type ModalDescriptionProps = DialogDescriptionProps;

export const ModalBody = DialogBody;
export type ModalBodyProps = DialogBodyProps;

export const ModalFooter = DialogFooter;
export type ModalFooterProps = DialogFooterProps;

export const ModalClose = DialogClose;
export type ModalCloseProps = DialogCloseProps;
