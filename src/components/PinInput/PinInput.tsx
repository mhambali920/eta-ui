import React, { createContext, forwardRef, useContext, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './PinInput.module.css';

export type PinInputSize = 'sm' | 'md' | 'lg';
export type PinInputVariant = 'outline' | 'filled';
export type PinInputType = 'numeric' | 'alphanumeric';

interface PinInputContextValue {
  values: string[];
  length: number;
  type: PinInputType;
  size: PinInputSize;
  variant: PinInputVariant;
  mask: boolean;
  disabled: boolean;
  isInvalid: boolean;
  placeholder: string;
  setCharAt: (index: number, char: string) => void;
  handlePasteAt: (index: number, text: string) => void;
  focusField: (index: number) => void;
  registerInput: (index: number, el: HTMLInputElement | null) => void;
}

const PinInputContext = createContext<PinInputContextValue | null>(null);

function usePinInputContext() {
  const ctx = useContext(PinInputContext);
  if (!ctx) {
    throw new Error('PinInput subcomponents must be used within <PinInput>');
  }
  return ctx;
}

export interface PinInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  length?: number;
  type?: PinInputType;
  size?: PinInputSize;
  variant?: PinInputVariant;
  mask?: boolean;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export interface PinInputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  index: number;
}

export const PinInputGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.group, className)} {...props}>
      {children}
    </div>
  )
);
PinInputGroup.displayName = 'PinInputGroup';

export const PinInputSeparator = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} role="separator" className={cn(styles.separator, className)} {...props}>
      {children ?? '—'}
    </span>
  )
);
PinInputSeparator.displayName = 'PinInputSeparator';

export const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  ({ index, className, onKeyDown, onChange, onPaste, ...props }, ref) => {
    const ctx = usePinInputContext();
    const char = ctx.values[index] ?? '';

    const setRef = (el: HTMLInputElement | null) => {
      ctx.registerInput(index, el);
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const nextChar = raw.slice(-1);
      ctx.setCharAt(index, nextChar);
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (char) {
          ctx.setCharAt(index, '');
        } else if (index > 0) {
          ctx.setCharAt(index - 1, '');
          ctx.focusField(index - 1);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        ctx.focusField(index - 1);
      } else if (e.key === 'ArrowRight' && index < ctx.length - 1) {
        e.preventDefault();
        ctx.focusField(index + 1);
      }
      onKeyDown?.(e);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text/plain');
      if (pasted) {
        ctx.handlePasteAt(index, pasted);
      }
      onPaste?.(e);
    };

    return (
      <input
        ref={setRef}
        type={ctx.mask ? 'password' : 'text'}
        inputMode={ctx.type === 'numeric' ? 'numeric' : 'text'}
        autoComplete="one-time-code"
        maxLength={2}
        disabled={ctx.disabled}
        aria-invalid={ctx.isInvalid || undefined}
        aria-label={props['aria-label'] ?? `Pin digit ${index + 1} of ${ctx.length}`}
        placeholder={ctx.placeholder}
        value={char}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={cn(
          styles.field,
          styles[ctx.size],
          styles[ctx.variant],
          char && styles.filledField,
          ctx.isInvalid && styles.invalid,
          className
        )}
        {...props}
      />
    );
  }
);
PinInputField.displayName = 'PinInputField';

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      length = 4,
      type = 'numeric',
      size = 'md',
      variant = 'outline',
      mask = false,
      placeholder = '○',
      disabled = false,
      isInvalid = false,
      autoFocus = false,
      onChange,
      onComplete,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const toArray = (str: string) =>
      Array.from({ length }, (_, idx) => str[idx] ?? '');

    const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(() =>
      toArray(defaultValue)
    );
    const values = isControlled ? toArray(controlledValue) : uncontrolledValues;
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const isValidChar = (ch: string) => {
      if (!ch) return true;
      return type === 'numeric' ? /^\d$/.test(ch) : /^[a-zA-Z0-9]$/.test(ch);
    };

    const focusField = (idx: number) => {
      const target = inputRefs.current[idx];
      if (target && !disabled) {
        target.focus();
      }
    };

    const registerInput = (idx: number, el: HTMLInputElement | null) => {
      inputRefs.current[idx] = el;
    };

    const updateValues = (nextValues: string[]) => {
      if (!isControlled) {
        setUncontrolledValues(nextValues);
      }
      const joined = nextValues.join('');
      onChange?.(joined);
      if (nextValues.every((v) => v.length === 1) && nextValues.length === length) {
        onComplete?.(joined);
      }
    };

    const setCharAt = (index: number, char: string) => {
      if (char && !isValidChar(char)) return;
      const next = [...values];
      next[index] = char;
      updateValues(next);
      if (char && index < length - 1) {
        focusField(index + 1);
      }
    };

    const handlePasteAt = (startIndex: number, text: string) => {
      const cleanChars = text
        .split('')
        .filter((ch) => isValidChar(ch) && ch.trim() !== '');
      if (cleanChars.length === 0) return;

      const next = [...values];
      let cursor = startIndex;
      for (const ch of cleanChars) {
        if (cursor >= length) break;
        next[cursor] = ch;
        cursor++;
      }
      updateValues(next);
      focusField(Math.min(cursor, length - 1));
    };

    const contextValue: PinInputContextValue = {
      values,
      length,
      type,
      size,
      variant,
      mask,
      disabled,
      isInvalid,
      placeholder,
      setCharAt,
      handlePasteAt,
      focusField,
      registerInput,
    };

    return (
      <PinInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          aria-label={props['aria-label'] ?? 'PIN verification input'}
          className={cn(styles.container, className)}
          {...props}
        >
          {children ??
            Array.from({ length }, (_, idx) => (
              <PinInputField key={idx} index={idx} autoFocus={autoFocus && idx === 0} />
            ))}
        </div>
      </PinInputContext.Provider>
    );
  }
);
PinInput.displayName = 'PinInput';
