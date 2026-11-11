import React, { forwardRef } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '../../utils/cn';
import styles from './ScrollArea.module.css';

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  orientation?: 'vertical' | 'horizontal';
}

export const ScrollBar = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      styles.scrollbar,
      orientation === 'vertical' ? styles.vertical : styles.horizontal,
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className={styles.thumb} />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollBar.displayName = 'ScrollBar';

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  viewportRef?: React.Ref<HTMLDivElement>;
  viewportClassName?: string;
}

export const ScrollArea = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      orientation = 'vertical',
      viewportRef,
      viewportClassName,
      ...props
    },
    ref
  ) => {
    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(styles.root, className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className={cn(styles.viewport, viewportClassName)}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        {(orientation === 'vertical' || orientation === 'both') && (
          <ScrollBar orientation="vertical" />
        )}
        {(orientation === 'horizontal' || orientation === 'both') && (
          <ScrollBar orientation="horizontal" />
        )}
        <ScrollAreaPrimitive.Corner className={styles.corner} />
      </ScrollAreaPrimitive.Root>
    );
  }
);
ScrollArea.displayName = 'ScrollArea';

export const ScrollAreaViewport = ScrollAreaPrimitive.Viewport;
export const ScrollAreaCorner = ScrollAreaPrimitive.Corner;
export const ScrollAreaThumb = ScrollAreaPrimitive.Thumb;
