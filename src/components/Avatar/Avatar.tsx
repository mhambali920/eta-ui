import React, { forwardRef } from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded';
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixAvatar.Root>, 'children'> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: React.ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  delayMs?: number;
  containerClassName?: string;
}

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      fallback,
      size = 'md',
      shape = 'circle',
      status,
      delayMs,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const initials = name ? getInitials(name) : '';
    const fallbackContent = fallback || initials || '?';

    return (
      <div
        className={cn(
          styles.container,
          styles[size],
          styles[shape],
          containerClassName
        )}
      >
        <RadixAvatar.Root
          ref={ref}
          className={cn(
            styles.root,
            styles[size],
            styles[shape],
            className
          )}
          {...props}
        >
          {src && (
            <RadixAvatar.Image
              src={src}
              alt={alt || name}
              className={styles.image}
            />
          )}
          <RadixAvatar.Fallback
            className={styles.fallback}
            delayMs={delayMs}
          >
            {fallbackContent}
          </RadixAvatar.Fallback>
        </RadixAvatar.Root>

        {status && (
          <span
            className={cn(styles.status, styles[status])}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  children: React.ReactNode;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size, children, className, ...props }, ref) => {
    const avatarArray = React.Children.toArray(children);
    const firstChildSize =
      React.isValidElement<{ size?: AvatarSize }>(avatarArray[0])
        ? avatarArray[0].props.size
        : undefined;
    const resolvedSize: AvatarSize = size ?? firstChildSize ?? 'md';
    const visibleAvatars = (max ? avatarArray.slice(0, max) : avatarArray).map((child) => {
      if (React.isValidElement<{ size?: AvatarSize }>(child) && size && !child.props.size) {
        return React.cloneElement(child, { size });
      }
      return child;
    });
    const remainingCount = max ? avatarArray.length - max : 0;

    return (
      <div ref={ref} className={cn(styles.group, className)} {...props}>
        {visibleAvatars}
        {remainingCount > 0 && (
          <Avatar
            size={resolvedSize}
            fallback={`+${remainingCount}`}
            className={styles.moreFallback}
          />
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
