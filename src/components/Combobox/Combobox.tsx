import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './Combobox.module.css';

export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxVariant = 'outline' | 'filled';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface ComboboxContextValue {
  listboxId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  selectedValues: string[];
  multiple: boolean;
  size: ComboboxSize;
  variant: ComboboxVariant;
  disabled: boolean;
  isInvalid: boolean;
  isClearable: boolean;
  placeholder?: string;
  activeValue: string | undefined;
  setActiveValue: (val: string | undefined) => void;
  selectOption: (value: string, label?: string) => void;
  removeValue: (value: string) => void;
  clearAll: () => void;
  isSelected: (value: string) => boolean;
  matchesQuery: (label: string, value: string) => boolean;
  getLabel: (value: string) => string;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext() {
  const ctx = useContext(ComboboxContext);
  if (!ctx) {
    throw new Error('Combobox subcomponents must be used within <Combobox>');
  }
  return ctx;
}

export interface ComboboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: ComboboxOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  size?: ComboboxSize;
  variant?: ComboboxVariant;
  isInvalid?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  defaultOpen?: boolean;
  filterFn?: (option: { value: string; label: string }, query: string) => boolean;
}

export const ComboboxTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, ...props }, ref) => {
  const ctx = useComboboxContext();

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={-1}
      aria-label="Toggle options"
      disabled={ctx.disabled}
      onClick={(e) => {
        e.stopPropagation();
        ctx.setOpen(!ctx.open);
        onClick?.(e);
      }}
      className={cn(styles.iconButton, className)}
      {...props}
    >
      {children ?? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(ctx.open && styles.chevronOpen)}
          aria-hidden="true"
        >
          <polyline points="4 6 8 10 12 6" />
        </svg>
      )}
    </button>
  );
});
ComboboxTrigger.displayName = 'ComboboxTrigger';

export const ComboboxInput = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>
>(({ className, onFocus, onBlur, onChange, onKeyDown, ...props }, ref) => {
  const ctx = useComboboxContext();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ctx.setQuery(e.target.value);
    if (!ctx.open) ctx.setOpen(true);
    onChange?.(e);
  };

  return (
    <div
      className={cn(
        styles.control,
        styles[ctx.size],
        styles[ctx.variant],
        (isFocused || ctx.open) && styles.focused,
        ctx.isInvalid && styles.invalid,
        ctx.disabled && styles.disabled
      )}
      onClick={() => {
        if (!ctx.disabled && !ctx.open) {
          ctx.setOpen(true);
        }
      }}
    >
      {ctx.multiple && ctx.selectedValues.length > 0 && (
        <div className={styles.chips}>
          {ctx.selectedValues.map((val) => (
            <span key={val} className={styles.chip}>
              <span>{ctx.getLabel(val)}</span>
              {!ctx.disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${ctx.getLabel(val)}`}
                  className={styles.chipRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    ctx.removeValue(val);
                  }}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded={ctx.open}
        aria-controls={ctx.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          ctx.open && ctx.activeValue ? `${ctx.listboxId}-item-${ctx.activeValue}` : undefined
        }
        aria-invalid={ctx.isInvalid || undefined}
        disabled={ctx.disabled}
        placeholder={
          ctx.multiple && ctx.selectedValues.length > 0 ? '' : (props.placeholder ?? ctx.placeholder)
        }
        value={ctx.query}
        onChange={handleChange}
        onFocus={(e) => {
          setIsFocused(true);
          ctx.setOpen(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onKeyDown={onKeyDown}
        className={cn(styles.input, className)}
        {...props}
      />
      <div className={styles.actions}>
        {ctx.isClearable && (ctx.selectedValues.length > 0 || ctx.query.length > 0) && !ctx.disabled && (
          <button
            type="button"
            aria-label="Clear selection"
            className={styles.iconButton}
            onClick={(e) => {
              e.stopPropagation();
              ctx.clearAll();
            }}
          >
            ×
          </button>
        )}
        <ComboboxTrigger />
      </div>
    </div>
  );
});
ComboboxInput.displayName = 'ComboboxInput';

export const ComboboxContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = useComboboxContext();
    if (!ctx.open) return null;

    return (
      <div ref={ref} className={cn(styles.content, className)} {...props}>
        {children}
      </div>
    );
  }
);
ComboboxContent.displayName = 'ComboboxContent';

export const ComboboxList = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = useComboboxContext();
    return (
      <ul
        ref={ref}
        id={ctx.listboxId}
        role="listbox"
        aria-multiselectable={ctx.multiple || undefined}
        className={cn(styles.list, className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
ComboboxList.displayName = 'ComboboxList';

export interface ComboboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ heading, className, children, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(styles.group, className)} {...props}>
      {heading && <div className={styles.groupHeading}>{heading}</div>}
      {children}
    </div>
  )
);
ComboboxGroup.displayName = 'ComboboxGroup';

export interface ComboboxItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
  label?: string;
  disabled?: boolean;
}

export const ComboboxItem = forwardRef<HTMLLIElement, ComboboxItemProps>(
  ({ value, label, disabled = false, className, children, onClick, ...props }, ref) => {
    const ctx = useComboboxContext();
    const resolvedLabel = label ?? (typeof children === 'string' ? children : value);

    if (!ctx.matchesQuery(resolvedLabel, value)) {
      return null;
    }

    const selected = ctx.isSelected(value);
    const active = ctx.activeValue === value;

    return (
      <li
        ref={ref}
        id={`${ctx.listboxId}-item-${value}`}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        onMouseEnter={() => {
          if (!disabled) ctx.setActiveValue(value);
        }}
        onMouseDown={(e) => {
          // Prevent input blur before selection
          e.preventDefault();
        }}
        onClick={(e) => {
          if (disabled) return;
          ctx.selectOption(value, resolvedLabel);
          onClick?.(e);
        }}
        className={cn(
          styles.item,
          active && styles.itemActive,
          selected && styles.itemSelected,
          disabled && styles.itemDisabled,
          className
        )}
        {...props}
      >
        <span>{children ?? resolvedLabel}</span>
        {selected && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.checkIcon}
            aria-hidden="true"
          >
            <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        )}
      </li>
    );
  }
);
ComboboxItem.displayName = 'ComboboxItem';

export const ComboboxEmpty = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.empty, className)} {...props}>
      {children ?? 'No results found.'}
    </div>
  )
);
ComboboxEmpty.displayName = 'ComboboxEmpty';

function toArray(val: string | string[] | undefined): string[] {
  if (val === undefined) return [];
  return Array.isArray(val) ? val : val ? [val] : [];
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options = [],
      value: controlledValue,
      defaultValue,
      onChange,
      multiple = false,
      placeholder = 'Search or select...',
      emptyMessage = 'No matching options.',
      size = 'md',
      variant = 'outline',
      isInvalid = false,
      disabled = false,
      isClearable = true,
      defaultOpen = false,
      filterFn,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const uid = useId();
    const listboxId = `eta-combobox-listbox-${uid}`;
    const rootRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledValue !== undefined;
    const [uncontrolledSelected, setUncontrolledSelected] = useState<string[]>(() =>
      toArray(defaultValue)
    );
    const selectedValues = isControlled ? toArray(controlledValue) : uncontrolledSelected;

    const labelMapRef = useRef<Record<string, string>>({});
    for (const opt of options) {
      labelMapRef.current[opt.value] = opt.label;
    }

    const getLabel = (val: string) => labelMapRef.current[val] ?? val;

    const [open, setOpenState] = useState(defaultOpen);
    const [query, setQuery] = useState<string>(() => {
      if (!multiple && selectedValues[0]) {
        return getLabel(selectedValues[0]);
      }
      return '';
    });
    const [isTyping, setIsTyping] = useState(false);
    const [activeValue, setActiveValue] = useState<string | undefined>(undefined);

    const setOpen = (nextOpen: boolean) => {
      if (disabled) return;
      setOpenState(nextOpen);
      if (!nextOpen) {
        setIsTyping(false);
      }
    };

    const handleSetQuery = (q: string) => {
      setIsTyping(true);
      setQuery(q);
    };

    const matchesQuery = (label: string, value: string) => {
      const effectiveQuery = isTyping ? query.trim() : '';
      if (!effectiveQuery) return true;
      if (filterFn) {
        return filterFn({ value, label }, effectiveQuery);
      }
      return label.toLowerCase().includes(effectiveQuery.toLowerCase());
    };

    const visibleOptions = options.filter((opt) => matchesQuery(opt.label, opt.value));

    const updateSelection = (next: string[]) => {
      if (!isControlled) {
        setUncontrolledSelected(next);
      }
      onChange?.(multiple ? next : (next[0] ?? ''));
    };

    const selectOption = (val: string, label?: string) => {
      if (label) {
        labelMapRef.current[val] = label;
      }
      if (multiple) {
        const exists = selectedValues.includes(val);
        const next = exists
          ? selectedValues.filter((item) => item !== val)
          : [...selectedValues, val];
        updateSelection(next);
        setQuery('');
        setIsTyping(false);
      } else {
        updateSelection([val]);
        setQuery(label ?? getLabel(val));
        setIsTyping(false);
        setOpenState(false);
      }
    };

    const removeValue = (val: string) => {
      const next = selectedValues.filter((item) => item !== val);
      updateSelection(next);
    };

    const clearAll = () => {
      updateSelection([]);
      setQuery('');
      setIsTyping(false);
    };

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpenState(false);
          setIsTyping(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const enabledVisible = visibleOptions.filter((o) => !o.disabled);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) {
          setOpenState(true);
          if (enabledVisible[0]) setActiveValue(enabledVisible[0].value);
          return;
        }
        if (enabledVisible.length > 0) {
          const idx = enabledVisible.findIndex((o) => o.value === activeValue);
          const next = enabledVisible[(idx + 1) % enabledVisible.length];
          setActiveValue(next.value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (open && enabledVisible.length > 0) {
          const idx = enabledVisible.findIndex((o) => o.value === activeValue);
          const prev =
            enabledVisible[(idx - 1 + enabledVisible.length) % enabledVisible.length];
          setActiveValue(prev.value);
        }
      } else if (e.key === 'Enter' && open && activeValue) {
        e.preventDefault();
        const found = options.find((o) => o.value === activeValue);
        if (found && !found.disabled) {
          selectOption(found.value, found.label);
        } else {
          selectOption(activeValue);
        }
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpenState(false);
        setIsTyping(false);
      }
    };

    const contextValue: ComboboxContextValue = {
      listboxId,
      open,
      setOpen,
      query,
      setQuery: handleSetQuery,
      selectedValues,
      multiple,
      size,
      variant,
      disabled,
      isInvalid,
      isClearable,
      placeholder,
      activeValue,
      setActiveValue,
      selectOption,
      removeValue,
      clearAll,
      isSelected: (val) => selectedValues.includes(val),
      matchesQuery,
      getLabel,
    };

    return (
      <ComboboxContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onKeyDown={handleKeyDown}
          className={cn(styles.root, className)}
          {...props}
        >
          {children ?? (
            <>
              <ComboboxInput aria-label={props['aria-label']} />
              <ComboboxContent>
                {visibleOptions.length > 0 ? (
                  <ComboboxList>
                    {visibleOptions.map((opt) => (
                      <ComboboxItem
                        key={opt.value}
                        value={opt.value}
                        label={opt.label}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                ) : (
                  <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                )}
              </ComboboxContent>
            </>
          )}
        </div>
      </ComboboxContext.Provider>
    );
  }
);
Combobox.displayName = 'Combobox';
