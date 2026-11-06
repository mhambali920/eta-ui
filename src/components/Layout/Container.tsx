import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Layout.module.css';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: ContainerSize;
  isPadded?: boolean;
  centerContent?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      as: Component = 'div',
      size = 'xl',
      isPadded = true,
      centerContent = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          styles.container,
          styles[`size-${size}`],
          isPadded && styles.padded,
          centerContent && styles.centerContent,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
