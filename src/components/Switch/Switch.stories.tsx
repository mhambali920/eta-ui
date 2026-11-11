import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    isInvalid: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
    description: 'Receive push notifications whenever someone mentions you.',
    size: 'md',
  },
};

export const Checked: Story = {
  args: {
    label: 'Auto-save changes',
    defaultChecked: true,
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch size="sm" label="Small Switch (18px)" />
      <Switch size="md" label="Medium Switch (24px)" defaultChecked />
      <Switch size="lg" label="Large Switch (30px)" />
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    label: 'Consent Required',
    description: 'You must toggle this setting before continuing.',
    isInvalid: true,
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked Feature',
    description: 'Upgrade your subscription to unlock this setting.',
    disabled: true,
    defaultChecked: true,
    size: 'md',
  },
};
