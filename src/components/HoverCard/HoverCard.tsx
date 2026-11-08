import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './HoverCard.module.css';

export type HoverCardPlacement = 'top' | 'right' | 'bottom' | 'left';
export type HoverCardSize = 'sm' | 'md' | 'lg';

interface HoverCardContextValue {
  open: boolean;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  setImmediateOpen: (open: boolean) => void;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) {
    throw new Error('HoverCard subcomponents must be used within <HoverCard>');
  }
  return ctx;
}

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      openDelay = 200,
      closeDelay = 150,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = () => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };

    const setImmediateOpen = (next: boolean) => {
      clearTimers();
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    };

    const scheduleOpen = () => {
      clearTimers();
      if (openDelay <= 0) {
        setImmediateOpen(true);
      } else {
        openTimerRef.current = setTimeout(() => {
          setImmediateOpen(true);
        }, openDelay);
      }
    };

    const scheduleClose = () => {
      clearTimers();
      if (closeDelay <= 0) {
        setImmediateOpen(false);
      } else {
        closeTimerRef.current = setTimeout(() => {
          setImmediateOpen(false);
        }, closeDelay);
      }
    };

    useEffect(() => {
      return () => clearTimers();
    }, []);

    return (
      <HoverCardContext.Provider
        value={{ open, scheduleOpen, scheduleClose, setImmediateOpen }}
      >
        <div ref={ref} className={cn(styles.root, className)} {...props}>
          {children}
        </div>
      </HoverCardContext.Provider>
    );
  }
);
HoverCard.displayName = 'HoverCard';

export const HoverCardTrigger = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, onMouseEnter, onMouseLeave, onFocus, onBlur, children, ...props }, ref) => {
  const ctx = useHoverCardContext();

  return (
    <span
      ref={ref}
      tabIndex={0}
      data-state={ctx.open ? 'open' : 'closed'}
      onMouseEnter={(e) => {
        ctx.scheduleOpen();
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        ctx.scheduleClose();
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        ctx.setImmediateOpen(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        ctx.scheduleClose();
        onBlur?.(e);
      }}
      className={cn(styles.trigger, className)}
      {...props}
    >
      {children}
    </span>
  );
});
HoverCardTrigger.displayName = 'HoverCardTrigger';

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: HoverCardPlacement;
  size?: HoverCardSize;
  showArrow?: boolean;
}

export const HoverCardArrow = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn(styles.arrow, className)} {...props} />
  )
);
HoverCardArrow.displayName = 'HoverCardArrow';

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  (
    {
      placement = 'bottom',
      size = 'md',
      showArrow = false,
      onMouseEnter,
      onMouseLeave,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const ctx = useHoverCardContext();
    if (!ctx.open) return null;

    return (
      <div
        ref={ref}
        role="dialog"
        data-state="open"
        data-placement={placement}
        onMouseEnter={(e) => {
          ctx.scheduleOpen();
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          ctx.scheduleClose();
          onMouseLeave?.(e);
        }}
        className={cn(styles.content, styles[size], styles[placement], className)}
        {...props}
      >
        {showArrow && <HoverCardArrow />}
        {children}
      </div>
    );
  }
);
HoverCardContent.displayName = 'HoverCardContent';
