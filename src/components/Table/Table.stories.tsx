import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
import { Badge } from '../Badge';

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'hoverable'],
      description: 'Preconfigured table styling variant',
    },
    hoverable: {
      control: 'boolean',
      description: 'Highlight rows on mouse hover with soft sage tint',
    },
    striped: {
      control: 'boolean',
      description: 'Zebra striping on alternating rows',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    bordered: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

const sampleData = [
  { id: '1', name: 'Zahra Patel', role: 'Product Lead', email: 'zahra@example.com', status: 'active' },
  { id: '2', name: 'Marcus Chen', role: 'Staff Engineer', email: 'marcus@example.com', status: 'active' },
  { id: '3', name: 'Elena Rostova', role: 'UX Designer', email: 'elena@example.com', status: 'away' },
  { id: '4', name: 'Devon Vance', role: 'QA Analyst', email: 'devon@example.com', status: 'offline' },
];

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    bordered: false,
    hoverable: true,
    striped: false,
  },
  render: (args) => (
    <Table {...args}>
      <TableCaption>Team roster and current status</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead align="center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((row) => (
          <TableRow key={row.id}>
            <TableCell style={{ fontWeight: 500 }}>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell align="center">
              <Badge
                variant="soft"
                color={
                  row.status === 'active'
                    ? 'success'
                    : row.status === 'away'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Members</TableCell>
          <TableCell align="center">4</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Striped: Story = {
  args: {
    variant: 'striped',
    size: 'md',
    bordered: true,
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Client</TableHead>
          <TableHead align="right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Design System</TableCell>
          <TableCell>Acme Corp</TableCell>
          <TableCell align="right">$12,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mobile App Redesign</TableCell>
          <TableCell>Starlight Inc</TableCell>
          <TableCell align="right">$24,500</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cloud Migration</TableCell>
          <TableCell>Vertex Labs</TableCell>
          <TableCell align="right">$18,750</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const SortableInteractive: Story = {
  args: {
    variant: 'hoverable',
    size: 'md',
  },
  render: (args) => {
    const SortableDemo = () => {
      const [sortCol, setSortCol] = useState<'name' | 'role'>('name');
      const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

      const handleSort = (column: 'name' | 'role') => {
        if (sortCol === column) {
          setDirection(direction === 'asc' ? 'desc' : 'asc');
        } else {
          setSortCol(column);
          setDirection('asc');
        }
      };

      const sortedData = [...sampleData].sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });

      return (
        <Table {...args}>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection={sortCol === 'name' ? direction : null}
                onSort={() => handleSort('name')}
              >
                Name
              </TableHead>
              <TableHead
                sortable
                sortDirection={sortCol === 'role' ? direction : null}
                onSort={() => handleSort('role')}
              >
                Role
              </TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };

    return <SortableDemo />;
  },
};

export const EmptyState: Story = {
  args: {
    variant: 'default',
    size: 'md',
    bordered: true,
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Document Name</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty
          colSpan={3}
          title="No documents uploaded"
          description="Drag and drop files or click upload to get started."
        />
      </TableBody>
    </Table>
  ),
};
