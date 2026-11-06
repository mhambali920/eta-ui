import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonCircle, SkeletonText } from './Skeleton';
import { Card, CardHeader, CardBody } from '../Card';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rounded', 'text', 'circular', 'rectangular'],
    },
    animation: {
      control: 'select',
      options: ['shimmer', 'pulse', 'none'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '100%',
    height: 40,
    variant: 'rounded',
    animation: 'shimmer',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>Text</small>
        <Skeleton variant="text" />
      </div>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>Circular</small>
        <SkeletonCircle size={48} />
      </div>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>Rounded (Default)</small>
        <Skeleton variant="rounded" height={60} />
      </div>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>Rectangular</small>
        <Skeleton variant="rectangular" height={60} />
      </div>
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>Shimmer (Soft Wave)</small>
        <Skeleton height={36} animation="shimmer" />
      </div>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>Pulse (Fade Wave)</small>
        <Skeleton height={36} animation="pulse" />
      </div>
      <div>
        <small style={{ color: 'var(--eta-text-muted)' }}>None (Static)</small>
        <Skeleton height={36} animation="none" />
      </div>
    </div>
  ),
};

export const ComplexCardPlaceholder: Story = {
  render: () => (
    <Card style={{ maxWidth: 340 }}>
      <CardHeader style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <SkeletonCircle size={44} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </CardHeader>
      <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton height={140} variant="rounded" />
        <SkeletonText lines={3} />
      </CardBody>
    </Card>
  ),
};
