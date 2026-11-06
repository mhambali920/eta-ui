import React, { forwardRef, createContext, useContext } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '../../utils/cn';
import styles from './Accordion.module.css';

export type AccordionVariant = 'bordered' | 'flush' | 'soft';
export type AccordionSize = 'sm' | 'md' | 'lg';

interface AccordionContextValue {
  variant: AccordionVariant;
  size: AccordionSize;
}

const AccordionContext = createContext<AccordionContextValue>({
  variant: 'bordered',
  size: 'md',
});

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export type AccordionProps = (
  | AccordionPrimitive.AccordionSingleProps
  | AccordionPrimitive.AccordionMultipleProps
) & {
  variant?: AccordionVariant;
  size?: AccordionSize;
  className?: string;
  children?: React.ReactNode;
};

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

export interface AccordionHeaderProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header> {}

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  showChevron?: boolean;
}

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

export const Accordion = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(
  (
    {
      variant = 'bordered',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <AccordionContext.Provider value={{ variant, size }}>
        <AccordionPrimitive.Root
          ref={ref as any}
          className={cn(
            styles.accordion,
            styles[`variant-${variant}`],
            styles[`size-${size}`],
            className
          )}
          {...(props as any)}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

export const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(styles.item, className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionHeader = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  AccordionHeaderProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header
    ref={ref}
    className={cn(styles.header, className)}
    {...props}
  />
));
AccordionHeader.displayName = 'AccordionHeader';

export const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, showChevron = true, ...props }, ref) => (
  <AccordionPrimitive.Header className={styles.header}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      {...props}
    >
      <span>{children}</span>
      {showChevron && (
        <span className={styles.chevron} aria-hidden="true">
          <ChevronDownIcon />
        </span>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { size } = useContext(AccordionContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(styles.content, styles[`size-${size}`], className)}
      {...props}
    >
      <div className={styles.contentBody}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = 'AccordionContent';
