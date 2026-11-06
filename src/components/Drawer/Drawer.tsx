import React, { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';
import styles from './Drawer.module.css';

export type DrawerSide = 'top' | 'right' | 'bottom' | 'left';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps extends DialogPrimitive.DialogProps {}

export interface DrawerTriggerProps extends DialogPrimitive.DialogTriggerProps {}

export interface DrawerPortalProps extends DialogPrimitive.DialogPortalProps {}

export interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: DrawerSide;
  size?: DrawerSize;
  showCloseButton?: boolean;
  closeLabel?: string;
  overlayProps?: DrawerOverlayProps;
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DrawerTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface DrawerDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DrawerCloseProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Drawer: React.FC<DrawerProps> = DialogPrimitive.Root;
Drawer.displayName = 'Drawer';

export const DrawerTrigger = DialogPrimitive.Trigger;
DrawerTrigger.displayName = 'DrawerTrigger';

export const DrawerPortal = DialogPrimitive.Portal;
DrawerPortal.displayName = 'DrawerPortal';

export const DrawerClose = DialogPrimitive.Close;
DrawerClose.displayName = 'DrawerClose';

export const DrawerOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(styles.overlay, className)}
    {...props}
  />
));
DrawerOverlay.displayName = 'DrawerOverlay';

export const DrawerContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      side = 'right',
      size = 'md',
      showCloseButton = true,
      closeLabel = 'Close drawer',
      overlayProps,
      ...props
    },
    ref
  ) => (
    <DrawerPortal>
      <DrawerOverlay {...overlayProps} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          styles.content,
          styles[`side-${side}`],
          styles[`size-${size}`],
          className
        )}
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
    </DrawerPortal>
  )
);
DrawerContent.displayName = 'DrawerContent';

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  )
);
DrawerHeader.displayName = 'DrawerHeader';

export const DrawerTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(styles.title, className)}
    {...props}
  />
));
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(styles.description, className)}
    {...props}
  />
));
DrawerDescription.displayName = 'DrawerDescription';

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  )
);
DrawerBody.displayName = 'DrawerBody';

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  )
);
DrawerFooter.displayName = 'DrawerFooter';

// Semantic Aliases for Sheet
export const Sheet = Drawer;
export type SheetProps = DrawerProps;

export const SheetTrigger = DrawerTrigger;
export type SheetTriggerProps = DrawerTriggerProps;

export const SheetPortal = DrawerPortal;
export type SheetPortalProps = DrawerPortalProps;

export const SheetOverlay = DrawerOverlay;
export type SheetOverlayProps = DrawerOverlayProps;

export const SheetContent = DrawerContent;
export type SheetContentProps = DrawerContentProps;

export const SheetHeader = DrawerHeader;
export type SheetHeaderProps = DrawerHeaderProps;

export const SheetTitle = DrawerTitle;
export type SheetTitleProps = DrawerTitleProps;

export const SheetDescription = DrawerDescription;
export type SheetDescriptionProps = DrawerDescriptionProps;

export const SheetBody = DrawerBody;
export type SheetBodyProps = DrawerBodyProps;

export const SheetFooter = DrawerFooter;
export type SheetFooterProps = DrawerFooterProps;

export const SheetClose = DrawerClose;
export type SheetCloseProps = DrawerCloseProps;
