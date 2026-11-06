import React, { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../utils/cn';
import styles from './Popover.module.css';

export type PopoverSize = 'sm' | 'md' | 'lg' | 'auto';

export interface PopoverProps extends PopoverPrimitive.PopoverProps {}

export interface PopoverTriggerProps extends PopoverPrimitive.PopoverTriggerProps {}

export interface PopoverAnchorProps extends PopoverPrimitive.PopoverAnchorProps {}

export interface PopoverPortalProps extends PopoverPrimitive.PopoverPortalProps {}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  size?: PopoverSize;
  hasArrow?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
}

export interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface PopoverTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface PopoverDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface PopoverBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface PopoverFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface PopoverCloseProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> {}

export interface PopoverArrowProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow> {}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Popover: React.FC<PopoverProps> = PopoverPrimitive.Root;
Popover.displayName = 'Popover';

export const PopoverTrigger = PopoverPrimitive.Trigger;
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverAnchor = PopoverPrimitive.Anchor;
PopoverAnchor.displayName = 'PopoverAnchor';

export const PopoverPortal = PopoverPrimitive.Portal;
PopoverPortal.displayName = 'PopoverPortal';

export const PopoverClose = PopoverPrimitive.Close;
PopoverClose.displayName = 'PopoverClose';

export const PopoverArrow = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  PopoverArrowProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn(styles.arrow, className)}
    {...props}
  />
));
PopoverArrow.displayName = 'PopoverArrow';

export const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      sideOffset = 8,
      hasArrow = true,
      showCloseButton = false,
      closeLabel = 'Close popover',
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(styles.content, styles[`size-${size}`], className)}
        {...props}
      >
        {children}
        {hasArrow && <PopoverArrow />}
        {showCloseButton && (
          <PopoverPrimitive.Close
            aria-label={closeLabel}
            className={styles.closeButton}
          >
            <CloseIcon />
          </PopoverPrimitive.Close>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = 'PopoverContent';

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  )
);
PopoverHeader.displayName = 'PopoverHeader';

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h6 ref={ref} className={cn(styles.title, className)} {...props}>
      {children}
    </h6>
  )
);
PopoverTitle.displayName = 'PopoverTitle';

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn(styles.description, className)} {...props}>
      {children}
    </p>
  )
);
PopoverDescription.displayName = 'PopoverDescription';

export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  )
);
PopoverBody.displayName = 'PopoverBody';

export const PopoverFooter = forwardRef<HTMLDivElement, PopoverFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  )
);
PopoverFooter.displayName = 'PopoverFooter';
