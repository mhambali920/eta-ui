import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded'],
    },
    status: {
      control: 'select',
      options: ['online', 'busy', 'away', 'offline'],
    },
    delayMs: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'Emily Watson',
    size: 'md',
    shape: 'circle',
    status: 'online',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    alt: 'Emily Watson',
    size: 'lg',
    status: 'online',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar size="xs" name="Extra Small" />
      <Avatar size="sm" name="Small Size" />
      <Avatar size="md" name="Medium Size" />
      <Avatar size="lg" name="Large Size" />
      <Avatar size="xl" name="Extra Large" />
    </div>
  ),
};

export const Group: StoryObj<typeof AvatarGroup> = {
  argTypes: {
    max: {
      control: 'number',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    max: 3,
    size: 'md',
  },
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar name="Alex Rivera" status="online" />
      <Avatar name="Brenda Taylor" status="busy" />
      <Avatar name="Chris Evans" status="away" />
      <Avatar name="Diana Prince" />
      <Avatar name="Evan Wright" />
    </AvatarGroup>
  ),
};
