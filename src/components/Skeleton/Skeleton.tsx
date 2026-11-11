import { forwardRef } from 'react';
import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  isLoaded?: boolean;
  children?: ReactNode;
}

export type SkeletonCircleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SKELETON_CIRCLE_SIZE_MAP: Record<SkeletonCircleSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

export interface SkeletonCircleProps extends Omit<SkeletonProps, 'variant'> {
  size?: SkeletonCircleSize | (string & {}) | number;
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  gap?: string | number;
  lastLineWidth?: string;
  animation?: SkeletonAnimation;
  isLoaded?: boolean;
  children?: ReactNode;
}

const formatDimension = (val?: string | number): string | undefined => {
  if (val === undefined) return undefined;
  return typeof val === 'number' ? `${val}px` : val;
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'rounded',
      animation = 'shimmer',
      width,
      height,
      radius,
      isLoaded = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    if (isLoaded) {
      return <>{children}</>;
    }

    const customStyle: CSSProperties = {
      ...style,
      width: formatDimension(width) ?? style?.width,
      height: formatDimension(height) ?? style?.height,
      borderRadius: formatDimension(radius) ?? style?.borderRadius,
    };

    return (
      <div
        ref={ref}
        aria-busy="true"
        aria-live="polite"
        className={cn(
          styles.skeleton,
          styles[`variant-${variant}`],
          styles[`animation-${animation}`],
          className
        )}
        style={customStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  ({ size = 40, width, height, ...props }, ref) => {
    const resolvedSize =
      typeof size === 'string' && size in SKELETON_CIRCLE_SIZE_MAP
        ? SKELETON_CIRCLE_SIZE_MAP[size as SkeletonCircleSize]
        : size;
    const dim = resolvedSize ?? width ?? height;
    return (
      <Skeleton
        ref={ref}
        variant="circular"
        width={dim}
        height={dim}
        {...props}
      />
    );
  }
);
SkeletonCircle.displayName = 'SkeletonCircle';

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      lines = 3,
      gap = 8,
      lastLineWidth = '70%',
      animation = 'shimmer',
      isLoaded = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    if (isLoaded) {
      return <>{children}</>;
    }

    const items = Array.from({ length: Math.max(1, lines) });

    return (
      <div
        ref={ref}
        aria-busy="true"
        aria-live="polite"
        className={cn(styles.textGroup, className)}
        style={{
          ...style,
          gap: formatDimension(gap),
        }}
        {...props}
      >
        {items.map((_, index) => {
          const isLast = index === items.length - 1;
          return (
            <Skeleton
              key={index}
              variant="text"
              animation={animation}
              width={isLast && items.length > 1 ? lastLineWidth : '100%'}
            />
          );
        })}
      </div>
    );
  }
);
SkeletonText.displayName = 'SkeletonText';
