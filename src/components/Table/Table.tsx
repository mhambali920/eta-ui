import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Table.module.css';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'hoverable';
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  containerClassName?: string;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export interface TableEmptyProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'title'> {
  colSpan: number;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const SortNeutralIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 15l5 5 5-5" />
    <path d="M7 9l5-5 5 5" />
  </svg>
);

const SortAscIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 9l5-5 5 5" />
  </svg>
);

const SortDescIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 15l5 5 5-5" />
  </svg>
);

const EmptyFolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      variant = 'default',
      size = 'md',
      bordered = false,
      striped = false,
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const isStriped = striped || variant === 'striped';
    const isHoverable = hoverable || variant === 'hoverable';

    return (
      <div className={cn(styles.container, containerClassName)}>
        <table
          ref={ref}
          className={cn(
            styles.table,
            styles[`size-${size}`],
            isStriped && styles.striped,
            isHoverable && styles.hoverable,
            bordered && styles.bordered,
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn(styles.header, className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(styles.body, className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn(styles.footer, className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn(styles.row, className)} {...props} />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortable = false,
      sortDirection = null,
      onSort,
      align = 'left',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
      onClick?.(e);
      if (sortable && onSort) {
        onSort();
      }
    };

    const renderSortIcon = () => {
      if (!sortable) return null;
      if (sortDirection === 'asc') {
        return (
          <span className={cn(styles.sortIcon, styles.active)}>
            <SortAscIcon />
          </span>
        );
      }
      if (sortDirection === 'desc') {
        return (
          <span className={cn(styles.sortIcon, styles.active)}>
            <SortDescIcon />
          </span>
        );
      }
      return (
        <span className={styles.sortIcon}>
          <SortNeutralIcon />
        </span>
      );
    };

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
            ? 'descending'
            : undefined
        }
        className={cn(
          styles.head,
          styles[`align-${align}`],
          sortable && styles.sortable,
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {sortable ? (
          <span className={styles.sortContent}>
            {children}
            {renderSortIcon()}
          </span>
        ) : (
          children
        )}
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <td
      ref={ref}
      className={cn(styles.cell, styles[`align-${align}`], className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn(styles.caption, className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  (
    {
      className,
      colSpan,
      icon = <EmptyFolderIcon />,
      title = 'No records found',
      description = 'There are no items to display matching your criteria.',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TableRow>
        <td
          ref={ref}
          colSpan={colSpan}
          className={cn(styles.emptyCell, className)}
          {...props}
        >
          {children || (
            <div className={styles.emptyContent}>
              {icon && <div className={styles.emptyIcon}>{icon}</div>}
              {title && <div className={styles.emptyTitle}>{title}</div>}
              {description && (
                <div className={styles.emptyDescription}>{description}</div>
              )}
            </div>
          )}
        </td>
      </TableRow>
    );
  }
);
TableEmpty.displayName = 'TableEmpty';
