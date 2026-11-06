import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmpty,
} from './Table';

describe('Table component', () => {
  it('renders standard table structure with data', () => {
    render(
      <Table>
        <TableCaption>Active team members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>Developer</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: 1 member</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Active team members')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByText('Total: 1 member')).toBeInTheDocument();
  });

  it('renders variants and size classes correctly', () => {
    const { rerender } = render(
      <Table variant="striped" size="sm" bordered data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByTestId('table');
    expect(table.className).toContain('striped');
    expect(table.className).toContain('size-sm');
    expect(table.className).toContain('bordered');

    rerender(
      <Table variant="hoverable" size="lg" data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(table.className).toContain('hoverable');
    expect(table.className).toContain('size-lg');

    rerender(
      <Table hoverable striped data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(table.className).toContain('hoverable');
    expect(table.className).toContain('striped');
  });

  it('handles sortable column header click and updates aria-sort', async () => {
    const user = userEvent.setup();
    const handleSort = vi.fn();

    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSort={handleSort}>
              Username
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const head = screen.getByRole('columnheader', { name: /username/i });
    expect(head).toHaveAttribute('aria-sort', 'ascending');

    await user.click(head);
    expect(handleSort).toHaveBeenCalledTimes(1);

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc" onSort={handleSort}>
              Username
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(head).toHaveAttribute('aria-sort', 'descending');
  });

  it('renders TableEmpty state with empty icon, title, and description', () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty
            colSpan={3}
            title="No Users Available"
            description="Create a new user to populate this list."
          />
        </TableBody>
      </Table>
    );

    expect(screen.getByText('No Users Available')).toBeInTheDocument();
    expect(screen.getByText('Create a new user to populate this list.')).toBeInTheDocument();
  });
});
