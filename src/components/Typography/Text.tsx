import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Typography.module.css';

export type TextTag = 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextVariant = 'body' | 'muted' | 'lead' | 'caption';
export type TextColor =
  | 'default'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'inverse';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextTag;
  size?: TextSize;
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = 'p',
      size = 'md',
      variant = 'body',
      color = 'default',
      weight = 'normal',
      align = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          styles.text,
          styles[`text-${size}`],
          styles[`variant-${variant}`],
          styles[`weight-${weight}`],
          styles[`align-${align}`],
          color !== 'default' && styles[`color-${color}`],
          className
        ),
        ...props,
      },
      children
    );
  }
);

Text.displayName = 'Text';
