import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Code.module.css';

export type KbdSize = 'sm' | 'md' | 'lg';
export type CodeVariant = 'soft' | 'outline' | 'solid';
export type CodeColor = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: KbdSize;
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ size = 'md', className, children, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        styles.kbd,
        size === 'sm' && styles.kbdSm,
        size === 'lg' && styles.kbdLg,
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
);
Kbd.displayName = 'Kbd';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CodeVariant;
  color?: CodeColor;
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ variant = 'soft', color = 'neutral', className, children, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(styles.code, styles[variant], styles[color], className)}
      {...props}
    >
      {children}
    </code>
  )
);
Code.displayName = 'Code';

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  code: string;
  filename?: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  onCopy?: (code: string) => void;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      filename,
      language,
      showLineNumbers = false,
      copyable = true,
      onCopy,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = () => {
      try {
        void navigator.clipboard?.writeText?.(code)?.catch(() => {});
      } catch {
        // Fallback or no-op in non-secure test contexts
      }
      setCopied(true);
      onCopy?.(code);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    };

    const lines = code.split('\n');

    return (
      <div ref={ref} className={cn(styles.codeBlock, className)} {...props}>
        {(filename || language || copyable) && (
          <div className={styles.blockHeader}>
            <div className={styles.titleGroup}>
              {filename && <span className={styles.filename}>{filename}</span>}
              {language && <span className={styles.language}>{language}</span>}
            </div>
            {copyable && (
              <button
                type="button"
                aria-label={copied ? 'Copied code' : 'Copy code'}
                onClick={handleCopy}
                className={styles.copyButton}
              >
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        )}
        <pre className={styles.pre}>
          <code>
            {showLineNumbers
              ? lines.map((line, i) => (
                  <div key={i} className={styles.lineRow}>
                    <span className={styles.lineNumber} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className={styles.lineContent}>{line}</span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    );
  }
);
CodeBlock.displayName = 'CodeBlock';
