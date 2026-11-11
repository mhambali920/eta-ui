import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './Pagination';

interface PaginationStoryProps {
  size: 'sm' | 'md' | 'lg';
  activeVariant: 'soft' | 'solid';
  variant: 'ghost' | 'outline';
}

const meta: Meta<PaginationStoryProps> = {
  title: 'Navigation/Pagination',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    activeVariant: {
      control: 'select',
      options: ['soft', 'solid'],
    },
    variant: {
      control: 'select',
      options: ['ghost', 'outline'],
    },
  },
};

export default meta;

type Story = StoryObj<PaginationStoryProps>;

export const Default: Story = {
  args: {
    size: 'md',
    activeVariant: 'soft',
    variant: 'ghost',
  },
  render: (args) => (
    <Pagination size={args.size}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious size={args.size} variant={args.variant} href="#prev" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            href="#1"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            isActive
            href="#2"
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            href="#3"
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis size={args.size} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            href="#10"
          >
            10
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext size={args.size} variant={args.variant} href="#next" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const SolidActive: Story = {
  args: {
    size: 'md',
    activeVariant: 'solid',
    variant: 'ghost',
  },
  render: (args) => (
    <Pagination size={args.size}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious size={args.size} variant={args.variant} href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink size={args.size} activeVariant={args.activeVariant} isActive href="#">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink size={args.size} activeVariant={args.activeVariant} href="#">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink size={args.size} activeVariant={args.activeVariant} href="#">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext size={args.size} variant={args.variant} href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const OutlineStyle: Story = {
  args: {
    size: 'md',
    activeVariant: 'soft',
    variant: 'outline',
  },
  render: (args) => (
    <Pagination size={args.size}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious size={args.size} variant={args.variant} disabled href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            isActive
            href="#"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            href="#"
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            size={args.size}
            variant={args.variant}
            activeVariant={args.activeVariant}
            href="#"
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext size={args.size} variant={args.variant} href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const Interactive: Story = {
  args: {
    size: 'md',
    activeVariant: 'soft',
    variant: 'ghost',
  },
  render: (args) => {
    const InteractiveDemo = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const totalPages = 5;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--eta-text-muted)' }}>
            Viewing page {currentPage} of {totalPages}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size={args.size}
                  variant={args.variant}
                  disabled={currentPage <= 1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  href="#"
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    size={args.size}
                    variant={args.variant}
                    activeVariant={args.activeVariant}
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  size={args.size}
                  variant={args.variant}
                  disabled={currentPage >= totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      );
    };

    return <InteractiveDemo />;
  },
};
