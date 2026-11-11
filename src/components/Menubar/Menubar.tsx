import React, { createContext, forwardRef, useContext } from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { cn } from '../../utils/cn';
import styles from './Menubar.module.css';

export type MenubarSize = 'sm' | 'md' | 'lg';

const MenubarSizeContext = createContext<MenubarSize>('md');

export interface MenubarProps extends MenubarPrimitive.MenubarProps {
  size?: MenubarSize;
}

export interface MenubarMenuProps extends MenubarPrimitive.MenubarMenuProps {}

export interface MenubarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> {}

export interface MenubarContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> {
  size?: MenubarSize;
}

export interface MenubarItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  color?: 'default' | 'danger';
  inset?: boolean;
}

export interface MenubarCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> {}

export interface MenubarRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> {}

export interface MenubarLabelProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> {
  inset?: boolean;
}

export interface MenubarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> {}

export interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface MenubarSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> {
  inset?: boolean;
}

export interface MenubarSubContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> {}

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

export const Menubar = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  MenubarProps
>(({ size = 'md', className, ...props }, ref) => (
  <MenubarSizeContext.Provider value={size}>
    <MenubarPrimitive.Root
      ref={ref}
      className={cn(styles.root, styles[`size-${size}`], className)}
      {...props}
    />
  </MenubarSizeContext.Provider>
));
Menubar.displayName = 'Menubar';

export const MenubarMenu: React.FC<MenubarMenuProps> = (props) => (
  <MenubarPrimitive.Menu {...props} />
);
MenubarMenu.displayName = 'MenubarMenu';

export const MenubarGroup = MenubarPrimitive.Group;
MenubarGroup.displayName = 'MenubarGroup';

export const MenubarPortal = MenubarPrimitive.Portal;
MenubarPortal.displayName = 'MenubarPortal';

export const MenubarSub = MenubarPrimitive.Sub;
MenubarSub.displayName = 'MenubarSub';

export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
MenubarRadioGroup.displayName = 'MenubarRadioGroup';

export const MenubarTrigger = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  MenubarTriggerProps
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(styles.trigger, className)}
    {...props}
  />
));
MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarContent = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  MenubarContentProps
>(
  (
    {
      size: sizeProp,
      className,
      align = 'start',
      alignOffset = -4,
      sideOffset = 8,
      ...props
    },
    ref
  ) => {
    const contextSize = useContext(MenubarSizeContext);
    const size = sizeProp ?? contextSize;
    return (
      <MenubarPrimitive.Portal>
        <MenubarPrimitive.Content
          ref={ref}
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(styles.content, styles[`size-${size}`], className)}
          {...props}
        />
      </MenubarPrimitive.Portal>
    );
  }
);
MenubarContent.displayName = 'MenubarContent';

export const MenubarItem = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  MenubarItemProps
>(({ className, color = 'default', inset, ...props }, ref) => (
  <MenubarPrimitive.Item
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
MenubarItem.displayName = 'MenubarItem';

export const MenubarCheckboxItem = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(styles.item, styles.checkboxItem, className)}
    {...props}
  >
    <span className={styles.itemIndicatorSlot}>
      <MenubarPrimitive.ItemIndicator className={styles.indicator}>
        <CheckIcon />
      </MenubarPrimitive.ItemIndicator>
    </span>
    <span className={styles.itemText}>{children}</span>
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export const MenubarRadioItem = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  MenubarRadioItemProps
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(styles.item, styles.radioItem, className)}
    {...props}
  >
    <span className={styles.itemIndicatorSlot}>
      <MenubarPrimitive.ItemIndicator className={styles.indicator}>
        <CheckIcon />
      </MenubarPrimitive.ItemIndicator>
    </span>
    <span className={styles.itemText}>{children}</span>
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = 'MenubarRadioItem';

export const MenubarLabel = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  MenubarLabelProps
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(styles.label, inset && styles.inset, className)}
    {...props}
  />
));
MenubarLabel.displayName = 'MenubarLabel';

export const MenubarSeparator = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  MenubarSeparatorProps
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
));
MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarShortcut: React.FC<MenubarShortcutProps> = ({
  className,
  children,
  ...props
}) => (
  <span className={cn(styles.shortcut, className)} {...props}>
    {children}
  </span>
);
MenubarShortcut.displayName = 'MenubarShortcut';

export const MenubarSubTrigger = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  MenubarSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(styles.item, styles.subTrigger, inset && styles.inset, className)}
    {...props}
  >
    <span className={styles.itemText}>{children}</span>
    <ChevronRightIcon />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export const MenubarSubContent = forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  MenubarSubContentProps
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.SubContent
      ref={ref}
      className={cn(styles.content, styles.subContent, className)}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarSubContent.displayName = 'MenubarSubContent';
