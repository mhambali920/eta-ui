import React, { createContext, forwardRef, useContext } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../utils/cn';
import styles from './DropdownMenu.module.css';

export type DropdownMenuSize = 'sm' | 'md' | 'lg';

const DropdownMenuSizeContext = createContext<DropdownMenuSize>('md');

export interface DropdownMenuProps extends DropdownMenuPrimitive.DropdownMenuProps {
  size?: DropdownMenuSize;
}

export interface DropdownMenuTriggerProps
  extends DropdownMenuPrimitive.DropdownMenuTriggerProps {}

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  size?: DropdownMenuSize;
}

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  color?: 'default' | 'danger';
}

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {}

export interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {}

export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {}

export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {}

export interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {}

export interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ size = 'md', children, ...props }) => (
  <DropdownMenuSizeContext.Provider value={size}>
    <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>
  </DropdownMenuSizeContext.Provider>
);
DropdownMenu.displayName = 'DropdownMenu';

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
DropdownMenuGroup.displayName = 'DropdownMenuGroup';

export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
DropdownMenuPortal.displayName = 'DropdownMenuPortal';

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
DropdownMenuSub.displayName = 'DropdownMenuSub';

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

export const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ size: sizeProp, className, sideOffset = 4, ...props }, ref) => {
  const contextSize = useContext(DropdownMenuSizeContext);
  const size = sizeProp ?? contextSize;
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(styles.content, styles[`size-${size}`], className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, color = 'default', ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      styles.item,
      color === 'danger' && styles.danger,
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(styles.item, className)}
    {...props}
  >
    <span>{children}</span>
    <DropdownMenuPrimitive.ItemIndicator className={styles.indicator}>
      <CheckIcon />
    </DropdownMenuPrimitive.ItemIndicator>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(styles.item, className)}
    {...props}
  >
    <span>{children}</span>
    <DropdownMenuPrimitive.ItemIndicator className={styles.indicator}>
      <CheckIcon />
    </DropdownMenuPrimitive.ItemIndicator>
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(styles.label, className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({
  className,
  ...props
}) => <span className={cn(styles.shortcut, className)} {...props} />;
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export const DropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(styles.subTrigger, className)}
    {...props}
  >
    <span>{children}</span>
    <span className={styles.indicator}>
      <ChevronRightIcon />
    </span>
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(styles.content, className)}
    {...props}
  />
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';
