import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './Pagination';

describe('Pagination component', () => {
  it('renders semantic pagination navigation with accessible structure', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#prev" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toBeInTheDocument();

    const activeLink = screen.getByRole('link', { name: '1' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink.className).toContain('active-soft');

    const nextLink = screen.getByRole('link', { name: /go to next page/i });
    expect(nextLink).toBeInTheDocument();

    expect(screen.getByText('More pages')).toBeInTheDocument();
  });

  it('handles active variants and sizes correctly', () => {
    const { rerender } = render(
      <PaginationLink href="#1" isActive activeVariant="solid" size="lg" data-testid="link">
        1
      </PaginationLink>
    );

    const link = screen.getByTestId('link');
    expect(link.className).toContain('active-solid');
    expect(link.className).toContain('size-lg');

    rerender(
      <PaginationLink href="#2" size="sm" variant="outline" data-testid="link">
        2
      </PaginationLink>
    );

    expect(link.className).toContain('size-sm');
    expect(link.className).toContain('variant-outline');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('renders disabled previous/next controls with aria-disabled', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled href="#" data-testid="prev" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const prev = screen.getByTestId('prev');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev.className).toContain('disabled');
  });

  it('supports asChild with custom button or element', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <PaginationLink asChild>
        <button onClick={handleClick}>Page 5</button>
      </PaginationLink>
    );

    const btn = screen.getByRole('button', { name: 'Page 5' });
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
