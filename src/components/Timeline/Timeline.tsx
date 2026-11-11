import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Timeline.module.css';

export type TimelineColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type TimelinePointVariant = 'soft' | 'solid' | 'outline';
export type TimelineLayout = 'left' | 'alternate';
export type TimelineSize = 'sm' | 'md' | 'lg';

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  layout?: TimelineLayout;
  size?: TimelineSize;
}

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ layout = 'left', size = 'md', className, children, ...props }, ref) => (
    <ol
      ref={ref}
      aria-label={props['aria-label'] ?? 'Timeline'}
      data-layout={layout}
      className={cn(styles.timeline, styles[size], layout === 'alternate' && styles.alternate, className)}
      {...props}
    >
      {children}
    </ol>
  )
);
Timeline.displayName = 'Timeline';

export interface TimelinePointProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: TimelineColor;
  variant?: TimelinePointVariant;
  icon?: React.ReactNode;
}

export const TimelinePoint = forwardRef<HTMLSpanElement, TimelinePointProps>(
  ({ color = 'primary', variant = 'soft', icon, className, children, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(styles.point, styles[variant], styles[color], className)}
      {...props}
    >
      {icon ?? children ?? <span className={styles.dotInner} />}
    </span>
  )
);
TimelinePoint.displayName = 'TimelinePoint';

export const TimelineConnector = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn(styles.connector, className)} {...props} />
  )
);
TimelineConnector.displayName = 'TimelineConnector';

export const TimelineContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.content, className)} {...props}>
      {children}
    </div>
  )
);
TimelineContent.displayName = 'TimelineContent';

export const TimelineTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h4 ref={ref} className={cn(styles.title, className)} {...props}>
    {children}
  </h4>
));
TimelineTitle.displayName = 'TimelineTitle';

export const TimelineTime = forwardRef<HTMLTimeElement, React.TimeHTMLAttributes<HTMLTimeElement>>(
  ({ className, children, ...props }, ref) => (
    <time ref={ref} className={cn(styles.time, className)} {...props}>
      {children}
    </time>
  )
);
TimelineTime.displayName = 'TimelineTime';

export const TimelineDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props}>
    {children}
  </p>
));
TimelineDescription.displayName = 'TimelineDescription';

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title?: React.ReactNode;
  time?: React.ReactNode;
  description?: React.ReactNode;
  color?: TimelineColor;
  pointVariant?: TimelinePointVariant;
  icon?: React.ReactNode;
  hideConnector?: boolean;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      title,
      time,
      description,
      color = 'primary',
      pointVariant = 'soft',
      icon,
      hideConnector = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasShorthand = Boolean(title || time || description);

    return (
      <li ref={ref} className={cn(styles.item, className)} {...props}>
        {hasShorthand ? (
          <>
            <div className={styles.axis}>
              <TimelinePoint color={color} variant={pointVariant} icon={icon} />
              {!hideConnector && <TimelineConnector />}
            </div>
            <TimelineContent>
              {(title || time) && (
                <div className={styles.headerRow}>
                  {title && <TimelineTitle>{title}</TimelineTitle>}
                  {time && <TimelineTime>{time}</TimelineTime>}
                </div>
              )}
              {description && <TimelineDescription>{description}</TimelineDescription>}
              {children}
            </TimelineContent>
          </>
        ) : (
          children
        )}
      </li>
    );
  }
);
TimelineItem.displayName = 'TimelineItem';
