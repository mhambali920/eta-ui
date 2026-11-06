import React, { forwardRef } from 'react';
import { useTheme, type Theme } from '../../theme';
import { cn } from '../../utils/cn';
import styles from './ThemeToggle.module.css';

export type ThemeToggleVariant = 'icon' | 'segmented';
export type ThemeToggleSize = 'sm' | 'md' | 'lg';

export interface ThemeToggleProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  variant?: ThemeToggleVariant;
  size?: ThemeToggleSize;
  showSystem?: boolean;
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      variant = 'icon',
      size = 'md',
      showSystem = true,
      className,
      ...props
    },
    ref
  ) => {
    const { theme, resolvedTheme, setTheme } = useTheme();

    if (variant === 'segmented') {
      const options: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
        { value: 'light', label: 'Light', icon: <SunIcon /> },
        { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
      ];

      if (showSystem) {
        options.push({ value: 'system', label: 'System', icon: <MonitorIcon /> });
      }

      return (
        <div
          role="radiogroup"
          aria-label="Theme selection"
          className={cn(styles.segmented, styles[size], className)}
          {...props}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={theme === opt.value}
              className={cn(
                styles.segmentItem,
                theme === opt.value && styles.active
              )}
              onClick={() => setTheme(opt.value)}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      );
    }

    const handleCycleTheme = () => {
      if (showSystem) {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
      } else {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
      }
    };

    const renderIcon = () => {
      if (theme === 'system') {
        return <MonitorIcon />;
      }
      return resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={`Current theme: ${theme}. Click to switch theme.`}
        className={cn(styles.iconButton, styles[size], className)}
        onClick={handleCycleTheme}
        {...props}
      >
        <span className={styles.iconWrapper} key={theme}>
          {renderIcon()}
        </span>
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';
