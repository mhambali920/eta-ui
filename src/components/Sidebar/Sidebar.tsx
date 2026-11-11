import React, {
  createContext,
  forwardRef,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn';
import styles from './Sidebar.module.css';

export type SidebarState = 'expanded' | 'collapsed';
export type SidebarVariant = 'standard' | 'floating' | 'inset';
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none';

export interface SidebarContextValue {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: controlledOpen,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [openMobile, setOpenMobile] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const open = isControlled ? controlledOpen : internalOpen;

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const setOpen = useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setInternalOpen(value);
        }
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange]
    );

    const toggleSidebar = useCallback(() => {
      if (isMobile) {
        setOpenMobile((prev) => !prev);
      } else {
        setOpen(!open);
      }
    }, [isMobile, open, setOpen]);

    const state: SidebarState = open ? 'expanded' : 'collapsed';

    return (
      <SidebarContext.Provider
        value={{
          state,
          open,
          setOpen,
          openMobile,
          setOpenMobile,
          isMobile,
          toggleSidebar,
        }}
      >
        <div
          ref={ref}
          className={cn(styles.provider, className)}
          data-state={state}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsible?: SidebarCollapsible;
  variant?: SidebarVariant;
  side?: 'left' | 'right';
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      collapsible = 'icon',
      variant = 'standard',
      side = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, openMobile, setOpenMobile, isMobile } = useSidebar();

    return (
      <>
        {isMobile && openMobile && (
          <div
            className={styles.backdrop}
            onClick={() => setOpenMobile(false)}
            aria-hidden="true"
          />
        )}
        <aside
          ref={ref}
          data-state={state}
          data-collapsible={collapsible}
          data-variant={variant}
          data-side={side}
          data-mobile={isMobile ? 'true' : undefined}
          data-mobile-open={openMobile ? 'true' : undefined}
          className={cn(
            styles.sidebar,
            styles[`variant-${variant}`],
            styles[`side-${side}`],
            collapsible === 'icon' && state === 'collapsed' && styles.collapsedIcon,
            collapsible === 'offcanvas' && state === 'collapsed' && styles.collapsedOffcanvas,
            isMobile && styles.mobileSidebar,
            isMobile && openMobile && styles.mobileOpen,
            className
          )}
          {...props}
        >
          <div className={styles.inner}>{children}</div>
        </aside>
      </>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export const SidebarHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.header, className)} {...props} />
  )
);
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...props} />
  )
);
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.content, className)} {...props} />
  )
);
SidebarContent.displayName = 'SidebarContent';

export const SidebarGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.group, className)} {...props} />
  )
);
SidebarGroup.displayName = 'SidebarGroup';

export const SidebarGroupLabel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.groupLabel, className)} {...props} />
  )
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export const SidebarGroupContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.groupContent, className)} {...props} />
  )
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

export const SidebarMenu = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn(styles.menu, className)} {...props} />
  )
);
SidebarMenu.displayName = 'SidebarMenu';

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  defaultFlyoutOpen?: boolean;
}

export const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ defaultFlyoutOpen = false, className, children, ...props }, ref) => {
    const { state } = useSidebar();
    const [flyoutOpen, setFlyoutOpen] = useState(defaultFlyoutOpen);

    const childrenArray = React.Children.toArray(children);
    const buttonChild = childrenArray.find(
      (child) =>
        React.isValidElement(child) &&
        ((child.type as any)?.displayName === 'SidebarMenuButton' ||
          (child.type as any) === SidebarMenuButton)
    );
    const subChild = childrenArray.find(
      (child) =>
        React.isValidElement(child) &&
        ((child.type as any)?.displayName === 'SidebarMenuSub' ||
          (child.type as any) === SidebarMenuSub)
    );
    const otherChildren = childrenArray.filter(
      (child) => child !== buttonChild && child !== subChild
    );

    if (state === 'collapsed' && subChild && buttonChild && React.isValidElement(buttonChild)) {
      const buttonElement = buttonChild as React.ReactElement<{ children?: React.ReactNode }>;
      const btnChildren = React.Children.toArray(buttonElement.props.children);
      const labelChild = btnChildren.find(
        (c) =>
          typeof c === 'string' ||
          (React.isValidElement<{ children?: React.ReactNode }>(c) &&
            (c.type === 'span' || typeof c.props.children === 'string'))
      );

      return (
        <PopoverPrimitive.Root open={flyoutOpen} onOpenChange={setFlyoutOpen}>
          <li ref={ref} className={cn(styles.menuItem, className)} {...props}>
            <PopoverPrimitive.Trigger asChild>
              {buttonChild}
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                side="right"
                align="start"
                sideOffset={12}
                className={styles.collapsedFlyout}
                onClick={() => setFlyoutOpen(false)}
              >
                {labelChild && (
                  <div className={styles.flyoutHeader}>{labelChild}</div>
                )}
                {subChild}
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
            {otherChildren}
          </li>
        </PopoverPrimitive.Root>
      );
    }

    return (
      <li ref={ref} className={cn(styles.menuItem, className)} {...props}>
        {children}
      </li>
    );
  }
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      asChild = false,
      isActive = false,
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-active={isActive ? 'true' : undefined}
        className={cn(
          styles.menuButton,
          styles[`size-${size}`],
          isActive && styles.active,
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarMenuBadge = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn(styles.menuBadge, className)} {...props} />
  )
);
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

export const SidebarMenuSub = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn(styles.menuSub, className)} {...props} />
  )
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

export const SidebarMenuSubItem = forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(styles.menuSubItem, className)} {...props} />
  )
);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export interface SidebarMenuSubButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  isActive?: boolean;
}

export const SidebarMenuSubButton = forwardRef<HTMLAnchorElement, SidebarMenuSubButtonProps>(
  ({ asChild = false, isActive = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        data-active={isActive ? 'true' : undefined}
        className={cn(styles.menuSubButton, isActive && styles.subActive, className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export const SidebarInset = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn(styles.inset, className)} {...props} />
  )
);
SidebarInset.displayName = 'SidebarInset';

export const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      className={cn(styles.trigger, className)}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.triggerIcon}
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        <path d="m14 9-3 3 3 3" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';
