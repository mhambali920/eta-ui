import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn';
import styles from './Breadcrumb.module.css';

export type BreadcrumbSize = 'sm' | 'md' | 'lg';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
  size?: BreadcrumbSize;
}

export interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<'ol'> {}

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<'li'> {}

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
}

export interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<'span'> {}

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<'li'> {}

export interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {}

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

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(styles.nav, styles[`size-${size}`], className)}
      {...props}
    />
  )
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(styles.list, className)}
      {...props}
    />
  )
);
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(styles.item, className)}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(styles.link, className)}
        {...props}
      />
    );
  }
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(styles.page, className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(styles.separator, className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export const BreadcrumbEllipsis = ({
  className,
  ...props
}: BreadcrumbEllipsisProps) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(styles.ellipsis, className)}
    {...props}
  >
    <MoreHorizontalIcon />
    <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
      More
    </span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
