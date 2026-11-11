import React, { createContext, forwardRef, useContext } from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { cn } from '../../utils/cn';
import styles from './ContextMenu.module.css';

export type ContextMenuSize = 'sm' | 'md' | 'lg';

const ContextMenuSizeContext = createContext<ContextMenuSize>('md');

export interface ContextMenuProps extends ContextMenuPrimitive.ContextMenuProps {
  size?: ContextMenuSize;
}

export interface ContextMenuTriggerProps
  extends ContextMenuPrimitive.ContextMenuTriggerProps {}

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {
  size?: ContextMenuSize;
}

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  color?: 'default' | 'danger';
  inset?: boolean;
}

export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> {}

export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> {}

export interface ContextMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> {
  inset?: boolean;
}

export interface ContextMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> {}

export interface ContextMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> {}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.icon}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.icon}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ContextMenu: React.FC<ContextMenuProps> = ({ size = 'md', children, ...props }) => (
  <ContextMenuSizeContext.Provider value={size}>
    <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>
  </ContextMenuSizeContext.Provider>
);
ContextMenu.displayName = 'ContextMenu';

export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export const ContextMenuGroup = ContextMenuPrimitive.Group;
ContextMenuGroup.displayName = 'ContextMenuGroup';

export const ContextMenuPortal = ContextMenuPrimitive.Portal;
ContextMenuPortal.displayName = 'ContextMenuPortal';

export const ContextMenuSub = ContextMenuPrimitive.Sub;
ContextMenuSub.displayName = 'ContextMenuSub';

export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
ContextMenuRadioGroup.displayName = 'ContextMenuRadioGroup';

export const ContextMenuContent = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ size: sizeProp, className, ...props }, ref) => {
  const contextSize = useContext(ContextMenuSizeContext);
  const size = sizeProp ?? contextSize;
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(styles.content, styles[`size-${size}`], className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuItem = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, color = 'default', inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      styles.item,
      color === 'danger' && styles.danger,
      inset && styles.inset,
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(styles.item, styles.checkboxItem, className)}
    {...props}
  >
    <span className={styles.itemIndicatorSlot}>
      <ContextMenuPrimitive.ItemIndicator className={styles.indicator}>
        <CheckIcon />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    <span className={styles.itemText}>{children}</span>
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export const ContextMenuRadioItem = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(styles.item, styles.radioItem, className)}
    {...props}
  >
    <span className={styles.itemIndicatorSlot}>
      <ContextMenuPrimitive.ItemIndicator className={styles.indicator}>
        <CheckIcon />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    <span className={styles.itemText}>{children}</span>
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

export const ContextMenuLabel = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(styles.label, inset && styles.inset, className)}
    {...props}
  />
));
ContextMenuLabel.displayName = 'ContextMenuLabel';

export const ContextMenuSeparator = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuShortcut: React.FC<ContextMenuShortcutProps> = ({
  className,
  children,
  ...props
}) => (
  <span className={cn(styles.shortcut, className)} {...props}>
    {children}
  </span>
);
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export const ContextMenuSubTrigger = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(styles.item, styles.subTrigger, inset && styles.inset, className)}
    {...props}
  >
    <span className={styles.itemText}>{children}</span>
    <ChevronRightIcon />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export const ContextMenuSubContent = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(styles.content, styles.subContent, className)}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuSubContent.displayName = 'ContextMenuSubContent';
