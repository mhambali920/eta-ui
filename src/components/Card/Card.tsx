import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Card.module.css';

export type CardVariant = 'elevated' | 'outline' | 'filled';
export type CardElevation = 'sm' | 'md' | 'lg';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  elevation?: CardElevation;
  padding?: CardPadding;
  isInteractive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      elevation = 'sm',
      padding = 'md',
      isInteractive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[variant],
          variant === 'elevated' && styles[`elevation-${elevation}`],
          styles[`padding-${padding}`],
          isInteractive && styles.interactive,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* Card Header */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/* Card Title */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', className, children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/* Card Description */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

/* Card Body */
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.body, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/* Card Footer */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
