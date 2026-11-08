import React, { createContext, forwardRef, useContext, useId, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn';
import styles from './Collapsible.module.css';

interface CollapsibleContextValue {
  open: boolean;
  disabled: boolean;
  contentId: string;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error('Collapsible subcomponents must be used within <Collapsible>');
  }
  return ctx;
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const uid = useId();
    const contentId = `eta-collapsible-${uid}`;
    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const toggle = () => {
      if (disabled) return;
      const next = !open;
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    };

    return (
      <CollapsibleContext.Provider value={{ open, disabled, contentId, toggle }}>
        <div
          ref={ref}
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          className={cn(styles.root, disabled && styles.disabled, className)}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  hideIcon?: boolean;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ asChild = false, hideIcon = false, onClick, className, children, ...props }, ref) => {
    const ctx = useCollapsibleContext();
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        aria-expanded={ctx.open}
        aria-controls={ctx.contentId}
        data-state={ctx.open ? 'open' : 'closed'}
        data-disabled={ctx.disabled ? '' : undefined}
        disabled={ctx.disabled}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          ctx.toggle();
          onClick?.(e);
        }}
        className={cn(!asChild && styles.trigger, className)}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span>{children}</span>
            {!hideIcon && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(styles.chevron, ctx.open && styles.chevronOpen)}
                aria-hidden="true"
              >
                <polyline points="4 6 8 10 12 6" />
              </svg>
            )}
          </>
        )}
      </Comp>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ forceMount = false, className, children, ...props }, ref) => {
    const ctx = useCollapsibleContext();
    if (!ctx.open && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={ctx.contentId}
        hidden={!ctx.open}
        data-state={ctx.open ? 'open' : 'closed'}
        className={cn(styles.content, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';
