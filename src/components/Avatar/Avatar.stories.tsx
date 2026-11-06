import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
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

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Alex Rivera" status="online" />
      <Avatar name="Brenda Taylor" status="busy" />
      <Avatar name="Chris Evans" status="away" />
      <Avatar name="Diana Prince" />
      <Avatar name="Evan Wright" />
    </AvatarGroup>
  ),
};
