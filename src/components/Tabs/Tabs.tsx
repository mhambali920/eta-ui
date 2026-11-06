import React, { forwardRef, createContext } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';
import styles from './Tabs.module.css';

export type TabsVariant = 'soft' | 'underline' | 'outline';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
}

const TabsContext = createContext<TabsContextValue>({
  variant: 'soft',
  size: 'md',
  orientation: 'horizontal',
});

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: TabsVariant;
  size?: TabsSize;
}

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

export const Tabs = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(
  (
    {
      variant = 'soft',
      size = 'md',
      orientation = 'horizontal',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TabsContext.Provider value={{ variant, size, orientation }}>
        <TabsPrimitive.Root
          ref={ref}
          orientation={orientation}
          className={cn(
            styles.tabs,
            styles[`variant-${variant}`],
            styles[`size-${size}`],
            styles[`orientation-${orientation}`],
            className
          )}
          {...props}
        >
          {children}
        </TabsPrimitive.Root>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(styles.list, className)}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(styles.content, className)}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
