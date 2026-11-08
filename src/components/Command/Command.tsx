import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';
import styles from './Command.module.css';

interface CommandContextValue {
  query: string;
  setQuery: (q: string) => void;
  matches: (text: string, keywords?: string[]) => boolean;
}

const CommandContext = createContext<CommandContextValue>({
  query: '',
  setQuery: () => {},
  matches: () => true,
});

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultQuery?: string;
  filterFn?: (value: string, query: string, keywords?: string[]) => boolean;
}

export const Command = forwardRef<HTMLDivElement, CommandProps>(
  ({ defaultQuery = '', filterFn, onKeyDown, className, children, ...props }, ref) => {
    const [query, setQuery] = useState(defaultQuery);
    const rootRef = useRef<HTMLDivElement>(null);

    const matches = (text: string, keywords?: string[]): boolean => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      if (filterFn) return filterFn(text, q, keywords);
      const haystack = [text, ...(keywords ?? [])].join(' ').toLowerCase();
      return haystack.includes(q);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const root = rootRef.current;
      if (root) {
        const items = Array.from(
          root.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled])')
        );
        if (items.length > 0) {
          const activeIdx = items.findIndex((el) => el.getAttribute('data-active') === 'true');
          const setActiveAt = (nextIdx: number) => {
            items.forEach((el, i) => {
              if (i === nextIdx) {
                el.setAttribute('data-active', 'true');
                el.classList.add(styles.itemActive);
              } else {
                el.removeAttribute('data-active');
                el.classList.remove(styles.itemActive);
              }
            });
          };

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = activeIdx < 0 ? 0 : (activeIdx + 1) % items.length;
            setActiveAt(next);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev =
              activeIdx <= 0 ? items.length - 1 : (activeIdx - 1 + items.length) % items.length;
            setActiveAt(prev);
          } else if (e.key === 'Home') {
            e.preventDefault();
            setActiveAt(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            setActiveAt(items.length - 1);
          } else if (e.key === 'Enter') {
            const target = activeIdx >= 0 ? items[activeIdx] : items[0];
            if (target) {
              e.preventDefault();
              target.click();
            }
          }
        }
      }
      onKeyDown?.(e);
    };

    return (
      <CommandContext.Provider value={{ query, setQuery, matches }}>
        <div
          ref={(node) => {
            (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="application"
          aria-label={props['aria-label'] ?? 'Command menu'}
          onKeyDown={handleKeyDown}
          className={cn(styles.command, className)}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = 'Command';

export const CommandInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, placeholder = 'Type a command or search...', onChange, ...props }, ref) => {
  const { query, setQuery } = useContext(CommandContext);

  return (
    <div className={styles.inputWrapper}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.searchIcon}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-autocomplete="list"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e);
        }}
        className={cn(styles.input, className)}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = 'CommandInput';

export const CommandList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} role="listbox" className={cn(styles.list, className)} {...props}>
      {children}
    </div>
  )
);
CommandList.displayName = 'CommandList';

export const CommandEmpty = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.empty, className)} {...props}>
      {children ?? 'No results found.'}
    </div>
  )
);
CommandEmpty.displayName = 'CommandEmpty';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ heading, className, children, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(styles.group, className)} {...props}>
      {heading && <div className={styles.groupHeading}>{heading}</div>}
      {children}
    </div>
  )
);
CommandGroup.displayName = 'CommandGroup';

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ value, keywords, disabled = false, onSelect, onClick, className, children, ...props }, ref) => {
    const { matches } = useContext(CommandContext);
    const resolvedValue =
      value ?? (typeof children === 'string' ? children : '');

    if (resolvedValue && !matches(resolvedValue, keywords)) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        data-value={resolvedValue}
        onClick={(e) => {
          if (disabled) return;
          onSelect?.(resolvedValue);
          onClick?.(e);
        }}
        className={cn(styles.item, disabled && styles.itemDisabled, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = 'CommandItem';

export const CommandSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn(styles.separator, className)} {...props} />
  )
);
CommandSeparator.displayName = 'CommandSeparator';

export const CommandShortcut = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn(styles.shortcut, className)} {...props}>
      {children}
    </span>
  )
);
CommandShortcut.displayName = 'CommandShortcut';

export interface CommandDialogProps extends DialogPrimitive.DialogProps {
  enableShortcut?: boolean;
  shortcutKey?: string;
  title?: string;
}

export const CommandDialog: React.FC<CommandDialogProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  enableShortcut = false,
  shortcutKey = 'k',
  title = 'Command Palette',
  children,
  ...props
}) => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!enableShortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcut, shortcutKey, open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content aria-label={title} className={styles.dialogContent}>
          <DialogPrimitive.Title style={{ display: 'none' }}>{title}</DialogPrimitive.Title>
          <Command>{children}</Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
CommandDialog.displayName = 'CommandDialog';
