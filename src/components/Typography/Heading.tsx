import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Typography.module.css';

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type HeadingColor = 'default' | 'primary' | 'secondary' | 'muted' | 'inverse';
export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type HeadingAlign = 'left' | 'center' | 'right';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  size?: HeadingSize;
  color?: HeadingColor;
  weight?: HeadingWeight;
  align?: HeadingAlign;
}

const defaultSizeMap: Record<HeadingTag, HeadingSize> = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = 'h2',
      size,
      color = 'default',
      weight = 'bold',
      align = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const computedSize = size || defaultSizeMap[Component];

    return (
      <Component
        ref={ref}
        className={cn(
          styles.heading,
          styles[`heading-${computedSize}`],
          styles[`weight-${weight}`],
          styles[`align-${align}`],
          color !== 'default' && styles[`color-${color}`],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';
