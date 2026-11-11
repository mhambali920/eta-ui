import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    thickness: {
      control: 'text',
    },
    speed: {
      control: 'text',
    },
    emptyColor: {
      control: 'color',
    },
    label: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
    label: 'Loading...',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <Spinner size="xs" color="primary" />
      <Spinner size="sm" color="primary" />
      <Spinner size="md" color="primary" />
      <Spinner size="lg" color="primary" />
      <Spinner size="xl" color="primary" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="danger" />
      <Spinner color="info" />
      <Spinner color="neutral" />
    </div>
  ),
};

export const CustomStyle: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Spinner size="lg" color="primary" thickness={4} emptyColor="var(--eta-border-default)" />
      <Spinner size="lg" color="secondary" speed="0.4s" />
      <Spinner size="xl" color="success" thickness={6} emptyColor="var(--eta-status-success-bg)" />
    </div>
  ),
};
