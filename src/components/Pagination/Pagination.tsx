import React, { createContext, forwardRef, useContext } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn';
import styles from './Pagination.module.css';

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationVariant = 'ghost' | 'outline';
export type PaginationActiveVariant = 'soft' | 'solid';

const PaginationContext = createContext<{ size: PaginationSize }>({ size: 'md' });

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  size?: PaginationSize;
}

export interface PaginationContentProps extends React.ComponentPropsWithoutRef<'ul'> {}

export interface PaginationItemProps extends React.ComponentPropsWithoutRef<'li'> {}

export interface PaginationLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  isActive?: boolean;
  activeVariant?: PaginationActiveVariant;
  variant?: PaginationVariant;
  size?: PaginationSize;
  disabled?: boolean;
  asChild?: boolean;
}

export interface PaginationPreviousProps extends PaginationLinkProps {
  label?: string;
}

export interface PaginationNextProps extends PaginationLinkProps {
  label?: string;
}

export interface PaginationEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {
  size?: PaginationSize;
}

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MoreHorizontalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <PaginationContext.Provider value={{ size }}>
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn(styles.nav, className)}
        {...props}
      />
    </PaginationContext.Provider>
  )
);
Pagination.displayName = 'Pagination';

export const PaginationContent = forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} role="list" className={cn(styles.list, className)} {...props} />
  )
);
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(styles.item, className)} {...props} />
  )
);
PaginationItem.displayName = 'PaginationItem';

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  (
    {
      className,
      isActive = false,
      activeVariant = 'soft',
      variant = 'ghost',
      size: sizeProp,
      disabled = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const ctx = useContext(PaginationContext);
    const size = sizeProp ?? ctx.size;
    const Component = asChild ? Slot : 'a';

    return (
      <Component
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          styles.link,
          styles[`size-${size}`],
          isActive ? styles[`active-${activeVariant}`] : styles[`variant-${variant}`],
          disabled && styles.disabled,
          className
        )}
        {...props}
      />
    );
  }
);
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  (
    {
      className,
      label = 'Previous',
      size,
      variant = 'ghost',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size={size}
      variant={variant}
      disabled={disabled}
      className={cn(styles.prevNext, className)}
      {...props}
    >
      <span className={styles.icon}>
        <ChevronLeftIcon />
      </span>
      {children || <span>{label}</span>}
    </PaginationLink>
  )
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationNextProps>(
  (
    {
      className,
      label = 'Next',
      size,
      variant = 'ghost',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size={size}
      variant={variant}
      disabled={disabled}
      className={cn(styles.prevNext, className)}
      {...props}
    >
      {children || <span>{label}</span>}
      <span className={styles.icon}>
        <ChevronRightIcon />
      </span>
    </PaginationLink>
  )
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, size: sizeProp, ...props }, ref) => {
    const ctx = useContext(PaginationContext);
    const size = sizeProp ?? ctx.size;
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(styles.ellipsis, styles[`size-${size}`], className)}
        {...props}
      >
        <span className={styles.icon}>
          <MoreHorizontalIcon />
        </span>
        <span className={styles.srOnly}>More pages</span>
      </span>
    );
  }
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
