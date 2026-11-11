import React, { forwardRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn';
import styles from './Tooltip.module.css';

export type TooltipVariant = 'dark' | 'soft';
export type TooltipSize = 'sm' | 'md' | 'lg';

export interface TooltipProviderProps extends TooltipPrimitive.TooltipProviderProps {}

export interface TooltipProps extends TooltipPrimitive.TooltipProps {
  content?: React.ReactNode;
  variant?: TooltipVariant;
  size?: TooltipSize;
  side?: TooltipPrimitive.TooltipContentProps['side'];
  sideOffset?: number;
  hasArrow?: boolean;
}

export interface TooltipTriggerProps extends TooltipPrimitive.TooltipTriggerProps {}

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: TooltipVariant;
  size?: TooltipSize;
  hasArrow?: boolean;
}

export interface TooltipArrowProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow> {}

export const TooltipProvider = TooltipPrimitive.Provider;
TooltipProvider.displayName = 'TooltipProvider';

export const TooltipRoot = TooltipPrimitive.Root;
TooltipRoot.displayName = 'TooltipRoot';

export const TooltipTrigger = TooltipPrimitive.Trigger;
TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipPortal = TooltipPrimitive.Portal;
TooltipPortal.displayName = 'TooltipPortal';

export const TooltipArrow = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  TooltipArrowProps
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn(styles.arrow, className)}
    {...props}
  />
));
TooltipArrow.displayName = 'TooltipArrow';

export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      children,
      variant = 'dark',
      size = 'md',
      sideOffset = 6,
      hasArrow = true,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(styles.content, styles[`size-${size}`], styles[`variant-${variant}`], className)}
        {...props}
      >
        {children}
        {hasArrow && <TooltipArrow />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = 'TooltipContent';

// Dual-purpose Tooltip: Shorthand when `content` prop is given, or primitive Root when omitted.
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  variant = 'dark',
  size = 'md',
  side = 'top',
  sideOffset = 6,
  hasArrow = true,
  ...props
}) => {
  if (content !== undefined) {
    return (
      <TooltipPrimitive.Root {...props}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipContent
          variant={variant}
          size={size}
          side={side}
          sideOffset={sideOffset}
          hasArrow={hasArrow}
        >
          {content}
        </TooltipContent>
      </TooltipPrimitive.Root>
    );
  }

  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
};
Tooltip.displayName = 'Tooltip';
