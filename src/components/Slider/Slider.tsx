import React, { forwardRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../utils/cn';
import styles from './Slider.module.css';

export type SliderSize = 'sm' | 'md' | 'lg';
export type SliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  size?: SliderSize;
  color?: SliderColor;
}

export interface SliderTrackProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track> {}

export interface SliderRangeProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range> {}

export interface SliderThumbProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb> {}

export const SliderTrack = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Track>,
  SliderTrackProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    className={cn(styles.track, className)}
    {...props}
  />
));
SliderTrack.displayName = 'SliderTrack';

export const SliderRange = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Range>,
  SliderRangeProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Range
    ref={ref}
    className={cn(styles.range, className)}
    {...props}
  />
));
SliderRange.displayName = 'SliderRange';

export const SliderThumb = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Thumb>,
  SliderThumbProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(styles.thumb, className)}
    {...props}
  />
));
SliderThumb.displayName = 'SliderThumb';

export const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      children,
      size = 'md',
      color = 'primary',
      orientation = 'horizontal',
      value,
      defaultValue = [0],
      ...props
    },
    ref
  ) => {
    const thumbCount = (value ?? defaultValue ?? [0]).length;

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        orientation={orientation}
        className={cn(
          styles.slider,
          styles[`size-${size}`],
          styles[`color-${color}`],
          styles[`orientation-${orientation}`],
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            {Array.from({ length: thumbCount }).map((_, index) => (
              <SliderThumb key={index} aria-label={props['aria-label']} />
            ))}
          </>
        )}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = 'Slider';
