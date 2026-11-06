import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonCircle, SkeletonText } from './Skeleton';

describe('Skeleton component', () => {
  it('renders with aria-busy="true" by default', () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Skeleton variant="circular" data-testid="skeleton" />);
    let el = screen.getByTestId('skeleton');
    expect(el.className).toContain('variant-circular');

    rerender(<Skeleton variant="text" data-testid="skeleton" />);
    el = screen.getByTestId('skeleton');
    expect(el.className).toContain('variant-text');

    rerender(<Skeleton variant="rectangular" data-testid="skeleton" />);
    el = screen.getByTestId('skeleton');
    expect(el.className).toContain('variant-rectangular');
  });

  it('renders animations (shimmer, pulse, none)', () => {
    const { rerender } = render(<Skeleton animation="shimmer" data-testid="skeleton" />);
    let el = screen.getByTestId('skeleton');
    expect(el.className).toContain('animation-shimmer');

    rerender(<Skeleton animation="pulse" data-testid="skeleton" />);
    el = screen.getByTestId('skeleton');
    expect(el.className).toContain('animation-pulse');

    rerender(<Skeleton animation="none" data-testid="skeleton" />);
    el = screen.getByTestId('skeleton');
    expect(el.className).toContain('animation-none');
  });

  it('applies width and height props', () => {
    render(<Skeleton width={200} height={50} data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('50px');
  });

  it('renders children when isLoaded is true', () => {
    render(
      <Skeleton isLoaded data-testid="skeleton">
        <span>Loaded content</span>
      </Skeleton>
    );
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });

  it('renders SkeletonCircle helper with circular variant', () => {
    render(<SkeletonCircle size={48} data-testid="circle" />);
    const el = screen.getByTestId('circle');
    expect(el.className).toContain('variant-circular');
    expect(el.style.width).toBe('48px');
    expect(el.style.height).toBe('48px');
  });

  it('renders SkeletonText with multiple lines', () => {
    render(<SkeletonText lines={4} data-testid="text-group" />);
    const group = screen.getByTestId('text-group');
    expect(group.children.length).toBe(4);
    // Last line has truncated width
    expect((group.children[3] as HTMLElement).style.width).toBe('70%');
  });

  it('renders SkeletonText children when isLoaded is true', () => {
    render(
      <SkeletonText isLoaded>
        <p>Paragraph content</p>
      </SkeletonText>
    );
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
  });
});
