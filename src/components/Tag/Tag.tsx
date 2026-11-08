import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Tag.module.css';

export type TagVariant = 'soft' | 'solid' | 'outline';
export type TagColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type TagSize = 'sm' | 'md' | 'lg';
export type TagShape = 'rounded' | 'pill';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  color?: TagColor;
  size?: TagSize;
  shape?: TagShape;
  isClosable?: boolean;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSelected?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

export const TagLabel = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn(styles.label, className)} {...props}>
      {children}
    </span>
  )
);
TagLabel.displayName = 'TagLabel';

export const TagCloseButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={props['aria-label'] ?? 'Remove tag'}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    className={cn(styles.closeButton, className)}
    {...props}
  >
    {children ?? (
      <svg
        width="10"
        height="10"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="3" y1="3" x2="9" y2="9" />
        <line x1="9" y1="3" x2="3" y2="9" />
      </svg>
    )}
  </button>
));
TagCloseButton.displayName = 'TagCloseButton';

export const TagGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(styles.group, className)} {...props}>
      {children}
    </div>
  )
);
TagGroup.displayName = 'TagGroup';

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = 'soft',
      color = 'primary',
      size = 'md',
      shape = 'rounded',
      isClosable = false,
      onRemove,
      isSelected,
      disabled = false,
      leftIcon,
      onClick,
      onKeyDown,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isInteractive = Boolean(onClick) || isSelected !== undefined;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (isInteractive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
      }
      onKeyDown?.(e);
    };

    return (
      <span
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        aria-pressed={isSelected}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          styles.tag,
          styles[variant],
          styles[color],
          styles[size],
          styles[shape],
          isInteractive && styles.interactive,
          isSelected && styles.selected,
          disabled && styles.disabled,
          className
        )}
        {...props}
      >
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <TagLabel>{children}</TagLabel>
        {(isClosable || onRemove) && (
          <TagCloseButton disabled={disabled} onClick={onRemove} />
        )}
      </span>
    );
  }
);
Tag.displayName = 'Tag';

export const Chip = Tag;
export type ChipProps = TagProps;
