import React, { forwardRef } from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cn } from '../../utils/cn';
import styles from './AspectRatio.module.css';

export interface AspectRatioProps
  extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  ratio?: number;
}

export const AspectRatio = forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ ratio = 16 / 9, className, children, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    ratio={ratio}
    className={cn(styles.root, className)}
    {...props}
  >
    {children}
  </AspectRatioPrimitive.Root>
));

AspectRatio.displayName = 'AspectRatio';
